import { readFileSync } from 'fs';
import { join } from 'path';
import type { Metadata } from 'next';
import PageScripts from './PageScripts';
import { getDynamicBlogs } from '@/lib/dynamic-blogs';

// Template page for blogs that come from the Google Sheet. The blog itself is rendered in the
// browser (public/blog-detail.js); the <head> metadata is prerendered when the sheet is readable.
const T = join(process.cwd(), 'templates');

export function DynamicBlogView() {
  const html = readFileSync(join(T, 'blog-detail.html'), 'utf8');
  const scripts = JSON.parse(readFileSync(join(T, 'blog-detail.scripts.json'), 'utf8'));
  return (
    <>
      <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />
      <PageScripts scripts={scripts} />
    </>
  );
}

export async function dynamicBlogMetadata(slug: string): Promise<Metadata> {
  const fallback: Metadata = {
    title: 'Blog | Webstrail',
    description: 'Guides and insights on custom dental software from Webstrail.',
  };
  if (slug === '_') return fallback;
  const b = (await getDynamicBlogs()).find((x) => x.slug.toLowerCase() === slug.toLowerCase());
  if (!b) return fallback;
  const title = `${b.title} | Webstrail`;
  const description = b.description || b.details || fallback.description!;
  const url = `https://webstrail.com/blog/${encodeURIComponent(b.slug)}/`;
  const img = b.heroimage || 'https://webstrail.com/og-image.png';
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'article', siteName: 'Webstrail', locale: 'en_US', url, title, description, images: [{ url: img }] },
    twitter: { card: 'summary_large_image', title, description, images: [img] },
  };
}
