import { CrmSkeletonBlock } from "@/components/blocks/crm-blocks";

// -----------------------------------------------------------------------------
// CRM route-level Suspense fallbacks; domain block composition only.
// -----------------------------------------------------------------------------
/** Render the CRM AccountDetail route fallback, not a template. */
export function CrmAccountDetailSkeleton() {
  return <CrmSkeletonBlock variant="detail" />;
}

/** Render the CRM Accounts route fallback, not a template. */
export function CrmAccountsSkeleton() {
  return <CrmSkeletonBlock variant="directory" />;
}

/** Render the CRM Analytics route fallback, not a template. */
export function CrmAnalyticsSkeleton() {
  return <CrmSkeletonBlock variant="analytics" />;
}

/** Render the CRM ContactDetail route fallback, not a template. */
export function CrmContactDetailSkeleton() {
  return <CrmSkeletonBlock variant="detail" />;
}

/** Render the CRM Contacts route fallback, not a template. */
export function CrmContactsSkeleton() {
  return <CrmSkeletonBlock variant="directory" />;
}

/** Render the CRM Form route fallback, not a template. */
export function CrmFormSkeleton() {
  return <CrmSkeletonBlock variant="form" />;
}

/** Render the CRM LeadDetail route fallback, not a template. */
export function CrmLeadDetailSkeleton() {
  return <CrmSkeletonBlock variant="detail" />;
}

/** Render the CRM Leads route fallback, not a template. */
export function CrmLeadsSkeleton() {
  return <CrmSkeletonBlock variant="directory" />;
}

/** Render the CRM Pipeline route fallback, not a template. */
export function CrmPipelineSkeleton() {
  return <CrmSkeletonBlock variant="pipeline" />;
}
