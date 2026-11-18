"use client";
/** Recover child-route errors without exposing private provider details. */
import { TenantErrorBlock } from "@/components/blocks/tenant-blocks";
import type { TenantErrorBoundaryProps } from "@/types/tenantTypes";
/** Next owns the reset handler; the block owns presentation and copy. */
export default function TenantRouteError({ reset }: TenantErrorBoundaryProps) {
  return <TenantErrorBlock onRetry={reset} />;
}
