import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { expect, test } from "vitest";

import { listFiles, ownerOf, ownershipReport } from "@/scripts/ownership.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const manifest = JSON.parse(
  readFileSync(`${root}/hipster.modules.json`, "utf8"),
) as { modules: { id: string; owns?: string[] }[] };

const fixture = {
  modules: [
    { id: "crm" },
    { id: "ai" },
    { id: "billing", owns: ["lib/integrations/stripe/**"] },
    { id: "media" },
  ],
};

test.each([
  ["lib/integrations/stripe/portal.ts", "billing", "owns"],
  ["features/crm/crmLeadsFeature.tsx", "crm", "segment"],
  ["app/(tenant)/crm/leads/page.tsx", "crm", "segment"],
  ["lib/fetchers/crmFetchers.ts", "crm", "basename"],
  ["lib/db/selects/crm.selects.ts", "crm", "basename"],
  ["lib/db/transactions/crm-update-deal-stage.tx.ts", "crm", "basename"],
  ["lib/workflows/aiWorkflows.ts", "ai", "basename"],
  ["lib/utils/aim.ts", "base", "base"],
  ["lib/utils/crmish.ts", "base", "base"],
  ["features/crm/mediaPicker.tsx", "crm", "segment"],
  ["lib/db/client.ts", "base", "base"],
])("%s belongs to %s (%s)", (path, owner, rule) => {
  expect(ownerOf(path, fixture)).toMatchObject({ owner, rule });
});

test("two modules at the deciding rule are ambiguous", () => {
  expect(ownerOf("app/(tenant)/crm/media/page.tsx", fixture)).toEqual({
    owner: null,
    rule: "segment",
    candidates: ["crm", "media"],
  });
});

// Base is left out: it changes with every tooling or test file. Module counts
// change only when module code does; update with `pnpm test -u` when intended.
test("ownership report for the current template", () => {
  const { counts, ambiguous } = ownershipReport(listFiles(root), manifest);
  const { base, ...modules } = counts;
  expect(base).toBeGreaterThan(0);
  expect({ modules, ambiguous }).toMatchSnapshot();
});
