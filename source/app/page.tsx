import { bySlug } from '@/lib/content';
import { metaFrom, PageView } from './_render';
const home = bySlug([])!;
export const metadata = metaFrom(home);
export default function Home() { return <PageView p={home} />; }
