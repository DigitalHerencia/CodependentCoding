import { guardAuthEntryWorkflow } from "@/lib/workflows/authWorkflows";
import type { ReactNode } from "react";

export async function AuthEntryFeature({
  children,
}: Readonly<{ children: ReactNode }>) {
  await guardAuthEntryWorkflow();
  return children;
}
