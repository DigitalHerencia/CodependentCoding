import { notFound } from 'next/navigation';
import { ontologyCatalog } from '@hipster-stack/core';
import { OntologyCatalog } from '@/components/ontology-catalog';
export function generateStaticParams() {
  return Object.keys(ontologyCatalog).map((slug) => ({ slug }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!(slug in ontologyCatalog)) notFound();
  return <OntologyCatalog selectedId={slug as keyof typeof ontologyCatalog} />;
}
