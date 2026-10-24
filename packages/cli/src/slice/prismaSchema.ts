import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/** Schema files that belong to base, not to a module (Architecture.md §5.3). */
const BASE_FILES = new Set(["base", "identity"]);

export interface SchemaFile {
  /** prisma/schema/<owner>.prisma, relative to the app. */
  file: string;
  /** Module id, or "base". */
  owner: string;
  text: string;
}

export interface ModelBlock {
  name: string;
  file: SchemaFile;
  fields: string[];
  tenant: boolean;
}

export const SCHEMA_DIR = path.join("prisma", "schema");

export function readSchema(appDir: string): SchemaFile[] {
  const dir = path.join(appDir, SCHEMA_DIR);
  return readdirSync(dir)
    .filter((name) => name.endsWith(".prisma"))
    .sort()
    .map((name) => {
      const id = name.slice(0, -".prisma".length);
      return {
        file: path.posix.join("prisma", "schema", name),
        owner: BASE_FILES.has(id) ? "base" : id,
        text: readFileSync(path.join(dir, name), "utf8"),
      };
    });
}

const BLOCK = /^(model|enum|type|view)\s+(\w+)\s*\{/gm;

/** Every model/enum/type name in the schema. */
export function declaredTypes(files: SchemaFile[]): Set<string> {
  const names = new Set<string>();
  for (const { text } of files) {
    for (const match of text.matchAll(BLOCK)) names.add(match[2] as string);
  }
  return names;
}

function blockRange(
  text: string,
  model: string,
): { start: number; end: number } | null {
  const match = new RegExp(`^model\\s+${model}\\s*\\{`, "m").exec(text);
  if (!match) return null;
  const close = text.indexOf("\n}", match.index);
  return close === -1 ? null : { start: match.index, end: close + 1 };
}

export function findModel(
  files: SchemaFile[],
  model: string,
): ModelBlock | null {
  for (const file of files) {
    const range = blockRange(file.text, model);
    if (!range) continue;
    const body = file.text.slice(range.start, range.end).split("\n").slice(1);
    const fields = body
      .map((line) => /^\s+(\w+)\s/.exec(line)?.[1])
      .filter((name): name is string => Boolean(name));
    return {
      name: model,
      file,
      fields,
      tenant: fields.includes("organizationId"),
    };
  }
  return null;
}

/**
 * Adds a back-relation line to a model, tagged with the module so
 * `// @module` stripping (and check:schema-modules) can remove it again.
 */
export function addRelationField(
  text: string,
  model: string,
  line: string,
  moduleId: string,
): string {
  const range = blockRange(text, model);
  if (!range) throw new Error(`model ${model} not found`);
  const before = text.slice(0, range.end - 1).trimEnd();
  return `${before}\n\n  ${line} // @module ${moduleId}${text.slice(range.end - 1)}`;
}
