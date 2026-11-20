import type { Metadata } from 'next';
import { getDynamicCaseStudies } from '@/lib/dynamic-case-studies';
import { DynamicCaseStudyView, dynamicCaseStudyMetadata } from '../../_dynamic-case-study';

// /case-studies/<slug> for a case study that is NOT a hand-built static page (those are plain files
// in public/case-studies/<slug>/). It comes from the case-studies API.
// "_" is the placeholder page the web server serves for case studies added after the last build
// (see nginx.conf); case studies known at build time are prerendered with their own content.
export const dynamicParams = false;

export async function generateStaticParams() {
  const params = [{ slug: '_' }];
  for (const c of await getDynamicCaseStudies()) params.push({ slug: c.slug });
  return params;
}

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props): Promise<Metadata> {
  return dynamicCaseStudyMetadata(params.slug);
}

export default async function CaseStudyPage({ params }: Props) {
  return await DynamicCaseStudyView({ slug: params.slug });
}
