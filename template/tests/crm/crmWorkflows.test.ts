import assert from "node:assert/strict";
import { test } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Prisma } from "@/generated/prisma/client";
import { updateDealStageTx } from "@/lib/db/transactions/crm-update-deal-stage.tx";
import { createContactSchema, createCrmDealSchema } from "@/schemas/crmSchemas";
import { CrmPipelineTemplate } from "@/components/templates/crmPipelineTemplate";

const id = "00000000-0000-4000-8000-000000000001";

test("contact forms validate actual contact fields and reject the old generic payload", () => {
  assert.equal(
    createContactSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      status: "ACTIVE",
    }).success,
    false,
  );
  assert.equal(
    createContactSchema.safeParse({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      phone: "",
      title: "Engineer",
      status: "LEAD",
    }).success,
    true,
  );
});

test("opportunities reject invalid account references and probabilities", () => {
  assert.equal(
    createCrmDealSchema.safeParse({ accountId: "other", name: "Deal" }).success,
    false,
  );
  assert.equal(
    createCrmDealSchema.safeParse({
      accountId: id,
      name: "Deal",
      probability: 101,
    }).success,
    false,
  );
});

test("pipeline rejects invalid stage transitions before writing", async () => {
  let writes = 0;
  const tx = {
    crmDeal: {
      findFirstOrThrow: async () => ({ stage: "LEAD" }),
      updateMany: async () => {
        writes++;
        return { count: 1 };
      },
    },
  } as unknown as Prisma.TransactionClient;
  await assert.rejects(
    updateDealStageTx(tx, {
      organizationId: "tenant-a",
      dealId: id,
      stage: "WON",
      expectedVersion: 2,
    }),
    /cannot move/,
  );
  assert.equal(writes, 0);
});

test("pipeline stage changes retain tenant and version predicates", async () => {
  let read = 0;
  const tx = {
    crmDeal: {
      findFirstOrThrow: async () => (++read === 1 ? { stage: "LEAD" } : { id }),
      updateMany: async ({
        where,
      }: {
        where: { organizationId: string; version: number };
      }) => {
        assert.equal(where.organizationId, "tenant-a");
        assert.equal(where.version, 2);
        return { count: 0 };
      },
    },
  } as unknown as Prisma.TransactionClient;
  await assert.rejects(
    updateDealStageTx(tx, {
      organizationId: "tenant-a",
      dealId: id,
      stage: "QUALIFIED",
      expectedVersion: 2,
    }),
    /changed after/,
  );
});

test("CRM pipeline renders opportunity stages and value without a generic table or fake trend", () => {
  const html = renderToStaticMarkup(
    createElement(CrmPipelineTemplate, {
      deals: [
        {
          id,
          name: "Annual renewal",
          stage: "PROPOSAL",
          value: "1250.00",
          currency: "EUR",
          probability: 70,
          expectedCloseDate: "2026-10-01",
          version: 1,
          account: { id, name: "Acme" },
          owner: null,
        },
      ],
      toolbar: null,
      renderControls: () => null,
    }),
  );
  assert.match(html, /PROPOSAL/);
  assert.match(html, /Annual renewal/);
  assert.match(html, /1250.00/);
  assert.match(html, /Acme/);
  assert.doesNotMatch(html, /<table|Pipeline trend|SERVER/);
});

test("pipeline value weights open deals by probability with exact decimals and skips lost deals", async () => {
  const { calculatePipelineValue } =
    await import("@/lib/workflows/crm/calculatePipelineValue");
  assert.equal(
    calculatePipelineValue([
      { value: "1000.0000", probability: 50, stage: "PROPOSAL" },
      { value: "0.1000", probability: 30, stage: "QUALIFIED" },
      { value: "0.2000", probability: 30, stage: "QUALIFIED" },
      { value: "9999.0000", probability: 90, stage: "LOST" },
    ]),
    "500.09",
  );
});
