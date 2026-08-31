import { notFound } from 'next/navigation';
import { OntologyDetailBlock } from '@/components/blocks/custom/ontology-surfaces';
import { getOntology, ontologies } from '@/lib/public-catalog';
export function generateStaticParams() {
  return ontologies.map(({ id }) => ({ slug: id }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ontology = getOntology(slug);
  if (!ontology) notFound();
  return <OntologyDetailBlock ontology={ontology} />;
}
