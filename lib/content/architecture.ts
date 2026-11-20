import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";
import { projectGraph } from "@/lib/content/architecture-graph";
import type {
  ArchitectureSnapshot,
  SourceMetadata,
  Ontology,
} from "@/types/architectureTypes";

const root = path.join(
  /* turbopackIgnore: true */ process.cwd(),
  ".architecture",
);

export async function getArchitectureSources(): Promise<SourceMetadata[]> {
  "use cache";
  cacheLife("max");
  return JSON.parse(await readFile(path.join(root, "catalog.json"), "utf8"));
}

async function getSnapshot(
  id: string,
): Promise<ArchitectureSnapshot & { index: Record<string, string> }> {
  "use cache";
  cacheLife("max");
  const catalog = await getArchitectureSources();
  if (!catalog.some((source) => source.id === id))
    throw new Error("Unknown source repository");
  return JSON.parse(
    await readFile(path.join(root, id, "snapshot.json"), "utf8"),
  );
}

export async function getArchitectureGraph(
  id: string,
  ontology: Ontology,
  scope: string,
  page: number,
) {
  "use cache";
  cacheLife("max");
  return projectGraph(await getSnapshot(id), ontology, scope, page);
}

export async function getArchitectureFiles(
  id: string,
  scope: string,
  query: string,
  page: number,
) {
  const snapshot = await getSnapshot(id);
  const files = snapshot.files.filter(
    (file) =>
      (!scope || file.startsWith(scope + "/") || file === scope) &&
      file.toLowerCase().includes(query.toLowerCase()),
  );
  const pages = Math.max(1, Math.ceil(files.length / 40));
  const current = Math.max(0, Math.min(page, pages - 1));
  return {
    files: files.slice(current * 40, (current + 1) * 40),
    total: files.length,
    pages,
    page: current,
  };
}

export async function readArchitectureSource(id: string, file: string) {
  const snapshot = await getSnapshot(id);
  const key = snapshot.index[file];
  if (!key || !/^[a-f0-9]{64}$/.test(key))
    throw new Error("Unknown source file");
  return {
    source: JSON.parse(
      await readFile(path.join(root, id, key + ".json"), "utf8"),
    ) as string,
    metadata: snapshot.metadata,
  };
}
