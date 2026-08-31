import { notFound } from 'next/navigation';
import { WorkflowDetail } from '@/components/blocks/custom/workflow-detail';
import { getWorkflowSimple, workflowSimples } from '@/lib/public-catalog';
export function generateStaticParams() {
  return workflowSimples.map(({ slug }) => ({ slug }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getWorkflowSimple(slug);
  if (!item) notFound();
  return <WorkflowDetail domain={item.domain} label={item.label} />;
}
