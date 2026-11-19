import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { manifest, bySlug } from '@/lib/content';
import { getDynamicBlogs } from '@/lib/dynamic-blogs';
import { metaFrom, PageView } from '../_render';
import { DynamicBlogView, dynamicBlogMetadata } from '../_dynamic-blog';
export const dynamicParams = false;

// /blog/<slug> for a blog that is NOT a hand-built static page: it comes from the blogs API.
const isDynamicBlogPath = (slug: string[]) => slug.length === 2 && slug[0] === 'blog';

export async function generateStaticParams() {
  const params = manifest.filter((p) => p.slug.length).map((p) => ({ slug: p.slug }));
  // "_" is the placeholder page the web server serves for blogs added after the last build
  // (see nginx.conf); blogs known at build time are prerendered with their own metadata.
  params.push({ slug: ['blog', '_'] });
  for (const b of await getDynamicBlogs()) params.push({ slug: ['blog', b.slug] });
  return params;
}
type Props = { params: { slug: string[] } };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = bySlug(params.slug);
  if (p) return metaFrom(p);
  if (isDynamicBlogPath(params.slug)) return dynamicBlogMetadata(params.slug[1]);
  return {};
}
export default function Page({ params }: Props) {
  const p = bySlug(params.slug);
  if (!p) {
    if (isDynamicBlogPath(params.slug)) return <DynamicBlogView />;
    notFound();
  }
  if (p.redirectTo) {
    return (
      <html>
        <head>
          <meta httpEquiv="refresh" content={`0; url=${p.redirectTo}`} />
          <link rel="canonical" href={`https://webstrail.com${p.redirectTo}`} />
        </head>
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.location.replace("${p.redirectTo}");`,
            }}
          />
          <p>
            Redirecting to <a href={p.redirectTo}>{p.redirectTo}</a>...
          </p>
        </body>
      </html>
    );
  }
  return <PageView p={p} />;
}
