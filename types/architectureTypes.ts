export type Ontology = "containment" | "imports" | "composition";
export type SourceLocation = { path: string; line: number };
export type Relationship = "contains" | "imports" | "renders";
export type SourceMetadata = {
  id: string;
  label: string;
  revision: string;
  sourceUrl: string;
};
export type SourceAdapter = {
  metadata: SourceMetadata;
  files: string[];
  aliases: Record<string, string[]>;
  read: (file: string) => Promise<string>;
};
export type SourceFact = {
  path: string;
  edges: { target: string; kind: "imports" | "renders"; line: number }[];
  unresolved: number;
};
export type ArchitectureSnapshot = {
  metadata: SourceMetadata;
  files: string[];
  facts: SourceFact[];
};
export type GraphNode = {
  id: string;
  label: string;
  kind: "directory" | "file";
  count: number;
};
export type GraphEdge = {
  from: string;
  to: string;
  kind: Relationship;
  count: number;
  evidence: SourceLocation;
};
export type ArchitectureGraph = {
  ontology: Ontology;
  source: SourceMetadata;
  scope: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  total: number;
  page: number;
  pages: number;
  omittedEdges: number;
  unresolved: number;
};
export type SourcePage = {
  path: string;
  html: string;
  start: number;
  total: number;
  sourceUrl: string;
};
