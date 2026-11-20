"use client";

import dynamic from "next/dynamic";
import { AnthimeriaArchitectureMap } from "@/components/blocks/anthimeria-architecture-map";
import { ontologies } from "@/lib/content/architecture-graph";
import type {
  ArchitectureGraph,
  SourceMetadata,
  Ontology,
} from "@/types/architectureTypes";

const Source = dynamic(
  () =>
    import("@/components/blocks/anthimeria-source-viewer").then(
      (module) => module.AnthimeriaSourceViewer,
    ),
  { loading: () => <p role="status">Opening source…</p> },
);
const Files = dynamic(
  () =>
    import("@/components/blocks/anthimeria-files").then(
      (module) => module.AnthimeriaFiles,
    ),
  { loading: () => <p role="status">Opening file explorer…</p> },
);

type Selection = {
  source: string;
  ontology: Ontology;
  scope: string;
  page: number;
};
export function AnthimeriaWorkspace({
  sources,
  selection,
  graph,
  error,
  navigate,
  openSource,
  panel,
  setPanel,
  file,
  line,
}: {
  sources: SourceMetadata[];
  selection: Selection;
  graph: ArchitectureGraph | null;
  error: string;
  navigate: (change: Partial<Selection>) => void;
  openSource: (path: string, line?: number) => void;
  panel: "files" | "source" | null;
  setPanel: (panel: "files" | "source" | null) => void;
  file: string;
  line: number;
}) {
  const parts = selection.scope.split("/").filter(Boolean);
  return (
    <section
      className="atlas-workspace"
      aria-label="Anthimeria architecture explorer"
    >
      <header className="atlas-controls">
        <label>
          Source repository
          <select
            aria-label="Source repository"
            value={selection.source}
            onChange={(event) =>
              navigate({ source: event.target.value, scope: "" })
            }
          >
            {sources.map((source) => (
              <option key={source.id} value={source.id}>
                {source.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Active ontology
          <select
            aria-label="Active ontology"
            value={selection.ontology}
            onChange={(event) =>
              navigate({ ontology: event.target.value as Ontology })
            }
          >
            {Object.entries(ontologies).map(([id, info]) => (
              <option value={id} key={id}>
                {info.label}
              </option>
            ))}
            <option disabled>Execution · requires trace data</option>
          </select>
        </label>
        <button
          type="button"
          className="atlas-button"
          aria-expanded={panel === "files"}
          onClick={() => setPanel(panel === "files" ? null : "files")}
        >
          Browse files
        </button>
        {panel && (
          <button
            type="button"
            className="atlas-button"
            onClick={() => setPanel(null)}
          >
            Close panel
          </button>
        )}
      </header>
      <div className="atlas-context">
        <span className="atlas-live-dot" />
        {ontologies[selection.ontology].meaning}
      </div>
      <nav className="atlas-breadcrumbs" aria-label="Architecture location">
        <button type="button" onClick={() => navigate({ scope: "" })}>
          Repository
        </button>
        {parts.map((part, i) => (
          <span key={i}>
            {" "}
            /{" "}
            <button
              type="button"
              onClick={() =>
                navigate({ scope: parts.slice(0, i + 1).join("/") })
              }
            >
              {part}
            </button>
          </span>
        ))}
      </nav>
      <div className={`atlas-panes ${panel ? "atlas-has-panel" : ""}`}>
        {panel && (
          <aside
            className="atlas-side-panel"
            aria-label={
              panel === "source" ? "Read-only source" : "File explorer"
            }
          >
            {panel === "source" ? (
              <Source
                key={`${selection.source}:${file}:${line}`}
                sourceId={selection.source}
                file={file}
                initialLine={line}
              />
            ) : (
              <Files
                key={`${selection.source}:${selection.scope}`}
                sourceId={selection.source}
                scope={selection.scope}
                openSource={openSource}
              />
            )}
          </aside>
        )}
        <section
          className="atlas-graph-panel"
          aria-label="Selected ontology graph"
          aria-busy={!graph && !error}
        >
          {error ? (
            <div className="atlas-message" role="alert">
              {error}
              <button type="button" onClick={() => navigate({})}>
                Retry
              </button>
            </div>
          ) : graph ? (
            <AnthimeriaArchitectureMap
              key={`${graph.source.id}:${graph.ontology}:${graph.scope}:${graph.page}`}
              graph={graph}
              navigate={(scope) => navigate({ scope })}
              openSource={openSource}
            />
          ) : (
            <p className="atlas-message" role="status">
              Loading selected ontology…
            </p>
          )}
        </section>
      </div>
      {graph && (
        <footer className="atlas-status">
          <span>
            {graph.source.revision.slice(0, 12)} · {graph.nodes.length} nodes ·{" "}
            {graph.edges.length} edges
            {graph.omittedEdges > 0
              ? ` · ${graph.omittedEdges} edges outside this page or edge limit; inspect a file`
              : ""}
          </span>
          <div>
            <button
              type="button"
              disabled={graph.page === 0}
              onClick={() => navigate({ page: graph.page - 1 })}
            >
              Previous graph page
            </button>
            <span>
              {graph.page + 1} / {graph.pages}
            </span>
            <button
              type="button"
              disabled={graph.page + 1 >= graph.pages}
              onClick={() => navigate({ page: graph.page + 1 })}
            >
              Next graph page
            </button>
          </div>
        </footer>
      )}
      {graph && graph.unresolved > 0 && (
        <p className="atlas-note">
          {graph.unresolved} package or unresolved static specifiers excluded
          across this repository. Dynamic imports, calls and execution are not
          represented.
        </p>
      )}
    </section>
  );
}
