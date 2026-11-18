/** Admin access is checked here before the shell or protected children render. */
import { Suspense } from "react";
import { AdminShellFeature } from "@/components/shells/admin-shell";
import { AdminLayoutSkeleton } from "@/features/admin/adminLayoutSkeleton";
import { OnboardingGateFeature } from "@/features/onboarding/onboarding-gate-feature";
import {
  guardAdminWorkflow,
  requireAdminIdentityWorkflow,
} from "@/lib/workflows/adminWorkflows";
import type { AdminChildrenProps } from "@/types/adminTypes";

/** Authorize after the mandatory profile gate has allowed rendering. */
async function AuthorizedAdminLayout({ children }: AdminChildrenProps) {
  await guardAdminWorkflow();
  return <AdminShellFeature>{children}</AdminShellFeature>;
}

/** Identity precedes onboarding, and organization authorization precedes the shell. */
async function AdminIdentityLayout({ children }: AdminChildrenProps) {
  await requireAdminIdentityWorkflow();
  return (
    <OnboardingGateFeature>
      <AuthorizedAdminLayout>{children}</AuthorizedAdminLayout>
    </OnboardingGateFeature>
  );
}

/** Stream identity-dependent layout work behind its accessible fallback. */
export default function AdminLayout({ children }: AdminChildrenProps) {
  return (
    <Suspense fallback={<AdminLayoutSkeleton />}>
      <AdminIdentityLayout>{children}</AdminIdentityLayout>
    </Suspense>
  );
}
