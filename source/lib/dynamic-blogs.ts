// Server-side (build-time / dev-request) access to the dynamic blogs, from the blogs API.
// Used for: prerendered page metadata, generateStaticParams and the sitemap.
// The browser loads the same data on its own (public/blogs-data.js).
import { manifest } from '@/lib/content';
import { api } from '@/lib/api';
import { getJson } from '@/lib/http';

const API_URL = api('/api/v1/blogs');

export type DynamicBlog = {
  slug: string;
  title: string;
  description: string;
  details: string;
  category: string;
  heroimage: string;
  doc: string;
  uploadedby: string;
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

/** Dynamic blogs from the API (excluding slugs that exist as static blogs); null if the API could not be read. Never throws. */
let buildCache: Promise<DynamicBlog[] | null> | null = null;
export function fetchDynamicBlogs(): Promise<DynamicBlog[] | null> {
  // `next build` renders many pages: read the API once. In dev always read fresh.
  if (process.env.NODE_ENV !== 'production') return readDynamicBlogs();
  return (buildCache ??= readDynamicBlogs());
}

async function readDynamicBlogs(): Promise<DynamicBlog[] | null> {
  try {
    const data = await getJson<{ blogs?: Record<string, string>[] }>(API_URL);
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
        doc: o.doc || '',
        uploadedby: o.uploadedby || '',
        createdon: o.createdon || '',
        updatedon: o.updatedon || '',
      });
    }
    return out;
  } catch (err) {
    console.warn('[dynamic-blogs] could not read the blogs API:', (err as Error).message);
    return null;
  }
}

/** Same as fetchDynamicBlogs but [] when the API is unreachable. */
export async function getDynamicBlogs(): Promise<DynamicBlog[]> {
  return (await fetchDynamicBlogs()) ?? [];
}
