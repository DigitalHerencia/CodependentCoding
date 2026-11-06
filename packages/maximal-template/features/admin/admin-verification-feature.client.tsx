"use client";

import { AdminVerificationTemplate } from "@/components/templates/admin-templates";
import { useAdminVerificationWorkflow } from "@/lib/workflows/adminClientWorkflows";

export function AdminVerificationFeatureClient({
  needsEnrollment,
}: {
  needsEnrollment: boolean;
}) {
  const view = useAdminVerificationWorkflow();
  return (
    <AdminVerificationTemplate needsEnrollment={needsEnrollment} {...view} />
  );
}
