import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/actions/dashboardActions", () => ({
  saveDashboardPreferences: vi.fn(),
}));

vi.mock("@/lib/fetchers/dashboardFetchers", () => ({
  getDashboardOverview: vi.fn(async () => ({
    organization: {
      id: "organization-id",
      name: "Organization",
      memberCount: 2,
      timezone: "UTC",
    },
    preferences: {
      showWorkspaces: true,
      showActivity: true,
      compactView: false,
    },
    activities: [],
  })),
}));

vi.mock("@/lib/modules/registry", () => ({
  installedModules: [
    {
      id: "crm",
      dashboard: [
        {
          id: "crm-pipeline",
          title: "CRM",
          description: "Pipeline",
          href: "/crm/pipeline",
        },
      ],
    },
    { id: "other" },
  ],
}));

import { saveDashboardPreferences } from "@/lib/actions/dashboardActions";
import { getDashboardOverview } from "@/lib/fetchers/dashboardFetchers";
import { loadDashboardWorkflow } from "@/lib/workflows/dashboardWorkflows";

describe("dashboard workflow orchestration", () => {
  it("provides the authorized fetch result and the existing Server Action", async () => {
    const result = await loadDashboardWorkflow();

    expect(getDashboardOverview).toHaveBeenCalledOnce();
    expect(result.dashboard.organization.name).toBe("Organization");
    expect(result.dashboard.workspaces.map((item) => item.id)).toEqual(["crm-pipeline"]);
    expect(result.savePreferences).toBe(saveDashboardPreferences);
    expect(saveDashboardPreferences).not.toHaveBeenCalled();
  });
});
