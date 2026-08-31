import { notFound } from 'next/navigation';
import { PureUiDetail } from '@/components/blocks/custom/pure-ui-detail';
import { getPureUiSimple, pureUiSimples } from '@/lib/public-catalog';
export function generateStaticParams() {
  return pureUiSimples.map(([slug]) => ({ slug }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getPureUiSimple(slug);
  if (!item) notFound();
  return <PureUiDetail {...item} />;
}
