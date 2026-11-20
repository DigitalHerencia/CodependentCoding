import "server-only";
import { readFile, realpath } from "node:fs/promises";
import path from "node:path";
import type {
  SourceAdapter,
  SourceMetadata,
  ArchitectureSnapshot,
} from "@/types/architectureTypes";

/** Paths are adapter-relative identifiers, never arbitrary HTTP-provided disk paths. */
export function validSourcePath(file: string) {
  return (
    file.length > 0 &&
    !file.startsWith("/") &&
    !file.includes("\\") &&
    !file.includes(":") &&
    file
      .split("/")
      .every((part) => part !== "." && part !== ".." && part !== "")
  );
}

export function workspaceAdapter(options: {
  root: string;
  files: string[];
  metadata: SourceMetadata;
  aliases?: Record<string, string[]>;
}): SourceAdapter {
  const files = options.files.filter(validSourcePath).sort();
  const known = new Set(files);
  return {
    metadata: options.metadata,
    files,
    aliases: options.aliases ?? {},
    async read(file) {
      if (!known.has(file))
        throw new Error("Source file is not published by this adapter");
      const root = await realpath(options.root);
      const resolved = await realpath(path.join(root, file));
      const relative = path.relative(root, resolved);
      if (relative.startsWith("..") || path.isAbsolute(relative))
        throw new Error("Source escapes adapter root");
      const text = await readFile(resolved, "utf8");
      if (Buffer.byteLength(text) > 256_000)
        throw new Error(`Source exceeds 256 KB: ${file}`);
      return text;
    },
  };
}

/** Allows a repository, archive or remote provider to supply the same contract. */
export function snapshotAdapter(
  snapshot: ArchitectureSnapshot,
  sources: ReadonlyMap<string, string>,
): SourceAdapter {
  return {
    metadata: snapshot.metadata,
    files: snapshot.files,
    aliases: {},
    async read(file) {
      if (!snapshot.files.includes(file) || !sources.has(file))
        throw new Error("Source not in snapshot");
      return sources.get(file)!;
    },
  };
}
