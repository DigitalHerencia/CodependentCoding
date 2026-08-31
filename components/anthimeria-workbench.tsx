'use client';
import { useMemo, useState } from 'react';
type CatalogItem = {
  id: string;
  label: string;
  description: string;
  routes: readonly { path: string }[];
};

export function AnthimeriaWorkbench({
  catalog,
  initialId = 'crm-pipeline-tracker',
}: {
  catalog: readonly CatalogItem[];
  initialId?: string;
}) {
  const [id, setId] = useState(initialId);
  const [theme, setTheme] = useState('midnight');
  const [density, setDensity] = useState('comfortable');
  const [copied, setCopied] = useState(false);
  const ontology = catalog.find((item) => item.id === id) ?? catalog[0];
  const value = useMemo(
    () =>
      JSON.stringify(
        {
          preset: id,
          identity: { packageName: `${id}-app`, displayName: ontology.label },
          presentation: { theme, density },
          routes: ontology.routes,
        },
        null,
        2,
      ),
    [id, ontology, theme, density],
  );
  return (
    <main className="anthimeria-page">
      <p className="surface-eyebrow">The</p>
      <h1>Anthimeria™</h1>
      <p className="anthimeria-subtitle">
        Workbench · presentation constitution
      </p>
      <section className="anthimeria-grid">
        <aside>
          <h2>01 Ontology</h2>
          <label>
            Normalized default
            <select value={id} onChange={(e) => setId(e.target.value)}>
              {catalog.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <p className="muted">
            Behavior, workflows, integrations, and dependency closure remain
            fixed by the selected Ontology.
          </p>
          <h2>02 Presentation</h2>
          <label>
            Theme
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option>midnight</option>
              <option>daylight</option>
              <option>neon</option>
            </select>
          </label>
          <label>
            Density
            <select
              value={density}
              onChange={(e) => setDensity(e.target.value)}
            >
              <option>comfortable</option>
              <option>compact</option>
              <option>spacious</option>
            </select>
          </label>
        </aside>
        <section className="anthimeria-output">
          <header>
            <strong>Application Definition · Virgule™</strong>
            <div>
              <button
                className="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(value);
                  setCopied(true);
                }}
              >
                {copied ? 'Copied' : 'Copy definition'}
              </button>
              <a
                className="button"
                href={`data:application/json,${encodeURIComponent(value)}`}
                download={`${id}-virgule.json`}
              >
                Download
              </a>
            </div>
          </header>
          <pre>{value}</pre>
          <footer>
            <span>Includes: normalized routes + presentation tokens</span>
            <span>Excludes: workflows, authz, providers, persistence</span>
          </footer>
        </section>
      </section>
    </main>
  );
}
