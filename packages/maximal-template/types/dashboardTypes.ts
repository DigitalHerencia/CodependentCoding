import type { Route } from "next";

import type { ActionResult } from "@/types/actionTypes";

/** Dashboard entry contributed by an installed module. */
export type ModuleDashboardEntry = {
  id: string;
  title: string;
  description: string;
  href: Route;
};

/** Server Action reference passed from the server feature to its client island. */
export type DashboardSavePreferencesAction = (
  input: DashboardPreferencesDTO,
) => Promise<ActionResult<DashboardPreferencesDTO>>;

/** Persisted preferences of the active organization membership. */
export type DashboardPreferencesDTO = {
  showWorkspaces: boolean;
  showActivity: boolean;
  compactView: boolean;
};

/** Safe organization fields needed by the dashboard. */
export type DashboardOrganizationDTO = {
  id: string;
  name: string;
  memberCount: number;
  timezone: string;
};

/** An audit entry created by the signed-in user in the active organization. */
export type DashboardActivityDTO = {
  id: string;
  action: string;
  resourceType: string;
  createdAt: string;
};

/** Dashboard data returned by its authorized fetcher. */
export type DashboardOverviewDTO = {
  organization: DashboardOrganizationDTO;
  preferences: DashboardPreferencesDTO;
  activities: readonly DashboardActivityDTO[];
};

/** Server workflow result passed into pure dashboard presentation. */
export type DashboardPageDTO = DashboardOverviewDTO & {
  workspaces: readonly ModuleDashboardEntry[];
};
