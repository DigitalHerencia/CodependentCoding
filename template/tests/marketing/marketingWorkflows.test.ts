import assert from "node:assert/strict";
import { test } from "vitest";
import { audienceFormSchema } from "@/schemas/marketingSchemas";

test("audience editor rejects unsupported definitions rather than overwriting them", () => {
  assert.equal(
    audienceFormSchema.safeParse({
      name: "Customers",
      status: "ACTIVE",
      definition: { operator: "or", rules: [] },
    }).success,
    false,
  );
  assert.equal(
    audienceFormSchema.safeParse({
      name: "Customers",
      status: "ACTIVE",
      definition: {
        operator: "and",
        rules: [{ field: "status", operator: "equals", value: "active" }],
      },
    }).success,
    true,
  );
});
