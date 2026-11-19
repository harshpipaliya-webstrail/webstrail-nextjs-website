import { readFileSync } from 'fs';
import { join } from 'path';
import type { Metadata } from 'next';
import PageScripts from './PageScripts';
import { DynamicBlog, fetchDynamicBlogs, parseSheetDate } from '@/lib/dynamic-blogs';
import { fetchGoogleDocHtml } from '@/lib/gdoc';
import { getStaticBlogs, BlogSummary } from '@/lib/static-blogs';

// Page for blogs that come from the blogs API (not hand-built static pages).
//  * At build time every blog the API returns is rendered to full HTML here (hero, body from the
//    Google Doc, related blogs) — so it is in the HTML the server sends, not built in the browser.
//  * "/blog/_/" (and any slug that was added after the last build) gets the loading skeleton and is
//    filled in by the browser (public/blog-detail.js). nginx serves it for unknown slugs.
const T = join(process.cwd(), 'templates');

const esc = (s: string) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
const norm = (s: string) => String(s || '').trim().toLowerCase();

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}
function isoDate(d: Date) {
  const p = (n: number) => (n < 10 ? '0' : '') + n;
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
// parseSheetDate builds a local-time date; format it in the same frame to avoid off-by-one days
const fmtLocal = (d: Date) => fmtDate(new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())));

function parseUploader(raw: string) {
  const parts = String(raw || '').split('|').map((p) => p.trim()).filter(Boolean);
  let url = '';
  if (parts.length > 1 && /^(https?:)?\/*(www\.)?[\w-]+(\.[\w-]+)+/i.test(parts[parts.length - 1])) {
    url = (parts.pop() as string).replace(/^(https?:)?\/*/i, 'https://');
  }
  return { name: parts[0] || '', role: parts.slice(1).join(', '), url };
}

// Same rule as the browser (public/blogs-data.js): same category first (max 5), then fill with
// other blogs. On the server the filler is picked deterministically (seeded by the slug) so the
// prerendered page is stable.
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
function related(all: BlogSummary[], cur: BlogSummary, max = 5): BlogSummary[] {
  const cat = norm(cur.category);
  const others = all.filter((b) => norm(b.slug) !== norm(cur.slug));
  const same = others.filter((b) => cat && norm(b.category) === cat);
  if (same.length >= max) return same.slice(0, max);
  const rest = seededOrder(others.filter((b) => !same.includes(b)), cur.slug);
  return same.concat(rest.slice(0, max - same.length));
}

function must(html: string, from: string, to: string) {
  if (!html.includes(from)) throw new Error('blog-detail template changed: missing ' + from.slice(0, 60));
  return html.replace(from, () => to);
}

