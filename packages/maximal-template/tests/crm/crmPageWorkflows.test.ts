import { describe, expect, it, vi } from "vitest";

const account = { id: "1", name: "Acme", industry: "Technology" };
const contact = {
  id: "3", firstName: "Ada", lastName: "Lovelace", email: null,
  account: { name: "Acme" },
};
const deal = {
  id: "5", name: "Renewal", stage: "PROPOSAL", value: "100",
  currency: "USD", probability: 60, account: { name: "Acme" }, owner: null,
};
const info = { page: 1, pageSize: 25, total: 1, totalPages: 1, hasNext: false, hasPrevious: false };

vi.mock("@/lib/fetchers/crmFetchers", () => ({
  getCrmAccountsPage: vi.fn(async () => ({ items: [account], pageInfo: info, criteria: { q: "acme", page: 1, pageSize: 25, sort: "name-asc" } })),
  getCrmContactsPage: vi.fn(async () => ({ items: [contact], pageInfo: info, criteria: { q: "ada", page: 1, pageSize: 25, sort: "name-asc" } })),
  getCrmDealsPage: vi.fn(async () => ({ items: [deal], pageInfo: info, criteria: { q: "renewal", page: 1, pageSize: 25, sort: "stage-asc" } })),
  getCrmDealAnalytics: vi.fn(async () => [{ currency: "USD", stage: "PROPOSAL", count: 2, value: "300", weighted: "180" }]),
  getCrmAccounts: vi.fn(async () => [account]),
  getContacts: vi.fn(async () => []),
  getCrmDeals: vi.fn(async () => []),
}));

import {
  getCrmAccountsPage, getCrmContactsPage, getCrmDealsPage,
} from "@/lib/fetchers/crmFetchers";
import {
  loadCrmAccountsWorkflow, loadCrmContactsWorkflow,
  loadCrmPipelineWorkflow, loadCrmAnalyticsWorkflow,
} from "@/lib/workflows/crmWorkflows";

describe("CRM route read orchestration", () => {
  it("forwards full validated account search/filter/page inputs to the fetcher", async () => {
    const criteria = { q: "acme", page: 3, pageSize: 10, sort: "name-asc" };
    const view = await loadCrmAccountsWorkflow(criteria);
    expect(getCrmAccountsPage).toHaveBeenCalledWith(criteria);
    expect(view.accounts).toEqual([account]);
    expect(view.pageInfo.total).toBe(1);
  });
  it("forwards contact criteria into tenant-scoped persisted reads", async () => {
    const criteria = { q: "ada", status: "LEAD", page: 1 };
    const view = await loadCrmContactsWorkflow(criteria);
    expect(getCrmContactsPage).toHaveBeenCalledWith(criteria);
    expect(view.contacts[0]?.id).toBe("3");
  });
  it("groups the complete returned pipeline page into stage buckets", async () => {
    const criteria = { q: "renewal", page: 1 };
    const view = await loadCrmPipelineWorkflow(criteria);
    expect(getCrmDealsPage).toHaveBeenCalledWith(criteria);
    expect(view.stages).toHaveLength(6);
    expect(view.stages.find((stage) => stage.stage === "PROPOSAL")?.items).toHaveLength(1);
  });
  it("aggregates the complete tenant pipeline, not an arbitrary 100 records", async () => {
    const view = await loadCrmAnalyticsWorkflow();
    expect(view.count).toBe(2);
    expect(view.groups[0]?.rows.find((row) => row.id === "PROPOSAL")?.cells.weighted).toBe("180.00");
  });
});
