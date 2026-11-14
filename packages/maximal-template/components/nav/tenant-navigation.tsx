import {
  TenantNavigationBlock,
  TenantSidebarBlock,
} from "@/components/blocks/tenant-blocks";
import type {
  TenantNavigationBlockProps,
  TenantSidebarBlockProps,
} from "@/types/tenantTypes";

// ============================================================================
// TENANT NAVIGATION
// ============================================================================

/** Route-aware tenant navigation for the mobile menu and expanded sidebar. */
export function TenantNavigation(props: TenantNavigationBlockProps) {
  return <TenantNavigationBlock {...props} />;
}

// ============================================================================
// TENANT SIDEBAR
// ============================================================================

/** Sidebar navigation with the existing collapse and account controls. */
export function TenantSidebar(props: TenantSidebarBlockProps) {
  return <TenantSidebarBlock {...props} />;
}
