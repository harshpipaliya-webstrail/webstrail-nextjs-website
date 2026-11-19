// Server-side (build-time / dev-request) access to the dynamic blogs, from the blogs API.
// Used for: prerendered page metadata, generateStaticParams and the sitemap.
// The browser loads the same data on its own (public/blogs-data.js).
import { manifest } from '@/lib/content';

// Override with BLOGS_API_URL. `next build` (NODE_ENV=production) uses the production API.
const API_URL =
  (process.env.NODE_ENV === 'production'
    ? 'https://api-webstrail.webstrail.com/api/v1/blogs'
    : 'http://localhost:5500/api/v1/blogs');

export type DynamicBlog = {
  slug: string;
  title: string;
  description: string;
  details: string;
  category: string;
  heroimage: string;
  createdon: string;
  updatedon: string;
};

/** Slugs of the hand-built static blog pages (content/blog__<slug>.html). */
export function staticBlogSlugs(): Set<string> {
  return new Set(
    manifest
      .filter((p) => p.slug.length === 2 && p.slug[0] === 'blog')
      .map((p) => p.slug[1].toLowerCase())
  );
}

/** Parses M/D/YYYY or ISO dates. */
export function parseSheetDate(s: string): Date | null {
  const t = (s || '').trim();
  if (!t) return null;
  const m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  const d = m ? new Date(+m[3], +m[1] - 1, +m[2]) : new Date(t);
  return isNaN(d.getTime()) ? null : d;
}

/** Dynamic blogs from the API, excluding any slug that already exists as a static blog. Never throws. */
export async function getDynamicBlogs(): Promise<DynamicBlog[]> {
  try {
    const res = await fetch(API_URL, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error('API responded ' + res.status);
    const data = await res.json();
    const rows: Record<string, string>[] = Array.isArray(data?.blogs) ? data.blogs : [];
    const taken = staticBlogSlugs();
    const seen = new Set<string>();
    const out: DynamicBlog[] = [];
    for (const r of rows) {
      const o: Record<string, string> = {};
      Object.keys(r || {}).forEach((k) => { o[k.toLowerCase()] = String(r[k] ?? '').trim(); });
      const slug = o.slug;
      if (!slug || !o.title || !/^[A-Za-z0-9_-]+$/.test(slug)) continue;
      const k = slug.toLowerCase();
      if (taken.has(k) || seen.has(k)) continue;
      seen.add(k);
      out.push({
        slug,
        title: o.title,
        description: o.description || '',
        details: o.details || '',
        category: o.category || '',
        heroimage: o.heroimage || '',
        createdon: o.createdon || '',
        updatedon: o.updatedon || '',
      });
    }
    return out;
  } catch (err) {
    console.warn('[dynamic-blogs] could not read the blogs API:', (err as Error).message);
    return [];
  }
}
