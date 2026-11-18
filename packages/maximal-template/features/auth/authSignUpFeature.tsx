/** SignUp route orchestration: identity guard followed by the owned RHF form. */
import { guardAuthEntryWorkflow } from "@/lib/workflows/authWorkflows";
import { AuthNewSignUpForm } from "@/features/auth/authNewSignUpForm";
/** Clerk middleware gates navigation; this guard also protects direct server rendering. */
export async function AuthSignUpFeature() {
  await guardAuthEntryWorkflow();
  return <AuthNewSignUpForm />;
}
