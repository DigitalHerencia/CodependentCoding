import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/fetchers/crmFetchers", () => ({
  getCrmAccounts: vi.fn(async () => [
    { id: "1", name: "Acme", industry: "Technology" },
    { id: "2", name: "Other", industry: "Manufacturing" },
  ]),
  getContacts: vi.fn(async () => [
    { id: "3", firstName: "Ada", lastName: "Lovelace", email: null, account: { name: "Acme" } },
    { id: "4", firstName: "Grace", lastName: "Hopper", email: null, account: { name: "Other" } },
  ]),
  getCrmDeals: vi.fn(async () => [
    { id: "5", name: "Renewal", stage: "PROPOSAL", account: { name: "Acme" }, owner: null },
    { id: "6", name: "Launch", stage: "LEAD", account: { name: "Other" }, owner: null },
  ]),
}));

import {
  loadCrmAccountsWorkflow,
  loadCrmContactsWorkflow,
  loadCrmPipelineWorkflow,
} from "@/lib/workflows/crmWorkflows";

describe("CRM server page workflows", () => {
  it("filters account DTOs without client workflow imports", async () => {
    const view = await loadCrmAccountsWorkflow("technology");
    expect(view.accounts.map((account) => account.id)).toEqual(["1"]);
  });
  it("filters contact DTOs including account names", async () => {
    const view = await loadCrmContactsWorkflow("acme");
    expect(view.contacts.map((contact) => contact.id)).toEqual(["3"]);
  });
  it("groups filtered opportunities into stable stage buckets", async () => {
    const view = await loadCrmPipelineWorkflow("renewal");
    expect(view.stages).toHaveLength(6);
    expect(view.stages.find((stage) => stage.stage === "PROPOSAL")?.items).toHaveLength(1);
    expect(view.stages.find((stage) => stage.stage === "LEAD")?.items).toHaveLength(0);
  });
});
