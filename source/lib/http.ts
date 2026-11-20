// Plain Node HTTP(S) GET used for build-time/server data (blogs API, case-studies API, Google Docs).
// Deliberately NOT `fetch`: inside Next's rendering, `fetch(..., { cache: 'no-store' })` marks the
// page as dynamic, and a dynamic page is silently skipped by `output: 'export'` — the /blog index
// and every API blog/case-study page went missing from out/. Node's own client is invisible to Next,
// and it never serves a stale copy from Next's data cache between builds.
import http from 'http';
import https from 'https';

export function getText(url: string, timeoutMs = 15000, redirects = 5): Promise<string> {
  return new Promise((resolve, reject) => {
    let u: URL;
    try { u = new URL(url); } catch (e) { return reject(e); }
    const lib = u.protocol === 'http:' ? http : https;
    const req = lib.get(
      u,
      { headers: { 'Accept-Encoding': 'identity', 'User-Agent': 'webstrail-build' }, timeout: timeoutMs },
      (res) => {
        const status = res.statusCode || 0;
        if (status >= 300 && status < 400 && res.headers.location && redirects > 0) {
          res.resume();
          return resolve(getText(new URL(res.headers.location, u).toString(), timeoutMs, redirects - 1));
        }
        if (status < 200 || status >= 300) {
          res.resume();
          return reject(new Error('HTTP ' + status));
        }
        res.setEncoding('utf8');
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve(body));
        res.on('error', reject);
      }
    );
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
  });
}

export async function getJson<T = unknown>(url: string, timeoutMs = 15000): Promise<T> {
  return JSON.parse(await getText(url, timeoutMs)) as T;
}
