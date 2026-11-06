import { getIdentity } from "@/lib/auth/auth";
import { redirectAfterAuth } from "@/lib/auth/redirects";
import "server-only";

export async function guardAuthEntryWorkflow() {
  if (await getIdentity()) redirectAfterAuth();
}
