'use client';
import { useMemo, useState } from 'react';
type CatalogItem = {
  id: string;
  label: string;
  description: string;
  surfaces: readonly string[];
  workflows: readonly string[];
};
const stages = [
  'Ontology',
  'Pages',
  'Layout',
  'Blocks',
  'Components',
  'Design',
  'Content',
  'Preview',
  'Output',
];
export function AnthimeriaWorkbench({
  catalog,
  initialId = 'crm-pipeline-tracker',
}: {
  catalog: readonly CatalogItem[];
  initialId?: string;
}) {
  const safeInitial = catalog.some((item) => item.id === initialId)
    ? initialId
    : 'crm-pipeline-tracker';
  const [id, setId] = useState(safeInitial);
  const [stage, setStage] = useState(0);
  const [page, setPage] = useState('');
  const [layout, setLayout] = useState('workspace');
  const [block, setBlock] = useState('dashboard');
  const [density, setDensity] = useState('comfortable');
  const [accent, setAccent] = useState('#2f7a8d');
  const [headline, setHeadline] = useState(
    'Normalized behavior. Constituted presentation.',
  );
  const [message, setMessage] = useState('');
  const ontology = catalog.find((item) => item.id === id) ?? catalog[0]!;
  const selectedPage =
    page && ontology.surfaces.includes(page) ? page : ontology.surfaces[0]!;
  const value = useMemo(
    () =>
      JSON.stringify(
        {
          applicationDefinition: {
            schemaVersion: 1,
            preset: id,
            identity: {
              packageName: `${id}-app`,
              displayName: ontology.label,
              description: ontology.description,
            },
            capabilities: { include: [], exclude: [] },
            authorization: { model: 'rbac' },
            routes: [],
          },
          presentationConstitution: {
            page: selectedPage,
            layout,
            block,
            components: ['button', 'card', 'navigation'],
            tokens: { density, accent },
            content: { headline },
          },
          resolution: {
            state: 'draft',
            note: 'Resolve dependency closure with the shared Hipster Stack CLI before materialization.',
          },
        },
        null,
        2,
      ),
    [accent, block, density, headline, id, layout, ontology, selectedPage],
  );
  async function copy(text: string, success: string) {
    try {
      await navigator.clipboard.writeText(text);
      setMessage(success);
    } catch {
      setMessage('Copy failed.');
    }
  }
  return (
    <main className="anthimeria-page">
      <header className="anthimeria-heading">
        <img src="/Anthimeria Logo.jpg" alt="Anthimeria" />
        <p className="eyebrow">Stateless presentation constitution workbench</p>
        <h1>
          Behavior is normalized.
          <br />
          Presentation is configurable.
        </h1>
      </header>
      <section className="anthimeria-workbench">
        <nav aria-label="Workbench stages">
          {stages.map((label, index) => (
            <button
              data-active={stage === index}
              key={label}
              onClick={() => setStage(index)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {label}
            </button>
          ))}
        </nav>
        <section className="anthimeria-controls">
          <h2>
            {String(stage + 1).padStart(2, '0')} {stages[stage]}
          </h2>
          {stage === 0 && (
            <>
              <label>
                Normalized Ontology
                <select
                  value={id}
                  onChange={(event) => {
                    setId(event.target.value);
                    setPage('');
                  }}
                >
                  {catalog.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <p>{ontology.description}</p>
              <div className="boundary-note">
                <strong>Behavior</strong>
                <span>Normalized by Ontology</span>
                <strong>Presentation</strong>
                <span>Configurable here</span>
              </div>
            </>
          )}
          {stage === 1 && (
            <label>
              Normalized page
              <select
                value={selectedPage}
                onChange={(event) => setPage(event.target.value)}
              >
                {ontology.surfaces.map((surface) => (
                  <option key={surface}>{surface}</option>
                ))}
              </select>
            </label>
          )}
          {stage === 2 && (
            <label>
              Supported topology
              <select
                value={layout}
                onChange={(event) => setLayout(event.target.value)}
              >
                <option value="workspace">Workspace</option>
                <option value="dashboard">Dashboard</option>
                <option value="detail">Detail</option>
              </select>
            </label>
          )}
          {stage === 3 && (
            <label>
              Compatible PureUI Block
              <select
                value={block}
                onChange={(event) => setBlock(event.target.value)}
              >
                <option value="dashboard">Dashboard</option>
                <option value="data-grid">Data Grid</option>
                <option value="detail-panel">Detail Panel</option>
              </select>
            </label>
          )}
          {stage === 4 && (
            <div className="boundary-note">
              <strong>Compatible primitives</strong>
              <span>Button · Card · Navigation</span>
              <small>Constrained by the selected Block contract.</small>
            </div>
          )}
          {stage === 5 && (
            <>
              <label>
                Density
                <select
                  value={density}
                  onChange={(event) => setDensity(event.target.value)}
                >
                  <option>comfortable</option>
                  <option>compact</option>
                  <option>spacious</option>
                </select>
              </label>
              <label>
                Semantic accent
                <input
                  type="color"
                  value={accent}
                  onChange={(event) => setAccent(event.target.value)}
                />
              </label>
            </>
          )}
          {stage === 6 && (
            <label>
              Page headline
              <input
                value={headline}
                onChange={(event) => setHeadline(event.target.value)}
              />
            </label>
          )}
          {stage === 7 && (
            <div
              className="anthimeria-preview"
              style={{ '--preview-accent': accent } as React.CSSProperties}
            >
              <small>
                {ontology.label} · {selectedPage}
              </small>
              <h3>{headline}</h3>
              <div>
                <span>{block}</span>
                <span>{layout}</span>
                <span>{density}</span>
              </div>
            </div>
          )}
          {stage === 8 && (
            <div className="output-actions">
              <button onClick={() => copy(value, 'Definition copied.')}>
                Copy definition
              </button>
              <a
                href={`data:application/json,${encodeURIComponent(value)}`}
                download={`${id}-virgule.json`}
              >
                Download definition
              </a>
              <button
                onClick={() =>
                  copy(
                    `pnpm dlx hipster-stack@latest ${id}-app --config hipsterstack.json --yes`,
                    'CLI command copied.',
                  )
                }
              >
                Copy CLI command
              </button>
              <button
                disabled
                title="Direct server-safe ZIP generation is not currently available from the public runtime."
              >
                Arrangement ZIP unavailable
              </button>
            </div>
          )}
          <aside className="logic-inspector">
            <strong>Read-only normalized logic</strong>
            <span>{ontology.workflows.slice(0, 5).join(' · ')}</span>
          </aside>
        </section>
        <section className="anthimeria-definition">
          <header>
            <img src="/Virgule Logo.jpg" alt="Virgule" />
            <span role="status">{message}</span>
          </header>
          <pre>{value}</pre>
        </section>
      </section>
    </main>
  );
}
