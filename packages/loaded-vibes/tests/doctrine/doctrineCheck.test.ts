import { expect, test } from "vitest";

import { checkDoctrine } from "@/packages/loaded-vibes/scripts/doctrine-check.mjs";

test("validation.yaml, packages/loaded-vibes/eslint, the plugin and the docs agree on CC IDs", async () => {
  const { problems, rules, eslintRules } = await checkDoctrine();
  expect(problems).toEqual([]);
  expect(rules).toBeGreaterThan(0);
  expect(eslintRules).toBeGreaterThan(0);
});
