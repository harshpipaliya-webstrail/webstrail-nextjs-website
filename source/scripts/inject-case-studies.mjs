// Post-build step: write the API case studies into out/case-studies/index.html so they are in the
// HTML the server sends (not only added by JavaScript). The page itself is a hand-built static file
// (public/case-studies/index.html), so it cannot be rendered by Next; this patches the built copy.
// If the API cannot be reached the file is left untouched (the browser loads them instead).
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import nextEnv from '@next/env';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = join(root, 'out', 'case-studies', 'index.html');
nextEnv.loadEnvConfig(root); // reads .env (API_URL), like next build does
const API_URL = `${(process.env.API_URL || '').replace(/\/+$/, '')}/api/v1/case-studies`;
const SHOW_FIRST = 3;

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function fetchCaseStudies() {
  const res = await fetch(API_URL, { cache: 'no-store', signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error('API responded ' + res.status);
  const data = await res.json();
  const rows = Array.isArray(data) ? data : Object.values(data || {}).find(Array.isArray);
  if (!rows) throw new Error('Unexpected API response');
  return rows.map((r) => {
    const o = {};
    Object.keys(r || {}).forEach((k) => { o[k.toLowerCase()] = String(r[k] ?? '').trim(); });
    o.keyword = (o.keywords || '').split(',')[0].trim();
    return o;
  }).filter((o) => o.slug && o.title && /^[A-Za-z0-9_-]+$/.test(o.slug));
}

if (!existsSync(file)) { console.log('inject-case-studies: out/case-studies/index.html not found, skipping'); process.exit(0); }

let list;
try { list = await fetchCaseStudies(); }
catch (err) { console.warn('inject-case-studies: API not reachable, leaving the page as is:', err.message); process.exit(0); }

const raw = readFileSync(file, 'utf8');
const crlf = raw.includes('\r\n');
let html = raw.replace(/\r\n/g, '\n');

const staticSlugs = new Set([...html.matchAll(/<a class="cs-card" href="\/case-studies\/([^"\/]+)\/">/g)].map((m) => m[1].toLowerCase()));
const seen = new Set();
list = list.filter((o) => { const k = o.slug.toLowerCase(); if (staticSlugs.has(k) || seen.has(k)) return false; seen.add(k); return true; });

const end = html.indexOf('        </div>\n        <div class="cs-sentinel"');
const countTag = '<p class="cs-count" id="csCount" aria-live="polite"></p>';
if (end < 0 || !html.includes(countTag)) { console.warn('inject-case-studies: page structure changed, skipping'); process.exit(0); }

html = html.replace(/<div class="cs-card cs-card--skeleton"[^>]*>\s*<div class="cs-card__top">[\s\S]*?<\/div>[\s\S]*?<\/div>/g, '');
const cards = list.map((b, i) =>
  `          <a class="cs-card" href="/case-studies/${encodeURIComponent(b.slug)}/" data-dyn="1"${i >= SHOW_FIRST ? ' hidden' : ''}>` +
  `<div class="cs-card__top"><span class="cs-tag">${esc(b.type)}</span>${b.keyword ? `<span class="cs-theme">${esc(b.keyword)}</span>` : ''}</div>` +
  `<h3>${esc(b.title)}</h3><p>${esc(b.description)}</p>` +
  `<span class="cs-readmore">Read Case Study<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span></a>`
).join('\n');
const end2 = html.indexOf('        </div>\n        <div class="cs-sentinel"');
html = html.slice(0, end2) + (cards ? cards + '\n' : '') + html.slice(end2);

const shown = staticSlugs.size + Math.min(SHOW_FIRST, list.length);
const more = list.length > SHOW_FIRST
  ? '<div class="cs-showmore" id="csShowMore"><button type="button" class="btn btn--lg btn--secondary">Show more</button></div>\n        '
  : '';
html = html.replace(countTag, `${more}<p class="cs-count" id="csCount" aria-live="polite">Showing ${shown} of ${staticSlugs.size + list.length} case studies</p>`);

writeFileSync(file, crlf ? html.replace(/\n/g, '\r\n') : html);
console.log(`inject-case-studies: wrote ${list.length} API case stud${list.length === 1 ? 'y' : 'ies'} into out/case-studies/index.html`);
