import { guardAdminWorkflow } from "@/lib/workflows/adminWorkflows";
import type { ReactNode } from "react";
import { AdminVerificationFeatureClient } from "./admin-verification-feature.client";

export async function AdminGateFeature({
  children,
}: Readonly<{ children: ReactNode }>) {
  const state = await guardAdminWorkflow();
  if (state !== "verified")
    return (
      <AdminVerificationFeatureClient
        needsEnrollment={state === "enrollment-required"}
      />
    );
  return children;
}
