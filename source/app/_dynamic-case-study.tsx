import { readFileSync } from 'fs';
import { join } from 'path';
import type { Metadata } from 'next';
import PageScripts from './PageScripts';
import { DynamicCaseStudy, fetchDynamicCaseStudies } from '@/lib/dynamic-case-studies';
import { parseSheetDate } from '@/lib/dynamic-blogs';
import { fetchGoogleDocHtml } from '@/lib/gdoc';
import { getStaticCaseStudies, CaseStudySummary } from '@/lib/static-case-studies';

// Page for case studies that come from the case-studies API (not hand-built static pages).
//  * At build time every case study the API returns is rendered to full HTML here (approach
//    section, hero, details table, body from the Google Doc, related case studies).
//  * "/case-studies/_/" (and any slug added after the last build) gets the loading skeleton and is
//    filled in by the browser (public/case-study-detail.js). nginx serves it for unknown slugs.
const T = join(process.cwd(), 'templates');

const esc = (s: string) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
const norm = (s: string) => String(s || '').trim().toLowerCase();

const fmtLocal = (d: Date) =>
  new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  });
function isoDate(d: Date) {
  const p = (n: number) => (n < 10 ? '0' : '') + n;
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// Results text: every number (~75%, 200hrs, ~23$, rs23, 4x, 2→1 …) is wrapped — together with the
// sign/text joined to it, and a unit word right after it ("200 hrs", "3 days") — in
// <strong class="csd-num"> (primary blue). Commas, brackets and a final full stop stay outside.
function highlightNumbers(text: string): string {
  const src = String(text ?? '');
  const re = /[^\s,;:()]*\d[^\s,;:()]*(?:\s+(?:hrs?|hours?|mins?|minutes?|days?|weeks?|months?|years?|x|k|m|bn|percent)(?!\w))?/gi;
  let out = '';
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const core = m[0].replace(/[.!?]+$/, '');
    out += esc(src.slice(last, m.index)) + '<strong class="csd-num">' + esc(core) + '</strong>' + esc(m[0].slice(core.length));
    last = m.index + m[0].length;
  }
  return out + esc(src.slice(last));
}

function parseAuthor(raw: string) {
  const parts = String(raw || '').split('|').map((p) => p.trim()).filter(Boolean);
  let url = '';
  if (parts.length > 1 && /^(https?:)?\/*(www\.)?[\w-]+(\.[\w-]+)+/i.test(parts[parts.length - 1])) {
    url = (parts.pop() as string).replace(/^(https?:)?\/*/i, 'https://');
  }
  return { name: parts[0] || '', role: parts.slice(1).join(', '), url };
}

// Same rule as the browser (public/case-studies-data.js): same category (first keyword) first,
// max 5, then fill with other case studies. On the server the filler is picked deterministically
// (seeded by the slug) so the prerendered page is stable.
function seededOrder<T>(items: T[], seed: string): T[] {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const rnd = () => ((h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0) / 4294967296);
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function related(all: CaseStudySummary[], cur: CaseStudySummary, max = 5): CaseStudySummary[] {
  const cat = norm(cur.keyword);
  const others = all.filter((b) => norm(b.slug) !== norm(cur.slug));
  const same = others.filter((b) => cat && norm(b.keyword) === cat);
  if (same.length >= max) return same.slice(0, max);
  const rest = seededOrder(others.filter((b) => !same.includes(b)), cur.slug);
  return same.concat(rest.slice(0, max - same.length));
}

// ---- tiny template helpers: find an element by id and replace/inspect it ----------------------
function findElement(html: string, id: string) {
  const open = new RegExp(`<(\\w+)([^>]*\\bid="${id}"[^>]*)>`).exec(html);
  if (!open) throw new Error(`case-study-detail template changed: missing #${id}`);
  const tag = open[1];
  const start = open.index;
  const innerStart = start + open[0].length;
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'g');
  re.lastIndex = innerStart;
  let depth = 1;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return { start, innerStart, innerEnd: m.index, end: m.index + m[0].length, openTag: open[0] };
  }
  throw new Error(`case-study-detail template changed: unclosed #${id}`);
}
function setInner(html: string, id: string, inner: string, extraAttrs = '') {
  const e = findElement(html, id);
  const openTag = extraAttrs ? e.openTag.replace(/>$/, ` ${extraAttrs}>`) : e.openTag;
  return html.slice(0, e.start) + openTag + inner + html.slice(e.innerEnd);
}
function removeElement(html: string, id: string) {
  const e = findElement(html, id);
  return html.slice(0, e.start) + html.slice(e.end);
}

