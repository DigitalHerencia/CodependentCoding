// Why: pins the Maximal Template's module file counts. Generated apps hold a
// subset, so the CLI does not copy tests/template/.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { expect, test } from "vitest";

import { listFiles, ownershipReport } from "@/scripts/ownership.mjs";

const root = fileURLToPath(new URL("../..", import.meta.url));
const manifest = JSON.parse(
  readFileSync(`${root}/hipster.modules.json`, "utf8"),
) as { modules: { id: string; owns?: string[] }[] };

// Base is left out: it changes with every tooling or test file. Module counts
// change only when module code does; update with `pnpm test -u` when intended.
test("ownership report for the current template", () => {
  const { counts, ambiguous } = ownershipReport(listFiles(root), manifest);
  const { base, ...modules } = counts;
  expect(base).toBeGreaterThan(0);
  expect({ modules, ambiguous }).toMatchSnapshot();
});
