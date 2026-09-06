import Image from 'next/image';
import Link from 'next/link';
import type { Ontology } from '@/lib/public-catalog';

export function OntologyCatalogBlock({
  ontologies,
}: {
  ontologies: readonly Ontology[];
}) {
  return (
    <main className="ontology-catalog-page">
      <header className="surface-heading">
        <Image
          src="/Ontology Logo.jpg"
          alt="The Ontology"
          width={1200}
          height={400}
        />
        <p className="eyebrow">Normalized defaults</p>
        <h1>Start with behavior that already knows what it is.</h1>
        <p>
          Nine normalized constitutions over one shared foundation. Explore the
          domain before configuring its presentation.
        </p>
      </header>
      <section className="ontology-grid">
        {ontologies.map((ontology, index) => (
          <article
            className={index === 0 ? 'ontology-card featured' : 'ontology-card'}
            key={ontology.id}
          >
            <p className="eyebrow">
              {index === 0 ? 'Featured ontology' : 'Ontology'}
            </p>
            <h2>{ontology.label}</h2>
            <p>{ontology.description}</p>
            <dl>
              <div>
                <dt>Primary surfaces</dt>
                <dd>{ontology.surfaces.join(' · ')}</dd>
              </div>
              <div>
                <dt>Representative workflows</dt>
                <dd>{ontology.workflows.slice(0, 3).join(' · ')}</dd>
              </div>
            </dl>
            <Link
              className="brand-button brand-button-outline"
              href={`/ontologies/${ontology.id}`}
            >
              Explore
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

export function OntologyDetailBlock({ ontology }: { ontology: Ontology }) {
  return (
    <main className="ontology-detail">
      <header>
        <p className="eyebrow">The Ontology™</p>
        <h1>{ontology.label}</h1>
        <p>{ontology.description}</p>
        <div className="detail-actions">
          <Link
            className="brand-button"
            href={`/anthimeria?ontology=${ontology.id}`}
          >
            Configure in Anthimeria
          </Link>
          <Link
            className="brand-button brand-button-outline"
            href="/ontologies"
          >
            All ontologies
          </Link>
        </div>
      </header>
      <div className="ontology-detail-grid">
        <section>
          <h2>Normalized surfaces</h2>
          <ul>
            {ontology.surfaces.map((surface) => (
              <li key={surface}>{surface}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>BusinessLogic workflows</h2>
          <ul>
            {ontology.workflows.map((workflow) => (
              <li key={workflow}>{workflow}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Integrations</h2>
          <ul>
            {ontology.integrations.map((integration) => (
              <li key={integration}>{integration}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Presentation boundary</h2>
          <p>
            Behavior, workflow membership, and dependency closure are normalized
            by this Ontology. Anthimeria may change supported page topology,
            compatible Blocks, variants, semantic tokens, and content.
          </p>
        </section>
      </div>
    </main>
  );
}