async function renderCaseStudyHtml(template: string, cs: DynamicCaseStudy, all: CaseStudySummary[]) {
  let h = template;
  const kws = cs.keywords.split(',').map((k) => k.trim()).filter(Boolean);

  // How we approached it
  if (cs.approachtitle || cs.approachdescription) {
    h = setInner(h, 'cdApproachTitle', esc(cs.approachtitle));
    const paras = cs.approachdescription.split(/\r?\n+/).map((p) => p.trim()).filter(Boolean);
    h = setInner(h, 'cdApproachBody', paras.map((p) => `<p>${esc(p)}</p>`).join(''));
  } else {
    h = removeElement(h, 'cdApproach');
  }

  // Hero
  h = setInner(h, 'cdHero', findInnerOf(h, 'cdHero'), 'data-ssr="1"');
  h = setInner(h, 'cdSmall', esc(cs.smalltitle || cs.title));
  h = setInner(h, 'cdEyebrow', esc([cs.type, kws[0]].filter(Boolean).join(' · ')));
  h = setInner(h, 'cdTitle', esc(cs.title));
  h = setInner(h, 'cdLead', esc(cs.details || cs.description));
  h = cs.result
    ? setInner(h, 'cdResult', `<strong style="color:var(--azure-deep)">Results:</strong> ${highlightNumbers(cs.result)}`)
    : removeElement(h, 'cdResult');

  const au = parseAuthor(cs.author);
  const parts: string[] = [];
  if (au.name) {
    const who = au.url
      ? `<a href="${esc(au.url)}" target="_blank" rel="noopener noreferrer" style="color:inherit">${esc(au.name)}</a>`
      : esc(au.name);
    parts.push(`<span class="byline__author">${who}${au.role ? ', ' + esc(au.role) : ''}</span>`);
  }
  const pub = parseSheetDate(cs.publishedon);
  const upd = parseSheetDate(cs.updatedon);
  if (pub) parts.push(`Published <time datetime="${isoDate(pub)}">${fmtLocal(pub)}</time>`);
  if (upd) parts.push(`Updated <time datetime="${isoDate(upd)}">${fmtLocal(upd)}</time>`);
  h = parts.length ? setInner(h, 'cdByline', parts.join(' <span class="dot">·</span> ')) : removeElement(h, 'cdByline');

  const chips =
    (cs.type ? `<span class="csd-chip">${esc(cs.type)}</span>` : '') +
    kws.map((k, i) => `<span class="csd-chip${i === 0 ? '' : ' csd-chip--soft'}">${esc(k)}</span>`).join('');
  h = setInner(h, 'cdChips', chips);

  // Details table: Client / Type / Focus / What we did
  const cells: [string, string][] = [['Client', cs.client], ['Type', cs.type], ['Focus', cs.focus], ['What we did', cs.what_we_did]];
  h = setInner(h, 'cdMeta', cells.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join(''));

  // Related Case Studies
  const rel = related(all, cs);
  h = rel.length
    ? setInner(
        h,
        'related-case-studies',
        `<section class="related-blogs prose"><h2>Related Case Studies</h2><div class="blog-list">${rel
          .map((b) => `<div><a href="/case-studies/${encodeURIComponent(b.slug)}/">${esc(b.title)}</a></div>`)
          .join('')}</div></section>`
      )
    : removeElement(h, 'related-case-studies');

  // Body from the Google Doc. If it cannot be read the skeleton stays and the browser fills it in.
  const body = cs.doc ? await fetchGoogleDocHtml(cs.doc) : '';
  if (body) h = setInner(h, 'cdContent', body, 'data-ssr="1"');
  return h;
}

// inner HTML of an element, used to add an attribute without changing the content
function findInnerOf(html: string, id: string) {
  const e = findElement(html, id);
  return html.slice(e.innerStart, e.innerEnd);
}

export async function DynamicCaseStudyView({ slug }: { slug: string }) {
  let html = readFileSync(join(T, 'case-study-detail.html'), 'utf8');
  const scripts = JSON.parse(readFileSync(join(T, 'case-study-detail.scripts.json'), 'utf8'));
  let jsonLd: string | null = null;

  if (slug !== '_') {
    const dyn = await fetchDynamicCaseStudies();
    const cs = dyn?.find((b) => norm(b.slug) === norm(slug));
    if (cs) {
      const all: CaseStudySummary[] = [...getStaticCaseStudies(), ...(dyn as DynamicCaseStudy[])];
      html = await renderCaseStudyHtml(html, cs, all);
      const url = `https://webstrail.com/case-studies/${encodeURIComponent(cs.slug)}/`;
      const published = parseSheetDate(cs.publishedon);
      const updated = parseSheetDate(cs.updatedon);
      jsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: cs.title,
        description: cs.description || cs.details,
        mainEntityOfPage: url,
        ...(published ? { datePublished: isoDate(published) } : {}),
        ...(updated || published ? { dateModified: isoDate((updated || published) as Date) } : {}),
        author: { '@type': 'Organization', name: 'Webstrail' },
        publisher: { '@type': 'Organization', name: 'Webstrail', url: 'https://webstrail.com/' },
      });
    }
  }

  return (
    <>
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} /> : null}
      <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />
      <PageScripts scripts={scripts} />
    </>
  );
}

export async function dynamicCaseStudyMetadata(slug: string): Promise<Metadata> {
  const fallback: Metadata = {
    title: 'Case Study | Webstrail',
    description: 'Real dental software Webstrail has designed, built, and run.',
  };
  if (slug === '_') return fallback;
  const c = (await fetchDynamicCaseStudies())?.find((x) => norm(x.slug) === norm(slug));
  if (!c) return fallback;
  const title = `${c.title} | Webstrail Case Study`;
  const description = c.description || c.details || (fallback.description as string);
  const url = `https://webstrail.com/case-studies/${encodeURIComponent(c.slug)}/`;
  const img = 'https://webstrail.com/og-image.png';
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'article', siteName: 'Webstrail', locale: 'en_US', url, title, description, images: [{ url: img }] },
    twitter: { card: 'summary_large_image', title, description, images: [img] },
  };
}
