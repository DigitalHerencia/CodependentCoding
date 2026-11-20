import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { getTemplateFiles } from "@/lib/content/template";

/** Architectural zones describe ownership, not execution order. */
export type ArchitectureZone =
  | "routes"
  | "features"
  | "presentation"
  | "application"
  | "contracts"
  | "persistence";

export type ArchitectureModule = {
  path: string;
  zone: ArchitectureZone;
  /** Resolved, in-repository static entry dependencies. */
  imports: string[];
};

const ROOT = "packages/maximal-template";
const SOURCE_FILE = /\.(?:[cm]?[jt]sx?)$/;
const IMPORT_SPECIFIER =
  /(?:\bfrom\s*|\bimport\s*\(\s*|\brequire\s*\(\s*|\bimport\s*)(["'])([^"']+)\1/g;

/** Assign a source file to an architectural zone using its established location. */
function zoneFor(file: string): ArchitectureZone {
  if (file.startsWith("app/")) return "routes";
  if (file.startsWith("features/")) return "features";
  if (file.startsWith("components/")) return "presentation";
  if (/^lib\/(?:db\/|prisma\/)/.test(file) || file.startsWith("prisma/")) {
    return "persistence";
  }
  if (/^(?:schemas\/|types\/|content\/)/.test(file)) return "contracts";
  if (
    /^lib\/(?:workflows\/|fetchers\/|actions\/|integrations\/|auth\/|authz\/)/.test(
      file,
    )
  ) {
    return "application";
  }
  return "contracts";
}

/** Resolve only local imports to filenames that actually exist in the template. */
function resolveImport(
  importer: string,
  specifier: string,
  known: ReadonlySet<string>,
): string | null {
  let base: string;
  if (specifier.startsWith("@/")) {
    base = specifier.slice(2);
  } else if (specifier.startsWith(".")) {
    base = path.posix.normalize(
      path.posix.join(path.posix.dirname(importer), specifier),
    );
  } else {
    return null;
  }

  if (base.startsWith("../") || base.startsWith("/")) return null;

  const candidates = [
    base,
    ...[".tsx", ".ts", ".jsx", ".js", ".mjs", ".cjs", ".json"].map(
      (extension) => base + extension,
    ),
    ...[".tsx", ".ts", ".jsx", ".js"].map(
      (extension) => base + "/index" + extension,
    ),
  ];
  return candidates.find((candidate) => known.has(candidate)) ?? null;
}

/**
 * Build a source-grounded dependency index for the deployed template.
 *
 * Edges are static local imports/exports, not inferred runtime call paths.
 * The index is cached by Next.js and reused across map interactions.
 */
export async function getTemplateArchitecture(): Promise<ArchitectureModule[]> {
  "use cache";

  const files = await getTemplateFiles();
  const known = new Set(files);
  const sourceFiles = files.filter((file) => SOURCE_FILE.test(file));

  return Promise.all(
    sourceFiles.map(async (file): Promise<ArchitectureModule> => {
      let contents: string;
      try {
        contents = await readFile(path.join(process.cwd(), ROOT, file), "utf8");
      } catch {
        return { path: file, zone: zoneFor(file), imports: [] };
      }

      const imports = new Set<string>();
      for (const match of contents.matchAll(IMPORT_SPECIFIER)) {
        const dependency = resolveImport(file, match[2] ?? "", known);
        if (dependency && dependency !== file) imports.add(dependency);
      }

      return {
        path: file,
        zone: zoneFor(file),
        imports: [...imports].sort(),
      };
    }),
  );
}
