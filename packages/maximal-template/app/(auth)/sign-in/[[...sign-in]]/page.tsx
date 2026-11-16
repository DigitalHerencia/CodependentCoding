import { AuthEntryFeature } from "@/features/auth/auth-entry-feature";
import { AuthSignInForm } from "@/features/auth/authSignInForm";

// URL ownership stops here; orchestration is delegated to the feature.
export default function Page() {
  return (
    <AuthEntryFeature>
      <AuthSignInForm />
    </AuthEntryFeature>
  );
}
