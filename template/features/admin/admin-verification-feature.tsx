import { notFound, redirect } from "next/navigation";
import { canAccessAdmin } from "@/lib/fetchers/adminFetchers";
import { getAdminSessionState } from "@/lib/auth/auth";
import { AdminVerificationForm } from "./admin-verification-form";
export async function AdminVerificationFeature() {
  if (!(await canAccessAdmin())) notFound();
  const state = await getAdminSessionState();
  if (state === "verified") redirect("/admin/users");
  return (
    <AdminVerificationForm needsEnrollment={state === "enrollment-required"} />
  );
}
