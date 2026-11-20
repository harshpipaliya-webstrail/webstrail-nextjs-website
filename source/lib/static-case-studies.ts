// The registry of static case studies lives in public/case-studies-static.js (a browser script,
// so the client can use it). The server reads the very same file: one source of truth.
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import vm from 'vm';

export type CaseStudySummary = {
  slug: string;
  type: string;
  keyword: string; // first keyword = category
  title: string;
  description: string;
};

export function getStaticCaseStudies(): CaseStudySummary[] {
  try {
    const code = readFileSync(join(process.cwd(), 'public', 'case-studies-static.js'), 'utf8');
    const sandbox: { window: { WEBSTRAIL_STATIC_CASE_STUDIES?: CaseStudySummary[] } } = { window: {} };
    vm.runInNewContext(code, sandbox);
    return sandbox.window.WEBSTRAIL_STATIC_CASE_STUDIES ?? [];
  } catch (err) {
    console.warn('[static-case-studies] could not read public/case-studies-static.js:', (err as Error).message);
    return [];
  }
}

/** Slugs that exist as hand-built pages (public/case-studies/<slug>/index.html) or in the registry. */
export function staticCaseStudySlugs(): Set<string> {
  const out = new Set<string>(getStaticCaseStudies().map((c) => c.slug.toLowerCase()));
  try {
    const base = join(process.cwd(), 'public', 'case-studies');
    for (const d of readdirSync(base)) {
      if (statSync(join(base, d)).isDirectory()) out.add(d.toLowerCase());
    }
  } catch { /* no public/case-studies */ }
  return out;
}
