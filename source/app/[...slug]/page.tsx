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
  return <PageView p={p} />;
}
