import { guardAdminWorkflow } from "@/lib/workflows/adminWorkflows";
import type { ReactNode } from "react";

// Only members who may enter administration see admin pages; others get 404.
export async function AdminGateFeature({
  children,
}: Readonly<{ children: ReactNode }>) {
  await guardAdminWorkflow();
  return children;
}
