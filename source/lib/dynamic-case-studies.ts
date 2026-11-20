// Server-side (build-time / dev-request) access to the dynamic case studies, from the case-studies
// API. Used for: prerendered pages + metadata, generateStaticParams and the sitemap.
// The browser loads the same data on its own (public/case-studies-data.js).
import { staticCaseStudySlugs } from '@/lib/static-case-studies';
import { api } from '@/lib/api';

const API_URL = api('/api/v1/case-studies');

export type DynamicCaseStudy = {
  slug: string;
  type: string;
  keywords: string;
  keyword: string; // first keyword
  title: string;
  description: string;
  details: string;
  approachtitle: string;
  approachdescription: string;
  smalltitle: string;
  result: string;
  author: string;
  publishedon: string;
  updatedon: string;
  client: string;
  focus: string;
  what_we_did: string;
  doc: string;
};

let buildCache: Promise<DynamicCaseStudy[] | null> | null = null;
/** Dynamic case studies (excluding slugs that exist as static pages); null if the API could not be read. Never throws. */
export function fetchDynamicCaseStudies(): Promise<DynamicCaseStudy[] | null> {
  // `next build` renders many pages: read the API once. In dev always read fresh.
  if (process.env.NODE_ENV !== 'production') return readDynamicCaseStudies();
  return (buildCache ??= readDynamicCaseStudies());
}

async function readDynamicCaseStudies(): Promise<DynamicCaseStudy[] | null> {
  try {
    const res = await fetch(API_URL, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error('API responded ' + res.status);
    const data = await res.json();
    const rows: Record<string, unknown>[] = Array.isArray(data)
      ? data
      : (Object.values(data || {}).find(Array.isArray) as Record<string, unknown>[] | undefined) ?? [];
    const taken = staticCaseStudySlugs();
    const seen = new Set<string>();
    const out: DynamicCaseStudy[] = [];
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
        type: o.type || '',
        keywords: o.keywords || '',
        keyword: (o.keywords || '').split(',')[0].trim(),
        title: o.title,
        description: o.description || '',
        details: o.details || '',
        approachtitle: o.approachtitle || '',
        approachdescription: o.approachdescription || '',
        smalltitle: o.smalltitle || '',
        result: o.result || '',
        author: o.author || '',
        publishedon: o.publishedon || '',
        updatedon: o.updatedon || '',
        client: o.client || '',
        focus: o.focus || '',
        what_we_did: o.what_we_did || '',
        doc: o.doc || '',
      });
    }
    return out;
  } catch (err) {
    console.warn('[dynamic-case-studies] could not read the case-studies API:', (err as Error).message);
    return null;
  }
}

export async function getDynamicCaseStudies(): Promise<DynamicCaseStudy[]> {
  return (await fetchDynamicCaseStudies()) ?? [];
}
