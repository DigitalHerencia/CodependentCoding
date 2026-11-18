/** Admin route group streams identity, mandatory onboarding and tenant authorization. */
import { Suspense } from "react";
import { AdminLayoutFeature } from "@/features/admin/adminLayoutFeature";
import { AdminLayoutSkeleton } from "@/features/admin/adminLayoutSkeleton";
import type { AdminChildrenProps } from "@/types/adminTypes";
/** Keep session and organization reads behind a static shell fallback. */
export default function AdminLayout({ children }: AdminChildrenProps) {
  return (
    <Suspense fallback={<AdminLayoutSkeleton />}>
      <AdminLayoutFeature>{children}</AdminLayoutFeature>
    </Suspense>
  );
}
