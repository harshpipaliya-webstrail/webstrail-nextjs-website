import { API_URL } from '@/lib/api';

// /api-config.js — hands the API_URL environment variable (see .env) to the browser scripts as
// window.WEBSTRAIL_API_URL. Written into the static export at build time (changing API_URL needs a
// rebuild), generated on demand by `next dev`.
export const dynamic = 'force-static';

export function GET() {
  return new Response(`window.WEBSTRAIL_API_URL = ${JSON.stringify(API_URL)};\n`, {
    headers: { 'Content-Type': 'application/javascript; charset=utf-8' },
  });
}
