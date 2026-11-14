"use client";

import { TenantErrorTemplate } from "@/components/templates/tenant-templates";
import type { TenantErrorBoundaryProps } from "@/types/tenantTypes";

/**
 * Recover from child-route errors within the authenticated tenant group.
 *
 * @remarks
 * Layout authentication and onboarding failures are outside this boundary.
 */
export default function TenantRouteError({ reset }: TenantErrorBoundaryProps) {
  return <TenantErrorTemplate onRetry={reset} />;
}
