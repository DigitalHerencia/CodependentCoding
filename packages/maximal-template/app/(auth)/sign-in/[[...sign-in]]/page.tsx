import { AuthEntryFeature } from "@/features/auth/auth-entry-feature";
import { SignInForm } from "@/features/auth/sign-in-form";

// URL ownership stops here; orchestration is delegated to the feature.
export default function Page() {
  return (
    <AuthEntryFeature>
      <SignInForm />
    </AuthEntryFeature>
  );
}
