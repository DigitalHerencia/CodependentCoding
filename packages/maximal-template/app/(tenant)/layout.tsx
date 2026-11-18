/** Tenant root layout streams the authenticated feature with its direct skeleton fallback. */
import { Suspense } from "react";
import { TenantLayoutFeature } from "@/features/tenant/tenantLayoutFeature";
import { TenantLayoutSkeleton } from "@/features/tenant/tenantLayoutSkeleton";
import type { TenantChildrenProps } from "@/types/tenantTypes";
/** Routes compose features without application, copy, primitive or template imports. */
export default function TenantLayout({ children }: TenantChildrenProps) {
  return (
    <Suspense fallback={<TenantLayoutSkeleton />}>
      <TenantLayoutFeature>{children}</TenantLayoutFeature>
    </Suspense>
  );
}
