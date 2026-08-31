import Link from 'next/link';
import { getOntology, ontologyCatalog } from '@hipster-stack/core';
import { CopyDefinitionButton } from './copy-definition-button';
export function OntologyCatalog({
  selectedId = 'crm-pipeline-tracker',
}: {
  selectedId?: keyof typeof ontologyCatalog;
}) {
  const ontology = getOntology(selectedId);
  const definition = JSON.stringify(
    { ontology, routes: ontology.routes, modules: ontology.modules },
    null,
    2,
  );
  return (
    <main className="ontology-page">
      <p className="surface-eyebrow">The</p>
      <h1>Ontology™</h1>
      <p className="ontology-subtitle">Normalized defaults</p>
      <nav className="ontology-tabs" aria-label="Ontology defaults">
        {Object.values(ontologyCatalog).map((item) => (
          <Link
            className={item.id === selectedId ? 'active' : ''}
            key={item.id}
            href={`/ontologies/${item.id}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <section className="ontology-panel">
        <header>
          <strong>{ontology.label}</strong>
          <div>
            <CopyDefinitionButton value={definition} />
            <a
              className="button"
              href={`/ontologies/${ontology.id}/definition`}
              download={`${ontology.id}.json`}
            >
              Download
            </a>
          </div>
        </header>
        <div className="ontology-workbench">
          <aside>
            <small>CANONICAL SOURCE</small>
            <code>{ontology.source}</code>
            <small>ROUTES</small>
            {ontology.routes.map((route) => (
              <span key={route.path}>{route.path}</span>
            ))}
          </aside>
          <pre>{definition}</pre>
        </div>
        <article>
          <h2>{ontology.label}</h2>
          <p>{ontology.description}</p>
          <p className="muted">
            Primary surfaces: {ontology.primarySurfaces.join(' · ')}
          </p>
        </article>
      </section>
    </main>
  );
}
