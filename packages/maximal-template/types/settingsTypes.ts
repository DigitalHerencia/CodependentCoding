import type { ReactNode } from "react";
import type { OrganizationMemberDTO } from "@/types/authzTypes";
import type { BillingSubscriptionDTO } from "@/types/billingTypes";
import type { IntegrationStatus } from "@/types/integrationTypes";

/** Existing settings pages rendered within the shared tenant shell. */
export type SettingsPage = "members" | "integrations" | "billing";

/** Presentation frame with owner-supplied content and no navigation authority. */
export type SettingsPageProps = { page: SettingsPage; children: ReactNode };

/** Authorized directory projection with invitation behavior supplied by its owner. */
export type SettingsMembersProps = {
  members: OrganizationMemberDTO[];
  invitations?: ReactNode;
  page: number;
  hasNextPage: boolean;
};

/** Secret-free installed-provider metadata inspected by the server workflow. */
export type SettingsIntegrationsProps = { integrations: IntegrationStatus[] };

/** Billing-owned subscription record and separately observed configuration presence. */
export type SettingsBillingProps = {
  subscription: BillingSubscriptionDTO | null;
  providerConfiguration: "present" | "missing" | "unavailable" | "restricted";
};

/** Provider metadata shown only after the independent settings permission gate. */
export type SettingsBillingConfigurationProps = {
  providerConfiguration: Exclude<
    SettingsBillingProps["providerConfiguration"],
    "restricted"
  >;
};

/** Select the actual content shape of a pending settings route. */
export type SettingsSkeletonProps = { page: SettingsPage };

/** Untrusted route query used only for directory pagination. */
export type SettingsMembersSearchParams = { page?: string | string[] };

/** Resolve query state inside the members Suspense boundary. */
export type SettingsMembersFeatureProps = {
  criteria: Promise<SettingsMembersSearchParams>;
};

/** Existing members route query passed to its server feature. */
export type SettingsMembersRouteProps = {
  searchParams: Promise<SettingsMembersSearchParams>;
};
