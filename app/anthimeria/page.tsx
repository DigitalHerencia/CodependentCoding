import { AnthimeriaWorkbench } from '@/components/anthimeria-workbench';
import { ontologies } from '@/lib/public-catalog';

export default async function AnthimeriaPage({
  searchParams,
}: {
  searchParams: Promise<{ ontology?: string }>;
}) {
  const { ontology } = await searchParams;
  return (
    <AnthimeriaWorkbench
      catalog={ontologies}
      {...(ontology ? { initialId: ontology } : {})}
    />
  );
}
