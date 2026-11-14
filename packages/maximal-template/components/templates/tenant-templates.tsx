import {
  TenantErrorBlock,
  TenantLoadingBlock,
} from "@/components/blocks/tenant-blocks";
import type {
  TenantErrorBlockProps,
  TenantLoadingBlockProps,
} from "@/types/tenantTypes";

// ============================================================================
// TENANT ERROR TEMPLATE
// ============================================================================

/** Route-group error presentation; the Next.js error boundary owns reset. */
export function TenantErrorTemplate({ onRetry }: TenantErrorBlockProps) {
  return <TenantErrorBlock onRetry={onRetry} />;
}

// ============================================================================
// TENANT LOADING TEMPLATE
// ============================================================================

/** Tenant fallback presentation; no nested shell or navigation. */
export function TenantLoadingTemplate(props: TenantLoadingBlockProps) {
  return <TenantLoadingBlock {...props} />;
}
