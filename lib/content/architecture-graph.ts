import type {
  ArchitectureSnapshot,
  ArchitectureGraph,
  GraphNode,
  GraphEdge,
  Ontology,
} from "@/types/architectureTypes";

export const GRAPH_PAGE_SIZE = 24;
export const GRAPH_EDGE_LIMIT = 60;
export const ontologies = {
  containment: {
    label: "Architecture overview",
    meaning:
      "Contains → immediate directory membership. Boundaries come from source directories.",
  },
  imports: {
    label: "Static dependencies",
    meaning:
      "Imports → resolved static import or re-export. Type-only imports are included. Not execution order.",
  },
  composition: {
    label: "Component composition",
    meaning:
      "Renders → a JSX tag bound to a local import. Aggregated by directory; not runtime execution.",
  },
} satisfies Record<Ontology, { label: string; meaning: string }>;

/** Pure bounded projection. No template vocabulary, UI imports or application rules. */
export function projectGraph(
  snapshot: ArchitectureSnapshot,
  ontology: Ontology,
  scope = "",
  page = 0,
): ArchitectureGraph {
  const files = snapshot.files;
  const isFile = files.includes(scope);
  if (scope && !isFile && !files.some((file) => file.startsWith(scope + "/")))
    throw new Error("Unknown graph scope");
  const prefix = scope ? scope + "/" : "";
  const childOf = (file: string) => {
    if (!file.startsWith(prefix)) return undefined;
    return prefix + file.slice(prefix.length).split("/")[0];
  };
  const relation = ontology === "imports" ? "imports" : "renders";
  const relevant =
    ontology === "containment"
      ? []
      : snapshot.facts.flatMap((fact) =>
          fact.edges
            .filter((edge) => edge.kind === relation)
            .map((edge) => ({ ...edge, from: fact.path })),
        );
  const candidates = new Set<string>();
  if (isFile && ontology !== "containment") {
    for (const edge of relevant) {
      if (edge.from === scope) candidates.add(edge.target);
      if (edge.target === scope) candidates.add(edge.from);
    }
    candidates.delete(scope);
  } else if (!isFile) {
    for (const file of files) {
      const child = childOf(file);
      if (child) candidates.add(child);
    }
  }
  const sorted = [...candidates].sort();
  const pages = Math.max(1, Math.ceil(sorted.length / GRAPH_PAGE_SIZE));
  const current = Math.max(
    0,
    Math.min(Number.isFinite(page) ? Math.floor(page) : 0, pages - 1),
  );
  const visible = sorted.slice(
    current * GRAPH_PAGE_SIZE,
    (current + 1) * GRAPH_PAGE_SIZE,
  );
  const node = (id: string): GraphNode => ({
    id,
    label: id === "" ? snapshot.metadata.label : id.split("/").pop()!,
    kind: files.includes(id) ? "file" : "directory",
    count: files.includes(id)
      ? 1
      : files.filter((file) => !id || file.startsWith(id + "/")).length,
  });
  const nodes = [node(scope), ...visible.map(node)];
  const visibleIds = new Set(nodes.map((entry) => entry.id));
  const edges = new Map<string, GraphEdge>();
  const scopedEdges = new Set<string>();
  if (ontology === "containment") {
    for (const child of visible)
      edges.set(child, {
        from: scope,
        to: child,
        kind: "contains",
        count: 1,
        evidence: {
          path: files.find(
            (file) => file === child || file.startsWith(child + "/"),
          )!,
          line: 1,
        },
      });
  } else {
    for (const edge of relevant) {
      const from = isFile ? edge.from : childOf(edge.from);
      const to = isFile ? edge.target : childOf(edge.target);
      if (
        from === undefined ||
        to === undefined ||
        from === to ||
        (isFile && from !== scope && to !== scope)
      )
        continue;
      const key = JSON.stringify([from, to]);
      scopedEdges.add(key);
      if (!visibleIds.has(from) || !visibleIds.has(to)) continue;
      const previous = edges.get(key);
      if (previous) previous.count++;
      else
        edges.set(key, {
          from,
          to,
          kind: edge.kind,
          count: 1,
          evidence: { path: edge.from, line: edge.line },
        });
    }
  }
  const result = [...edges.values()];
  return {
    ontology,
    source: snapshot.metadata,
    scope,
    nodes,
    edges: result.slice(0, GRAPH_EDGE_LIMIT),
    total: sorted.length,
    page: current,
    pages,
    omittedEdges:
      ontology === "containment"
        ? 0
        : Math.max(
            0,
            scopedEdges.size - Math.min(result.length, GRAPH_EDGE_LIMIT),
          ),
    unresolved:
      ontology === "imports"
        ? snapshot.facts.reduce((total, fact) => total + fact.unresolved, 0)
        : 0,
  };
}
