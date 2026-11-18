/** Thin streaming entry for the sign-in route. */
import { Suspense } from "react";
import { AuthSignInFeature } from "@/features/auth/authSignInFeature";
import { AuthFormSkeleton } from "@/features/auth/authFormSkeleton";
/** Route ownership ends at the feature and its accessible loading boundary. */
export default function Page() {
  return (
    <Suspense fallback={<AuthFormSkeleton />}>
      <AuthSignInFeature />
    </Suspense>
  );
}
