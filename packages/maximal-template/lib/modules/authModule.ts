/** Identity, Clerk sessions, and local profile onboarding belong to auth. */
import type { ModuleDefinition } from "@/types/moduleTypes";
/** Auth is a required core domain and contributes no tenant permission grants. */
export const authModule = {
  id: "auth",
  integration: {
    name: "Clerk",
    purpose: "Identity and sessions",
    env: [
      "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
      "CLERK_SECRET_KEY",
      "CLERK_WEBHOOK_SIGNING_SECRET",
    ],
  },
} satisfies ModuleDefinition;
