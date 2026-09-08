import { readFileSync, readdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const CONTENT = join(process.cwd(), 'content');

export type PageMeta = {
  slug: string[];
  key: string;
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  jsonld: string[];
  hasStyles: boolean;
  hasScripts: boolean;
  redirectTo?: string;
};

export function loadManifest(): PageMeta[] {
  const manifestPath = join(CONTENT, 'manifest.json');
  let list: PageMeta[] = [];

  try {
    list = JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch {
    list = [];
  }

  let dirty = false;

  try {
    const files = readdirSync(CONTENT);
    const existingKeys = new Set(list.map((p) => p.key));

    // 1. Remove entries whose content HTML file was deleted (except redirect stubs)
    const filteredList = list.filter((item) => {
      if (item.redirectTo) return true; // Keep redirect stubs
      const fileKey = item.key || 'home';
      const exists = existsSync(join(CONTENT, `${fileKey}.html`));
      if (!exists) {
        dirty = true;
        return false;
      }
      return true;
    });

    if (dirty) {
      list = filteredList;
      existingKeys.clear();
      list.forEach((p) => existingKeys.add(p.key));
    }

    // 2. Add any HTML file in content/ that isn't yet in manifest
    for (const f of files) {
      if (f.endsWith('.html') && !f.endsWith('.styles.html')) {
        const key = f.slice(0, -5);
        if (!existingKeys.has(key)) {
          const slug = key === 'home' ? [] : key.split('__');
          const slugPath = slug.length ? '/' + slug.join('/') + '/' : '/';
          let htmlContent = '';
          try {
            htmlContent = readFileSync(join(CONTENT, f), 'utf8');
          } catch {}

          const titleMatch =
            htmlContent.match(/<title>([\s\S]*?)<\/title>/i) ||
            htmlContent.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
          const rawTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : key;
          const title = rawTitle.includes('Webstrail') ? rawTitle : `${rawTitle} | Webstrail`;

          const descMatch =
            htmlContent.match(/<meta\s+name="description"\s+content="([\s\S]*?)"/i) ||
            htmlContent.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
          const description = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim().slice(0, 160) : '';

          const ogMatch = htmlContent.match(/<meta\s+property="og:image"\s+content="([\s\S]*?)"/i);
          const ogImage = ogMatch ? ogMatch[1].trim() : 'https://webstrail.com/og-image.png';

          const newEntry: PageMeta = {
            slug,
            key,
            title,
            description,
            canonical: `https://webstrail.com${slugPath}`,
            ogImage,
            jsonld: [],
            hasStyles: existsSync(join(CONTENT, `${key}.styles.html`)),
            hasScripts: existsSync(join(CONTENT, `${key}.scripts.json`)),
          };

          list.push(newEntry);
          dirty = true;
        }
      }
    }

    if (dirty) {
      try {
        writeFileSync(manifestPath, JSON.stringify(list, null, 1), 'utf8');
      } catch (err) {
        console.error('Error writing updated manifest.json:', err);
      }
    }
  } catch (err) {
    console.error('Error scanning content folder in loadManifest:', err);
  }

  return list;
}

export const manifest: PageMeta[] = loadManifest();

export function decode(s: string): string {
  return (s || '')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
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
  try {
    return JSON.parse(readFileSync(join(CONTENT, key + '.scripts.json'), 'utf8'));
  } catch {
    return [];
  }
}

export function readStyles(key: string): string {
  try {
    const raw = readFileSync(join(CONTENT, key + '.styles.html'), 'utf8');
    return raw.replace(/<\/?style[^>]*>/gi, '');
  } catch {
    return '';
  }
}
