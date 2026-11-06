import { loadAdminVerificationWorkflow } from "@/lib/workflows/adminWorkflows";
import { AdminVerificationFeatureClient } from "./admin-verification-feature.client";

export async function AdminVerificationFeature() {
  const state = await loadAdminVerificationWorkflow();
  return (
    <AdminVerificationFeatureClient
      needsEnrollment={state === "enrollment-required"}
    />
  );
}
