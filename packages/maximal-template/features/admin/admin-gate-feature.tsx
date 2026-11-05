import { getAdminSessionState } from "@/lib/auth/auth";
import { AdminVerificationForm } from "./admin-verification-form";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { canAccessAdmin } from "@/lib/fetchers/adminFetchers";

export async function AdminGateFeature({
  children,
}: Readonly<{ children: ReactNode }>) {
  if (!(await canAccessAdmin())) notFound();
  const state = await getAdminSessionState();
  if (state !== "verified")
    return (
      <AdminVerificationForm
        needsEnrollment={state === "enrollment-required"}
      />
    );
  return children;
}
