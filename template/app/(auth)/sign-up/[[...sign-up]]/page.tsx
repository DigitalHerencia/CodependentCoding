import { AuthEntryFeature } from "@/features/auth/auth-entry-feature";
import { SignUpForm } from "@/features/auth/sign-up-form";

// URL ownership stops here; orchestration is delegated to the feature.
export default function Page() {
  return (
    <AuthEntryFeature>
      <SignUpForm />
    </AuthEntryFeature>
  );
}
