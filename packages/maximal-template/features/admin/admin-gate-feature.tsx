/** Only privileged active members may render admin content; commands authorize independently. */
import { guardAdminWorkflow } from "@/lib/workflows/adminWorkflows";
import type { AdminChildrenProps } from "@/types/adminTypes";
/** Resolve the server-selected organization before exposing administration. */
export async function AdminGateFeature({ children }: AdminChildrenProps) {
  await guardAdminWorkflow();
  return children;
}
