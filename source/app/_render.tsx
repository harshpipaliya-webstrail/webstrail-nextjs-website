import type { Metadata } from 'next';
import { PageMeta, decode, readContent, readScripts, readStyles } from '@/lib/content';
import PageScripts from './PageScripts';

export function metaFrom(p: PageMeta): Metadata {
  const title = decode(p.title);
  const description = decode(p.description);
  const url = p.canonical;
  const img = p.ogImage || 'https://webstrail.com/og-image.png';
  return {
    title, description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website', siteName: 'Webstrail', locale: 'en_US',
      url, title, description,
      images: [{ url: img, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [img] },
  };
}

export function PageView({ p }: { p: PageMeta }) {
  const html = readContent(p.key);
  const styles = p.hasStyles ? readStyles(p.key) : '';
  const scripts = readScripts(p.key);
  return (
    <>
      {styles ? <style dangerouslySetInnerHTML={{ __html: styles }} /> : null}
      {p.jsonld.map((block, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: block }} />
      ))}
      <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />
      {scripts.length ? <PageScripts scripts={scripts} /> : null}
    </>
  );
}
