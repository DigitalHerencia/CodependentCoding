import { OntologyCatalogBlock } from '@/components/blocks/custom/ontology-surfaces';
import { ontologies } from '@/lib/public-catalog';

export default function OntologiesPage() {
  return <OntologyCatalogBlock ontologies={ontologies} />;
}
