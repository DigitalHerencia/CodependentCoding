import { AuthEntryFeature } from "@/features/auth/auth-entry-feature";
import { AuthSignUpForm } from "@/features/auth/authSignUpForm";

// URL ownership stops here; orchestration is delegated to the feature.
export default function Page() {
  return (
    <AuthEntryFeature>
      <AuthSignUpForm />
    </AuthEntryFeature>
  );
}
