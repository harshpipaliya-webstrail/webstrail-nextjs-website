import type { Metadata } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';
import PageScripts from '../../PageScripts';

// /blogs/<slug> — one template page; the blog itself is loaded in the browser
// from the blogs API / Google Sheet (see public/blog-detail.js).
//
// Static export: only the slugs returned below are prerendered. "_" is a placeholder page that
// the web server serves for any other slug (see nginx.conf), so blogs added to the sheet after
// a build still work without a rebuild.
export const dynamicParams = false;

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSa4eR2FTFbfqznRokU4Q2aUADm49xqym3Ki8so-C33YZ8tOetqF5oaGwRTVkBIea5Jm2MPfnsMMH-u/pub?output=csv';

function firstColumnSlugs(csv: string): string[] {
  // slug is column "slug"; parse header + quoted fields minimally
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];
    if (ch === '"') {
      if (inQ && csv[i + 1] === '"') { cur += '"'; i++; } else { inQ = !inQ; }
    } else if (ch === ',' && !inQ) { row.push(cur); cur = ''; }
    else if (ch === '\n' && !inQ) { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (ch === '\r' && !inQ) { /* ignore */ }
    else { cur += ch; }
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  const idx = (rows[0] || []).map((h) => h.trim().toLowerCase()).indexOf('slug');
  if (idx < 0) return [];
  return rows.slice(1).map((r) => (r[idx] || '').trim()).filter(Boolean);
}

export async function generateStaticParams() {
  const slugs = new Set<string>(['_']);
  try {
    const res = await fetch(CSV_URL, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
    if (res.ok) {
      for (const s of firstColumnSlugs(await res.text())) {
        if (/^[A-Za-z0-9_-]+$/.test(s)) slugs.add(s);
      }
    }
  } catch (err) {
    console.warn('[blogs/[slug]] could not read the sheet, only the placeholder page is generated');
  }
  return Array.from(slugs).map((slug) => ({ slug }));
}

export const metadata: Metadata = {
  title: 'Blog | Webstrail',
  description: 'Guides and insights on custom dental software from Webstrail.',
};

const T = join(process.cwd(), 'templates');

export default function BlogDetailPage() {
  const html = readFileSync(join(T, 'blog-detail.html'), 'utf8');
  const scripts = JSON.parse(readFileSync(join(T, 'blog-detail.scripts.json'), 'utf8'));
  return (
    <>
      <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />
      <PageScripts scripts={scripts} />
    </>
  );
}
