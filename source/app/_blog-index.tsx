import type { PageMeta } from '@/lib/content';
import { readContent } from '@/lib/content';
import { fetchDynamicBlogs } from '@/lib/dynamic-blogs';
import { PageView } from './_render';

// /blog index. The 12 static cards live in content/blog.html. At build time the blogs from the API
// are added to the SAME grid in the HTML itself (first 3 visible, the rest hidden behind "Show
// more", plus the "Showing X of Y blogs" line), so crawlers and visitors get them without
// waiting for JavaScript. public/blog-index.js then refreshes the list from the API.
const SHOW_FIRST = 3;

const esc = (s: string) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

export async function BlogIndexView({ p }: { p: PageMeta }) {
  let html = readContent(p.key);
  const dyn = await fetchDynamicBlogs(); // null = API unreachable at build time

  if (dyn) {
    const normalized = html.replace(/\r\n/g, '\n');
    const staticCards = (normalized.match(/<a class="cs-card" href="\/blog\/[^"]+\/">/g) || []).length;
    const gridEnd = normalized.indexOf('          </div>\n          <div class="cs-sentinel"');
    const countTag = '<p class="cs-count" id="csCount" aria-live="polite"></p>';
    if (gridEnd > -1 && normalized.includes(countTag)) {
      let out = normalized.replace(/<div class="cs-card cs-card--skeleton"[^>]*>\s*<div class="cs-card__top">[\s\S]*?<\/div>[\s\S]*?<\/div>/g, '');
      const cards = dyn
        .map(
          (b, i) =>
            `<a class="cs-card" href="/blog/${encodeURIComponent(b.slug)}/" data-dyn="1"${i >= SHOW_FIRST ? ' hidden' : ''}>` +
            `<div class="cs-card__top"><span class="cs-tag">${esc(b.category)}</span></div>` +
            `<h3>${esc(b.title)}</h3><p>${esc(b.description)}</p>` +
            `<span class="cs-readmore">Read Blog <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg></span></a>`
        )
        .join('\n            ');
      const end = out.indexOf('          </div>\n          <div class="cs-sentinel"');
      out = out.slice(0, end) + (cards ? '            ' + cards + '\n' : '') + out.slice(end);
      const shown = staticCards + Math.min(SHOW_FIRST, dyn.length);
      const more =
        dyn.length > SHOW_FIRST
          ? `<div class="cs-showmore" id="csShowMore"><button type="button" class="btn btn--lg btn--secondary">Show more</button></div>\n          `
          : '';
      out = out.replace(countTag, `${more}<p class="cs-count" id="csCount" aria-live="polite">Showing ${shown} of ${staticCards + dyn.length} blogs</p>`);
      html = out;
    }
  }
  return <PageView p={p} html={html} />;
}