async function renderBlogHtml(template: string, blog: DynamicBlog, all: BlogSummary[]) {
  let h = template;

  const up = parseUploader(blog.uploadedby);
  const parts: string[] = [];
  if (up.name) {
    const who = up.url
      ? `<a href="${esc(up.url)}" target="_blank" rel="noopener noreferrer" style="color:inherit">${esc(up.name)}</a>`
      : esc(up.name);
    parts.push(`<span class="byline__author">By ${who}${up.role ? ', ' + esc(up.role) : ''}</span>`);
  }
  const c = parseSheetDate(blog.createdon);
  const u = parseSheetDate(blog.updatedon);
  if (c) parts.push(`Published <time datetime="${isoDate(c)}">${fmtLocal(c)}</time>`);
  if (u) parts.push(`Updated <time datetime="${isoDate(u)}">${fmtLocal(u)}</time>`);

  h = must(h, '<div class="ihero__grid" id="bdHeroGrid">', '<div class="ihero__grid" id="bdHeroGrid" data-ssr="1">');
  h = must(h, '<span aria-current="page" id="bdCrumb">Loading…</span>', `<span aria-current="page" id="bdCrumb">${esc(blog.title)}</span>`);
  h = must(h, '<p class="eyebrow" id="bdCategory"></p>', blog.category ? `<p class="eyebrow" id="bdCategory">${esc(blog.category)}</p>` : '');
  h = must(h, '<h1 id="bdTitle"><span class="bd-sk bd-sk--h"></span></h1>', `<h1 id="bdTitle">${esc(blog.title)}</h1>`);
  h = must(
    h,
    '<p class="lede" id="bdLede"><span class="bd-sk bd-sk--l"></span><span class="bd-sk bd-sk--l"></span><span class="bd-sk bd-sk--l bd-sk--s"></span></p>',
    `<p class="lede" id="bdLede">${esc(blog.details || blog.description)}</p>`
  );
  h = must(h, '<p class="byline" id="bdByline"></p>', `<p class="byline" id="bdByline">${parts.join(' <span class="dot">·</span> ')}</p>`);
  h = must(
    h,
    '<div class="ihero__visual" id="bdVisual"><div class="mock__glow"></div><div class="ihero__viz" id="bdImage"></div></div>',
    blog.heroimage
      ? `<div class="ihero__visual" id="bdVisual"><div class="mock__glow"></div><div class="ihero__viz" id="bdImage"><img class="bd-hero-img" src="${esc(blog.heroimage)}" alt="${esc(blog.title)}" decoding="async" fetchpriority="high"></div></div>`
      : ''
  );

  // Related Blogs
  const rel = related(all, blog);
  const relStart = h.indexOf('<div id="related-blogs">');
  const relEnd = h.indexOf('<div class="prose blog-content"');
  if (relStart < 0 || relEnd < 0) throw new Error('blog-detail template changed: related/content');
  const relHtml = rel.length
    ? `<div id="related-blogs"><section class="related-blogs prose"><h2>Related Blogs</h2><div class="blog-list">${rel
        .map((b) => `<div><a href="/blog/${encodeURIComponent(b.slug)}/">${esc(b.title)}</a></div>`)
        .join('')}</div></section></div>\n      `
    : '';
  h = h.slice(0, relStart) + relHtml + h.slice(relEnd);

  // Body from the Google Doc. If it cannot be read the skeleton stays and the browser fills it in.
  const body = blog.doc ? await fetchGoogleDocHtml(blog.doc) : '';
  if (body) {
    const cs = h.indexOf('<div class="prose blog-content" id="bdContent">');
    const ce = h.indexOf('</div>', cs) + '</div>'.length;
    h = h.slice(0, cs) + `<div class="prose blog-content" id="bdContent" data-ssr="1">${body}</div>` + h.slice(ce);
  }
  return h;
}

export async function DynamicBlogView({ slug }: { slug: string }) {
  let html = readFileSync(join(T, 'blog-detail.html'), 'utf8');
  const scripts = JSON.parse(readFileSync(join(T, 'blog-detail.scripts.json'), 'utf8'));
  let jsonLd: string | null = null;

  if (slug !== '_') {
    const dyn = await fetchDynamicBlogs();
    const blog = dyn?.find((b) => norm(b.slug) === norm(slug));
    if (blog) {
      const stat = getStaticBlogs();
      const all: BlogSummary[] = [...stat, ...(dyn as DynamicBlog[])];
      html = await renderBlogHtml(html, blog, all);
      const url = `https://webstrail.com/blog/${encodeURIComponent(blog.slug)}/`;
      const created = parseSheetDate(blog.createdon);
      const updated = parseSheetDate(blog.updatedon);
      jsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: blog.title,
        description: blog.description || blog.details,
        mainEntityOfPage: url,
        ...(blog.heroimage ? { image: blog.heroimage } : {}),
        ...(created ? { datePublished: isoDate(created) } : {}),
        ...(updated || created ? { dateModified: isoDate((updated || created) as Date) } : {}),
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

export async function dynamicBlogMetadata(slug: string): Promise<Metadata> {
  const fallback: Metadata = {
    title: 'Blog | Webstrail',
    description: 'Guides and insights on custom dental software from Webstrail.',
  };
  if (slug === '_') return fallback;
  const b = (await fetchDynamicBlogs())?.find((x) => norm(x.slug) === norm(slug));
  if (!b) return fallback;
  const title = `${b.title} | Webstrail`;
  const description = b.description || b.details || (fallback.description as string);
  const url = `https://webstrail.com/blog/${encodeURIComponent(b.slug)}/`;
  const img = b.heroimage || 'https://webstrail.com/og-image.png';
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'article', siteName: 'Webstrail', locale: 'en_US', url, title, description, images: [{ url: img }] },
    twitter: { card: 'summary_large_image', title, description, images: [img] },
  };
}
