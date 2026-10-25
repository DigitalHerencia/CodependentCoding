import { expect, test } from "vitest";

import { checkDoctrine } from "@/scripts/doctrine-check.mjs";

test("validation.yaml, template/eslint, the plugin and the docs agree on CC IDs", async () => {
  const { problems, rules, eslintRules } = await checkDoctrine();
  expect(problems).toEqual([]);
  expect(rules).toBeGreaterThan(0);
  expect(eslintRules).toBeGreaterThan(0);
});
