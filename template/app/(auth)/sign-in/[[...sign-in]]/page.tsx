import { AuthEntryFeature } from "@/features/auth/authEntryFeature";
import { SignInForm } from "@/features/auth/signInForm";

// URL ownership stops here; orchestration is delegated to the feature.
export default function Page() {
  return (
    <AuthEntryFeature>
      <SignInForm />
    </AuthEntryFeature>
  );
}
