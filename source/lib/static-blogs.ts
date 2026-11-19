// The registry of static blogs lives in public/blogs-static.js (a browser script, so the
// client can use it). The server reads the very same file so there is one source of truth.
import { readFileSync } from 'fs';
import { join } from 'path';
import vm from 'vm';

export type BlogSummary = { slug: string; title: string; category: string; description: string };

export function getStaticBlogs(): BlogSummary[] {
  try {
    const code = readFileSync(join(process.cwd(), 'public', 'blogs-static.js'), 'utf8');
    const sandbox: { window: { WEBSTRAIL_STATIC_BLOGS?: BlogSummary[] } } = { window: {} };
    vm.runInNewContext(code, sandbox);
    return sandbox.window.WEBSTRAIL_STATIC_BLOGS ?? [];
  } catch (err) {
    console.warn('[static-blogs] could not read public/blogs-static.js:', (err as Error).message);
    return [];
  }
}
