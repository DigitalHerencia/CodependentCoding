import "server-only";

import { readdir } from "node:fs/promises";
import path from "node:path";

// Build-time list of the Maximal Template's source files. Contents load in the
// browser from GitHub, so secrets, installs and build output are never listed.
const skipDirs = new Set([
  "node_modules",
  ".next",
  ".turbo",
  "dist",
  "coverage",
  "test-results",
  "playwright-report",
  ".git",
]);
const skipFiles =
  /^(\.env.*|pnpm-lock\.yaml|AGENTS\.md|next-env\.d\.ts)$|\.(png|jpe?g|ico|webp|gif|woff2?|tsbuildinfo)$/;

async function walk(dir: string, prefix: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        return skipDirs.has(entry.name)
          ? []
          : walk(path.join(dir, entry.name), relative);
      }
      return skipFiles.test(entry.name) ? [] : [relative];
    }),
  );
  return nested.flat();
}

export async function getTemplateFiles() {
  const files = await walk(
    path.join(/* turbopackIgnore: true */ process.cwd(), "template"),
    "",
  );
  return files.sort();
}
