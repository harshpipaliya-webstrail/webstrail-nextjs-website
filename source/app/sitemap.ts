import { MetadataRoute } from 'next';
import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join, posix } from 'path';

const BASE_URL = 'https://webstrail.com';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

function getPriorityAndChangeFreq(urlPath: string): { priority: number; changeFrequency: ChangeFrequency } {
  const cleanPath = '/' + urlPath.replace(/^\/+|\/+$/g, '') + (urlPath === '/' || urlPath === '' ? '' : '/');

  if (cleanPath === '/') {
    return { priority: 1.0, changeFrequency: 'weekly' };
  }
  if (cleanPath === '/services/' || cleanPath === '/case-studies/' || cleanPath === '/contact/') {
    return { priority: 0.9, changeFrequency: 'monthly' };
  }
  if (cleanPath.startsWith('/services/')) {
    const segments = cleanPath.split('/').filter(Boolean);
    return {
      priority: segments.length === 2 ? 0.9 : 0.7,
      changeFrequency: 'monthly',
    };
  }
  if (cleanPath === '/who-we-work-with/' || cleanPath.startsWith('/who-we-work-with/')) {
    return { priority: 0.8, changeFrequency: 'monthly' };
  }
  if (cleanPath === '/resources/') {
    return { priority: 0.8, changeFrequency: 'weekly' };
  }
  if (cleanPath.startsWith('/blog/')) {
    return { priority: 0.7, changeFrequency: 'monthly' };
  }
  if (cleanPath.startsWith('/case-studies/')) {
    return { priority: 0.7, changeFrequency: 'monthly' };
  }
  if (cleanPath === '/about/') {
    return { priority: 0.7, changeFrequency: 'monthly' };
  }
  if (cleanPath === '/trust-service-center/') {
    return { priority: 0.4, changeFrequency: 'monthly' };
  }
  if (cleanPath === '/terms-of-service/' || cleanPath === '/privacy-policy/') {
    return { priority: 0.3, changeFrequency: 'yearly' };
  }
  return { priority: 0.7, changeFrequency: 'monthly' };
}

import { loadManifest } from '@/lib/content';

function getManifestPages(): MetadataRoute.Sitemap {
  try {
    const manifest = loadManifest();
    const contentDir = join(process.cwd(), 'content');
    const manifestPath = join(contentDir, 'manifest.json');
    const pages: MetadataRoute.Sitemap = [];

    for (const item of manifest) {
      if (item.redirectTo) continue; // Skip redirect stubs

      const slugPath = item.slug && item.slug.length ? '/' + item.slug.join('/') + '/' : '/';
      const contentFile = join(contentDir, (item.key || 'home') + '.html');

      let lastModified: Date = new Date();
      if (existsSync(contentFile)) {
        lastModified = statSync(contentFile).mtime;
      } else if (existsSync(manifestPath)) {
        lastModified = statSync(manifestPath).mtime;
      }

      const { priority, changeFrequency } = getPriorityAndChangeFreq(slugPath);

      pages.push({
        url: `${BASE_URL}${slugPath}`,
        lastModified,
        changeFrequency,
        priority,
      });
    }

    return pages;
  } catch (err) {
    console.error('Error reading manifest in dynamic sitemap:', err);
    return [];
  }
}

function getPublicPages(): MetadataRoute.Sitemap {
  const pubDir = join(process.cwd(), 'public');
  if (!existsSync(pubDir)) return [];

  const pages: MetadataRoute.Sitemap = [];
  const ignoredFolders = new Set(['Webstrail Design System', 'logos', '_next']);

  function walk(dir: string, rel: string = '') {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const e of entries) {
      if (!e.isDirectory() || ignoredFolders.has(e.name)) continue;

      const subDir = join(dir, e.name);
      const subRel = posix.join(rel, e.name);
      const indexPath = join(subDir, 'index.html');

      if (existsSync(indexPath)) {
        const urlPath = `/${subRel}/`;
        let lastModified = new Date();
        try {
          lastModified = statSync(indexPath).mtime;
        } catch {}

        const { priority, changeFrequency } = getPriorityAndChangeFreq(urlPath);

        pages.push({
          url: `${BASE_URL}${urlPath}`,
          lastModified,
          changeFrequency,
          priority,
        });
      }

      walk(subDir, subRel);
    }
  }

  walk(pubDir);
  return pages;
}

function getAppRoutes(): MetadataRoute.Sitemap {
  const appDir = join(process.cwd(), 'app');
  if (!existsSync(appDir)) return [];

  const pages: MetadataRoute.Sitemap = [];

  function walk(dir: string, rel: string = '') {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const e of entries) {
      if (!e.isDirectory()) continue;
      if (e.name.startsWith('[') || e.name.startsWith('_') || e.name.startsWith('(') || e.name === 'api') {
        continue;
      }

      const subDir = join(dir, e.name);
      const subRel = posix.join(rel, e.name);

      const hasPage =
        existsSync(join(subDir, 'page.tsx')) ||
        existsSync(join(subDir, 'page.jsx')) ||
        existsSync(join(subDir, 'page.js'));

      if (hasPage) {
        const pageFile = existsSync(join(subDir, 'page.tsx'))
          ? join(subDir, 'page.tsx')
          : existsSync(join(subDir, 'page.jsx'))
          ? join(subDir, 'page.jsx')
          : join(subDir, 'page.js');

        const urlPath = `/${subRel}/`;
        let lastModified = new Date();
        try {
          lastModified = statSync(pageFile).mtime;
        } catch {}

        const { priority, changeFrequency } = getPriorityAndChangeFreq(urlPath);
        pages.push({
          url: `${BASE_URL}${urlPath}`,
          lastModified,
          changeFrequency,
          priority,
        });
      }

      walk(subDir, subRel);
    }
  }

  walk(appDir);
  return pages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const manifestPages = getManifestPages();
  const publicPages = getPublicPages();
  const appRoutes = getAppRoutes();

  const all = [...manifestPages, ...publicPages, ...appRoutes];
  const seen = new Set<string>();
  const uniquePages: MetadataRoute.Sitemap = [];

  for (const page of all) {
    if (!seen.has(page.url)) {
      seen.add(page.url);
      uniquePages.push(page);
    }
  }

  return uniquePages;
}
