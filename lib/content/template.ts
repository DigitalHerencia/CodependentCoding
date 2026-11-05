import "server-only";

import { readdir } from "node:fs/promises";
import path from "node:path";

// List source files while excluding secrets, installs and build output.
const skipDirs = new Set([
  "node_modules",
  ".next",
  ".turbo",
  "dist",
  "coverage",
  "test-results",
  "playwright-report",
  ".git",
  ".sandbox",
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
  "use cache";

  const files = await walk(
    path.join(
      /* turbopackIgnore: true */ process.cwd(),
      "packages/maximal-template",
    ),
    "",
  );
  return files.sort();
}

export async function getTemplateSource(file: string) {
  const path = file.split("/").map(encodeURIComponent).join("/");
  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/DigitalHerencia/CodependentCoding/main/packages/maximal-template/${path}`,
      { next: { revalidate: 300 } },
    );
    if (response.ok) return await response.text();
  } catch {
    // The source browser can still show its index when GitHub is unavailable.
  }
  return "// Could not load this file. Provenance is latency.";
}
