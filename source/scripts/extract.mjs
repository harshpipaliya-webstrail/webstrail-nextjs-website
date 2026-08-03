// Reads the existing static directory-pages and emits a manifest + content fragments
// so Next renders byte-identical HTML. Leaf .html pages are served from public/ (not here).
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');           // the static site root
const OUT = join(__dirname, '..', 'content');
mkdirSync(OUT, { recursive: true });

// Only these top-level areas are rendered by Next (trailing-slash dir pages).
const AREAS = ['services', 'who-we-work-with', 'resources', 'about'];

function findIndexPages() {
  const pages = [];
  // homepage
  pages.push({ file: join(ROOT, 'index.html'), slug: [] });
  for (const area of AREAS) {
    const base = join(ROOT, area);
    const walk = (dir) => {
      let entries; try { entries = readdirSync(dir); } catch { return; }
      for (const e of entries) {
        const p = join(dir, e);
        const st = statSync(p);
        if (st.isDirectory()) walk(p);
        else if (e === 'index.html') {
          const rel = p.slice(ROOT.length + 1, -('index.html'.length + 1));
          pages.push({ file: p, slug: rel.split('/') });
        }
      }
    };
    walk(base);
  }
  return pages;
}

const rx = {
  head: /<head[^>]*>([\s\S]*?)<\/head>/i,
  body: /<body[^>]*>([\s\S]*?)<\/body>/i,
  title: /<title>([\s\S]*?)<\/title>/i,
  desc: /<meta\s+name="description"\s+content="([\s\S]*?)"/i,
  canon: /<link\s+rel="canonical"\s+href="([\s\S]*?)"/i,
  ogimg: /<meta\s+property="og:image"\s+content="([\s\S]*?)"/i,
  ogtitle: /<meta\s+property="og:title"\s+content="([\s\S]*?)"/i,
  jsonld: /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi,
  style: /<style[^>]*>[\s\S]*?<\/style>/gi,
  script: /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
  srcAttr: /src="([^"]+)"/i,
  deferAttr: /\bdefer\b/i,
};

function decode(s){ return s.replace(/&amp;/g,'&'); }

const manifest = [];
for (const { file, slug } of findIndexPages()) {
  const html = readFileSync(file, 'utf8');
  const head = (html.match(rx.head) || [,''])[1];
  const bodyRaw = (html.match(rx.body) || [,''])[1];

  const title = (html.match(rx.title) || [,''])[1].trim();
  const description = (html.match(rx.desc) || [,''])[1];
  const canonical = (html.match(rx.canon) || [,''])[1];
  const ogImage = (html.match(rx.ogimg) || [,''])[1];

  // JSON-LD (usually one graph)
  const jsonld = [];
  let m; rx.jsonld.lastIndex = 0;
  while ((m = rx.jsonld.exec(html))) jsonld.push(m[1]);

  // inline <style> blocks from <head> — preserved verbatim (type-scale / content-max overrides)
  const styles = (head.match(rx.style) || []).join('\n');

  // extract scripts from body (in order) then strip them from the content
  const scripts = [];
  rx.script.lastIndex = 0;
  while ((m = rx.script.exec(bodyRaw))) {
    const attrs = m[1] || '', code = m[2] || '';
    const src = (attrs.match(rx.srcAttr) || [,''])[1];
    if (src) scripts.push({ src });
    else if (code.trim()) scripts.push({ code });
  }
  const content = bodyRaw.replace(rx.script, '').replace(/\n{3,}/g, '\n\n').trim();

  const key = slug.length ? slug.join('__') : 'home';
  writeFileSync(join(OUT, key + '.html'), content, 'utf8');
  writeFileSync(join(OUT, key + '.scripts.json'), JSON.stringify(scripts), 'utf8');
  if (styles) writeFileSync(join(OUT, key + '.styles.html'), styles, 'utf8');

  manifest.push({
    slug, key, title, description, canonical, ogImage,
    jsonld, hasStyles: !!styles, hasScripts: scripts.length > 0,
  });
}

writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1), 'utf8');
console.log('extracted', manifest.length, 'pages ->', OUT);
console.log('sample slugs:', manifest.slice(0, 6).map(p => '/' + p.slug.join('/')).join('  '));
