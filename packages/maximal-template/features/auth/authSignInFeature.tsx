/** SignIn route orchestration: identity guard followed by the owned RHF form. */
import { guardAuthEntryWorkflow } from "@/lib/workflows/authWorkflows";
import { AuthNewSignInForm } from "@/features/auth/authNewSignInForm";
/** Clerk middleware gates navigation; this guard also protects direct server rendering. */
export async function AuthSignInFeature() {
  await guardAuthEntryWorkflow();
  return <AuthNewSignInForm />;
}
