// Converts a *published* Google Doc page (…/document/d/e/<id>/pub) into clean, semantic HTML so
// a blog body can be rendered on the server (at build time). No dependencies: a small tokenizer.
// Keeps headings, paragraphs, lists, links, images, tables, bold/italic; drops Google's styling.

import { getText } from '@/lib/http';

type Style = { bold: boolean; italic: boolean };

const VOID = new Set(['br', 'hr', 'img', 'meta', 'link', 'input', 'col']);
const HEAD: Record<string, string> = { h1: 'h2', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h4', h6: 'h4' };
const KEEP = new Set(['p', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'blockquote']);

const escAttr = (s: string) => s.replace(/&(?!(?:[a-z]+|#\d+|#x[0-9a-f]+);)/gi, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const decodeAmp = (s: string) => s.replace(/&amp;/g, '&');
const plain = (html: string) => html.replace(/<[^>]*>|&nbsp;|\s/g, '');

function attrs(raw: string): Record<string, string> {
  const o: Record<string, string> = {};
  const re = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw))) o[m[1].toLowerCase()] = m[2] ?? m[3] ?? '';
  return o;
}

function classStyles(css: string): Record<string, Style> {
  const map: Record<string, Style> = {};
  const re = /\.([\w-]+)\{([^}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) {
    map[m[1]] = {
      bold: /font-weight:\s*(700|800|900|bold)/.test(m[2]),
      italic: /font-style:\s*italic/.test(m[2]),
    };
  }
  return map;
}

function unwrapGoogleUrl(href: string): string {
  try {
    const u = new URL(href);
    if (/(^|\.)google\.com$/.test(u.hostname) && u.pathname === '/url' && u.searchParams.get('q')) {
      return u.searchParams.get('q') as string;
    }
  } catch { /* not absolute */ }
  return href;
}

export function gdocToHtml(page: string): string {
  const startTag = page.search(/<div[^>]*id="contents"[^>]*>/i);
  if (startTag < 0) return '';
  let css = '';
  page.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_m, c) => { css += c; return ''; });
  const styles = classStyles(css);

  const afterOpen = page.indexOf('>', startTag) + 1;
  const src = page
    .slice(afterOpen)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  type Frame = { tag: string; close: string; outStart: number; check: boolean };
  const stack: Frame[] = [];
  let out = '';
  let divDepth = 0;

  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>|([^<]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m[4] !== undefined) { out += m[4]; continue; }
    const closing = m[1] === '/';
    const tag = m[2].toLowerCase();
    const a = closing ? {} : attrs(m[3]);

    if (closing) {
      if (tag === 'div') {
        if (divDepth === 0) break; // end of the #contents wrapper
        divDepth--;
        continue;
      }
      // close up to the matching open frame (tolerates sloppy nesting)
      const idx = (() => { for (let i = stack.length - 1; i >= 0; i--) if (stack[i].tag === tag) return i; return -1; })();
      if (idx < 0) continue;
      while (stack.length > idx) {
        const f = stack.pop() as Frame;
        out += f.close;
        if (f.check && !plain(out.slice(f.outStart)) ) out = out.slice(0, f.outStart); // drop empty p/h
        else if (f.check && /^<(p|h\d)>(?:<br>)*<\/\1>$/.test(out.slice(f.outStart))) out = out.slice(0, f.outStart);
      }
      continue;
    }

    if (tag === 'div') { divDepth++; continue; }
    if (tag === 'br') { out += '<br>'; continue; }
    if (tag === 'hr') { out += '<hr>'; continue; }
    if (tag === 'img') {
      const s = decodeAmp(a.src || '');
      if (/^(https?:|data:image)/i.test(s)) out += `<img src="${escAttr(s)}" alt="${escAttr(a.alt || '')}" loading="lazy">`;
      continue;
    }
    if (VOID.has(tag)) continue;

    let open = '';
    let close = '';
    let check = false;
    if (HEAD[tag]) { open = `<${HEAD[tag]}>`; close = `</${HEAD[tag]}>`; check = true; }
    else if (KEEP.has(tag)) {
      let extra = '';
      if (tag === 'td' || tag === 'th') {
        if (a.colspan) extra += ` colspan="${escAttr(a.colspan)}"`;
        if (a.rowspan) extra += ` rowspan="${escAttr(a.rowspan)}"`;
      }
      open = `<${tag}${extra}>`; close = `</${tag}>`; check = tag === 'p';
    } else if (tag === 'a') {
      const href = unwrapGoogleUrl(decodeAmp(a.href || ''));
      if (/^(https?:|mailto:)/i.test(href)) {
        open = `<a href="${escAttr(href)}" target="_blank" rel="noopener noreferrer">`;
        close = '</a>';
      }
    } else if (tag === 'span' || tag === 'b' || tag === 'i' || tag === 'strong' || tag === 'em') {
      let bold = tag === 'b' || tag === 'strong';
      let italic = tag === 'i' || tag === 'em';
      for (const c of (a.class || '').split(/\s+/)) {
        if (styles[c]) { bold = bold || styles[c].bold; italic = italic || styles[c].italic; }
      }
      if (bold) { open += '<strong>'; close = '</strong>' + close; }
      if (italic) { open += '<em>'; close = '</em>' + close; }
    }
    // any other tag: transparent
    stack.push({ tag, close, outStart: out.length, check });
    out += open;
  }
  while (stack.length) out += (stack.pop() as Frame).close;
  return plain(out) ? out : '';
}

/** Fetches a published Google Doc and returns its body as clean HTML ('' if it cannot be read). */
export async function fetchGoogleDocHtml(docUrl: string): Promise<string> {
  try {
    const url = docUrl.replace(/([?&])embedded=true&?/, '$1').replace(/[?&]$/, '');
    return gdocToHtml(await getText(url, 20000));
  } catch (err) {
    console.warn('[gdoc] could not read the document:', (err as Error).message);
    return '';
  }
}
