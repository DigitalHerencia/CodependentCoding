import { AuthEntryFeature } from "@/features/auth/authEntryFeature";
import { SignUpForm } from "@/features/auth/signUpForm";

// URL ownership stops here; orchestration is delegated to the feature.
export default function Page() {
  return (
    <AuthEntryFeature>
      <SignUpForm />
    </AuthEntryFeature>
  );
}
