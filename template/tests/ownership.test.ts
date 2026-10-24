import { expect, test } from "vitest";

import { ownerOf } from "@/scripts/ownership.mjs";

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
