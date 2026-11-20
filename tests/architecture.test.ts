import { describe, expect, it, vi } from "vitest";
import { readFile } from "node:fs/promises";
import { analyzeSource } from "@/lib/content/architecture-analysis";
import {
  snapshotAdapter,
  validSourcePath,
} from "@/lib/content/architecture-adapters";
import { projectGraph } from "@/lib/content/architecture-graph";
import type { ArchitectureSnapshot } from "@/types/architectureTypes";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AnthimeriaArchitectureMap } from "@/components/blocks/anthimeria-architecture-map";

vi.mock("server-only", () => ({}));

const metadata = {
  id: "unrelated",
  label: "Independent repository",
  revision: "test",
  sourceUrl: "https://example.com/source/",
};
const sources = new Map([
  [
    "src/view.tsx",
    'import { Card as Tile } from "./card";\n// import Fake from "./fake"\nconst text = "import Fake from \'./fake\'";\nexport const View = () => <Tile />;',
  ],
  ["src/card.tsx", "export const Card = () => <div />;"],
  ["src/index.ts", 'export { View } from "./view";'],
  ["src/fake.ts", "export default 0;"],
]);
const empty: ArchitectureSnapshot = {
  metadata,
  files: [...sources.keys()],
  facts: [],
};

describe("Anthimeria architecture", () => {
  it("server-renders SVG relationship titles without dropping text during hydration", () => {
    const graph = projectGraph(empty, "containment");
    const html = renderToStaticMarkup(
      createElement(AnthimeriaArchitectureMap, {
        graph,
        navigate: () => {},
        openSource: () => {},
      }),
    );
    expect(html).toContain(
      "<title>Independent repository contains src (1)</title>",
    );
  });
  it("does not ship Monaco through its source browser", async () => {
    const client = await readFile(
      "features/anthimeria/anthimeria-browser.client.tsx",
      "utf8",
    );
    expect(client).not.toMatch(/from\s+["']@monaco-editor/);
  });

  it("analyzes an unrelated source adapter without template paths or fake string imports", async () => {
    const result = await analyzeSource(snapshotAdapter(empty, sources));
    expect(
      result.facts.find((fact) => fact.path === "src/view.tsx")?.edges,
    ).toEqual([
      { target: "src/card.tsx", kind: "imports", line: 1 },
      { target: "src/card.tsx", kind: "renders", line: 4 },
    ]);
    expect(
      result.facts.find((fact) => fact.path === "src/index.ts")?.edges[0]
        ?.target,
    ).toBe("src/view.tsx");
  });

  it("keeps relationship meanings separate and records navigable line evidence", async () => {
    const result = await analyzeSource(snapshotAdapter(empty, sources));
    for (const [ontology, kind] of [
      ["containment", "contains"],
      ["imports", "imports"],
      ["composition", "renders"],
    ] as const) {
      const graph = projectGraph(result, ontology, "src");
      expect(graph.edges.length).toBeGreaterThan(0);
      expect(graph.edges.every((edge) => edge.kind === kind)).toBe(true);
      expect(graph.edges.every((edge) => sources.has(edge.evidence.path))).toBe(
        true,
      );
    }
    expect(
      projectGraph(result, "composition", "src/view.tsx").edges[0]?.evidence
        .line,
    ).toBe(4);
  });

  it("bounds graph pages without losing navigability", () => {
    const result = {
      ...empty,
      files: Array.from(
        { length: 65 },
        (_, i) => `other/file-${String(i).padStart(2, "0")}.ts`,
      ),
    };
    const pages = [0, 1, 2].map((page) =>
      projectGraph(result, "containment", "other", page),
    );
    expect(pages.map((page) => page.nodes.length)).toEqual([25, 25, 18]);
    expect(
      new Set(
        pages.flatMap((page) => page.nodes.slice(1).map((node) => node.id)),
      ).size,
    ).toBe(65);
    expect(projectGraph(result, "containment", "other", 100).page).toBe(2);
    expect(() => projectGraph(result, "imports", "missing")).toThrow(
      "Unknown graph scope",
    );
  });

  it("accepts configured aliases and ESM source extensions", async () => {
    const adapter = snapshotAdapter(
      { ...empty, files: ["entry.ts", "src/card.tsx"] },
      new Map([
        ["entry.ts", 'import { Card } from "~ui/card.js";'],
        ["src/card.tsx", "export const Card = 1;"],
      ]),
    );
    adapter.aliases = { "~ui/*": ["src/*"] };
    expect((await analyzeSource(adapter)).facts[0]?.edges[0]?.target).toBe(
      "src/card.tsx",
    );
  });

  it("does not mistake a shadowed JSX binding for an imported component", async () => {
    const local = new Map(sources);
    local.set(
      "src/view.tsx",
      'import { Card } from "./card"; export const View = ({ Card }: { Card: () => unknown }) => <Card />;',
    );
    const result = await analyzeSource(snapshotAdapter(empty, local));
    expect(
      result.facts
        .find((fact) => fact.path === "src/view.tsx")
        ?.edges.filter((edge) => edge.kind === "renders"),
    ).toEqual([]);
  });

  it("rejects unsafe paths and unpublished snapshot sources", async () => {
    for (const file of [
      "../secret.ts",
      "a/../b.ts",
      "C:/secret.ts",
      "/etc/passwd",
      "a\\b",
      "a//b",
    ])
      expect(validSourcePath(file)).toBe(false);
    await expect(
      snapshotAdapter(empty, sources).read("../secret.ts"),
    ).rejects.toThrow();
  });

  it("reports relationships omitted by paging and the edge cap", () => {
    const files = Array.from({ length: 30 }, (_, index) => `code/${index}.ts`);
    const snapshot: ArchitectureSnapshot = {
      metadata,
      files,
      facts: files.map((file) => ({
        path: file,
        unresolved: 0,
        edges: files
          .filter((other) => other !== file)
          .map((target) => ({ target, kind: "imports", line: 1 })),
      })),
    };
    const graph = projectGraph(snapshot, "imports", "code");
    expect(graph.edges).toHaveLength(60);
    expect(graph.omittedEdges).toBe(30 * 29 - 60);
    expect(graph.nodes).toHaveLength(25);
  });
});
