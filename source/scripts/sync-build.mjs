import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outSitemap = join(__dirname, '..', 'out', 'sitemap.xml');
const siteSitemap = join(__dirname, '..', '..', 'site', 'sitemap.xml');

if (existsSync(outSitemap)) {
  mkdirSync(dirname(siteSitemap), { recursive: true });
  copyFileSync(outSitemap, siteSitemap);
  console.log('✓ Synced sitemap.xml to site/sitemap.xml');
}
