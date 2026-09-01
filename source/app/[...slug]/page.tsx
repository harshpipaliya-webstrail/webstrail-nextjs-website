import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { manifest, bySlug } from '@/lib/content';
import { metaFrom, PageView } from '../_render';
export const dynamicParams = false;
export function generateStaticParams() {
  return manifest.filter((p) => p.slug.length).map((p) => ({ slug: p.slug }));
}
type Props = { params: { slug: string[] } };
export function generateMetadata({ params }: Props): Metadata {
  const p = bySlug(params.slug);
  return p ? metaFrom(p) : {};
}
export default function Page({ params }: Props) {
  const p = bySlug(params.slug);
  if (!p) notFound();
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
