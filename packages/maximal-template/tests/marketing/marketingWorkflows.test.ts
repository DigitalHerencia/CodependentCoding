import assert from "node:assert/strict";
import { test } from "vitest";
import {
  audienceFormSchema,
  updateAudienceSchema,
  createCampaignSchema,
  campaignEditorSchema,
  marketingAnalyticsQuerySchema,
  campaignListSchema,
  campaignTransitions,
} from "@/schemas/marketingSchemas";

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

test("audience metadata updates can preserve an unrepresentable persisted definition", () => {
  const result = updateAudienceSchema.parse({
    audienceId: "00000000-0000-4000-8000-000000000060",
    name: "Complex segmentation",
    status: "ACTIVE",
    expectedUpdatedAt: "2026-11-18T10:00:00.000Z",
  });
  assert.equal(result.definition, undefined);
  assert.equal(
    updateAudienceSchema.safeParse({
      ...result,
      expectedUpdatedAt: "2026-11-18T10:00:00.000Z",
      definition: { operator: "or", rules: [] },
    }).success,
    false,
  );
});

test("schedules require explicit UTC while editor values are validated UTC calendar minutes", () => {
  assert.equal(
    createCampaignSchema.safeParse({
      name: "Launch",
      scheduledAt: "2026-12-01T10:00",
    }).success,
    false,
  );
  const parsed = createCampaignSchema.parse({
    name: "Launch",
    scheduledAt: "2026-12-01T10:00:30.000Z",
  });
  assert.equal(parsed.scheduledAt?.toISOString(), "2026-12-01T10:00:30.000Z");
  assert.equal(
    campaignEditorSchema.safeParse({
      name: "Launch",
      description: "",
      audienceId: "",
      scheduledAt: "2026-02-30T10:00",
    }).success,
    false,
  );
});

test("list bounds and UTC analytics ranges reject malformed criteria", () => {
  assert.equal(campaignListSchema.safeParse({ pageSize: 101 }).success, false);
  assert.equal(campaignListSchema.safeParse({ page: -1 }).success, false);
  assert.equal(
    marketingAnalyticsQuerySchema.safeParse({
      from: "2026-02-30",
      to: "2026-03-03",
    }).success,
    false,
  );
  assert.equal(
    marketingAnalyticsQuerySchema.safeParse({
      from: "2026-11-19",
      to: "2026-11-18",
    }).success,
    false,
  );
});

test("terminal campaigns cannot restart and unstarted campaigns cannot complete", () => {
  assert.deepEqual(campaignTransitions.COMPLETED, []);
  assert.deepEqual(campaignTransitions.CANCELED, []);
  assert.equal(campaignTransitions.DRAFT.includes("COMPLETED"), false);
  assert.equal(campaignTransitions.ACTIVE.includes("PAUSED"), true);
});
