import { readFileSync } from 'fs';
import { join } from 'path';

const CONTENT = join(process.cwd(), 'content');

export type PageMeta = {
  slug: string[]; key: string; title: string; description: string;
  canonical: string; ogImage: string; jsonld: string[];
  hasStyles: boolean; hasScripts: boolean;
  redirectTo?: string;
};

export const manifest: PageMeta[] = JSON.parse(
  readFileSync(join(CONTENT, 'manifest.json'), 'utf8')
);

export function decode(s: string): string {
  return (s || '')
    .replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

export function bySlug(slug: string[] | undefined): PageMeta | undefined {
  const s = slug ?? [];
  const key = s.length ? s.join('__') : 'home';
  return manifest.find((p) => p.key === key);
}

export function readContent(key: string): string {
  return readFileSync(join(CONTENT, key + '.html'), 'utf8');
}
export function readScripts(key: string): { src?: string; code?: string }[] {
  try { return JSON.parse(readFileSync(join(CONTENT, key + '.scripts.json'), 'utf8')); }
  catch { return []; }
}
export function readStyles(key: string): string {
  try {
    const raw = readFileSync(join(CONTENT, key + '.styles.html'), 'utf8');
    return raw.replace(/<\/?style[^>]*>/gi, '');
  } catch { return ''; }
}
