// GET /api/blogs — fetches the published Google Sheet (CSV) on the server and returns JSON,
// so the browser never talks to Google directly (no CORS issues).
//
// NOTE: the production site is a static export (`output: 'export'`), which has no server
// runtime. At build time this route is frozen into a static file, so it reports `live: false`
// and the /blogs page ignores it and calls the sheet directly instead. When the app runs on a
// Node server (`next dev` / `next start`) the route runs per request and `live` is true.
export const dynamic = 'force-static';

const CSV_URL =
  process.env.BLOGS_CSV_URL ||
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQbjnDbpIZJO3aih8FWMjA0N2cozW8xcf0RcJjCm5qgSTrso0xhXVJB1Jj_8HeEpohyfs7Llu0sAwKT/pub?output=csv';

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

export async function GET() {
  const live = process.env.NEXT_PHASE !== 'phase-production-build';
  if (!live) return Response.json({ live: false, blogs: [] });
  try {
    const res = await fetch(CSV_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Sheet responded ' + res.status);
    const rows = parseCSV(await res.text());
    const headers = (rows[0] || []).map((h) => h.trim().toLowerCase());
    const blogs = rows.slice(1).map((r) => {
      const o: Record<string, string> = {};
      headers.forEach((h, i) => { o[h] = r[i] ? r[i].trim() : ''; });
      return o;
    }).filter((b) => b.slug && b.title);
    return Response.json({ live: true, blogs });
  } catch (err) {
    console.error('[api/blogs] failed to load sheet', err);
    return Response.json({ live: true, blogs: [], error: 'Failed to load blogs' }, { status: 502 });
  }
}
