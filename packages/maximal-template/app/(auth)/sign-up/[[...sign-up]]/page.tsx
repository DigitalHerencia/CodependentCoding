/** Thin streaming entry for the sign-up route. */
import { Suspense } from "react";
import { AuthSignUpFeature } from "@/features/auth/authSignUpFeature";
import { AuthFormSkeleton } from "@/features/auth/authFormSkeleton";
/** Route ownership ends at the feature and its accessible loading boundary. */
export default function Page() {
  return (
    <Suspense fallback={<AuthFormSkeleton />}>
      <AuthSignUpFeature />
    </Suspense>
  );
}
