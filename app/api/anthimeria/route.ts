import {
  getArchitectureSources,
  getArchitectureGraph,
  getArchitectureFiles,
  readArchitectureSource,
} from "@/lib/content/architecture";
import { getHighlightedSource } from "@/lib/content/architecture-source";
import { validSourcePath } from "@/lib/content/architecture-adapters";
import type { Ontology } from "@/types/architectureTypes";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const id = params.get("source") ?? "website";
  const kind = params.get("kind") ?? "graph";
  const scope = params.get("scope") ?? "";
  const file = params.get("file") ?? "";
  const ontology = params.get("ontology") ?? "containment";
  const page = Number(params.get("page") ?? 0);
  const line = Number(params.get("line") ?? 1);
  const query = params.get("q") ?? "";
  if (
    !["graph", "files", "source", "raw"].includes(kind) ||
    !["containment", "imports", "composition"].includes(ontology) ||
    (scope && !validSourcePath(scope)) ||
    (file && !validSourcePath(file)) ||
    !Number.isSafeInteger(page) ||
    page < 0 ||
    !Number.isSafeInteger(line) ||
    line < 1 ||
    query.length > 200
  )
    return Response.json(
      { error: "Invalid architecture request" },
      { status: 400 },
    );
  const sources = await getArchitectureSources();
  if (!sources.some((source) => source.id === id))
    return Response.json({ error: "Unknown source" }, { status: 404 });
  try {
    const data =
      kind === "graph"
        ? await getArchitectureGraph(id, ontology as Ontology, scope, page)
        : kind === "files"
          ? await getArchitectureFiles(id, scope, query, page)
          : kind === "source"
            ? await getHighlightedSource(id, file, line)
            : (await readArchitectureSource(id, file)).source;
    const headers = {
      "Cache-Control": "private, max-age=300",
      "X-Content-Type-Options": "nosniff",
    };
    return kind === "raw"
      ? new Response(data as string, {
          headers: { ...headers, "Content-Type": "text/plain; charset=utf-8" },
        })
      : Response.json(data, { headers });
  } catch (error) {
    const unknown =
      error instanceof Error &&
      /Unknown (?:graph scope|source file)/.test(error.message);
    return Response.json(
      {
        error: unknown
          ? "Source or graph not found"
          : "Architecture data could not be loaded",
      },
      { status: unknown ? 404 : 500 },
    );
  }
}
