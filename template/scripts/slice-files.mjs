/**
 * Prints the files one module owns, grouped by layer (Architecture.md §3), as
 * Markdown. With --write, replaces the block between
 * `<!-- slice:<id>:start -->` and `<!-- slice:<id>:end -->` in
 * ../context/docs/Architecture.md (factory repo only; a generated app has no docs).
 *
 *   node scripts/slice-files.mjs projects [--write]
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { listFiles, ownerOf } from "./ownership.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const [id, flag] = process.argv.slice(2);
if (!id) {
  console.error("usage: node scripts/slice-files.mjs <module> [--write]");
  process.exit(2);
}

const manifest = JSON.parse(
  readFileSync(path.join(root, "hipster.modules.json"), "utf8"),
);
const files = listFiles(root).filter(
  (file) => ownerOf(file, manifest).owner === id,
);
if (files.length === 0) {
  console.error(`No files are owned by "${id}".`);
  process.exit(1);
}

const layers = [
  ["Routes", "app/"],
  ["Templates", "components/templates/"],
  ["Features", "features/"],
  ["Actions", "lib/actions/"],
  ["Fetchers", "lib/fetchers/"],
  ["Workflows", "lib/workflows/"],
  ["Database (DTOs, selects, transactions)", "lib/db/"],
  ["Module definition", "lib/modules/"],
  ["Schemas", "schemas/"],
  ["Types", "types/"],
  ["Prisma (models, RLS, seed)", "prisma/"],
  ["Tests", "tests/"],
];
const sections = [];
const placed = new Set();
for (const [title, prefix] of layers) {
  const owned = files.filter((file) => file.startsWith(prefix));
  owned.forEach((file) => placed.add(file));
  if (owned.length > 0) {
    sections.push(
      `**${title}**\n\n${owned.map((file) => `- \`${file}\``).join("\n")}`,
    );
  }
}
const rest = files.filter((file) => !placed.has(file));
if (rest.length > 0) {
  sections.push(
    `**Other**\n\n${rest.map((file) => `- \`${file}\``).join("\n")}`,
  );
}
const list = `${sections.join("\n\n")}\n`;

if (flag !== "--write") {
  process.stdout.write(list);
  process.exit(0);
}

const doc = path.join(root, "..", "context", "docs", "Architecture.md");
if (!existsSync(doc)) {
  console.error(`${doc} not found; --write runs in the factory repo only.`);
  process.exit(1);
}
const start = `<!-- slice:${id}:start -->`;
const end = `<!-- slice:${id}:end -->`;
const text = readFileSync(doc, "utf8");
const from = text.indexOf(start);
const to = text.indexOf(end);
if (from === -1 || to < from) {
  console.error(`Add ${start} and ${end} to Architecture.md first.`);
  process.exit(1);
}
writeFileSync(
  doc,
  `${text.slice(0, from + start.length)}\n\n${list}\n${text.slice(to)}`,
);
process.stdout.write(`Wrote ${files.length} ${id} files to Architecture.md\n`);
