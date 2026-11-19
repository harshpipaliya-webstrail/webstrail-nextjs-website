// Server-side (build-time / dev-request) access to the dynamic blogs in the Google Sheet.
// Used for: prerendered page metadata, generateStaticParams and the sitemap.
// The browser loads the same data on its own (public/blogs-data.js).
import { manifest } from '@/lib/content';

const CSV_URL =
  process.env.BLOGS_CSV_URL ||
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQbjnDbpIZJO3aih8FWMjA0N2cozW8xcf0RcJjCm5qgSTrso0xhXVJB1Jj_8HeEpohyfs7Llu0sAwKT/pub?output=csv';

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

function parseCSV(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQ && text[i + 1] === '"') { cur += '"'; i++; } else { inQ = !inQ; }
    } else if (ch === ',' && !inQ) { row.push(cur); cur = ''; }
    else if (ch === '\n' && !inQ) { row.push(cur); result.push(row); row = []; cur = ''; }
    else if (ch === '\r' && !inQ) { /* ignore */ }
    else { cur += ch; }
  }
  if (cur || row.length > 0) { row.push(cur); result.push(row); }
  return result;
}

/** Slugs of the hand-built static blog pages (content/blog__<slug>.html). */
export function staticBlogSlugs(): Set<string> {
  return new Set(
    manifest
      .filter((p) => p.slug.length === 2 && p.slug[0] === 'blog')
      .map((p) => p.slug[1].toLowerCase())
  );
}

/** Parses M/D/YYYY (Google Sheets) or ISO dates. */
export function parseSheetDate(s: string): Date | null {
  const t = (s || '').trim();
  if (!t) return null;
  const m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  const d = m ? new Date(+m[3], +m[1] - 1, +m[2]) : new Date(t);
  return isNaN(d.getTime()) ? null : d;
}

/** Dynamic blogs from the sheet, excluding any slug that already exists as a static blog. Never throws. */
export async function getDynamicBlogs(): Promise<DynamicBlog[]> {
  try {
    const res = await fetch(CSV_URL, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error('Sheet responded ' + res.status);
    const rows = parseCSV(await res.text());
    const headers = (rows[0] || []).map((h) => h.trim().toLowerCase());
    const taken = staticBlogSlugs();
    const seen = new Set<string>();
    const out: DynamicBlog[] = [];
    for (const r of rows.slice(1)) {
      const o: Record<string, string> = {};
      headers.forEach((h, i) => { o[h] = r[i] ? r[i].trim() : ''; });
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
    console.warn('[dynamic-blogs] could not read the sheet:', (err as Error).message);
    return [];
  }
}
