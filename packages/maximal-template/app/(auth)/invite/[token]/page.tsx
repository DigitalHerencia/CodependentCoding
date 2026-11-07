import { Suspense } from "react";

import { EditInvitationAcceptanceForm } from "@/features/onboarding/editInvitationAcceptanceForm";
import { OnboardingSkeleton } from "@/features/onboarding/onboarding-skeleton";
import { getIdentity } from "@/lib/auth/auth";
import { redirectToSignIn } from "@/lib/auth/redirects";

export default function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <Suspense fallback={<OnboardingSkeleton />}>
      <SignedInInvitation params={params} />
    </Suspense>
  );
}

async function SignedInInvitation({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  if (!(await getIdentity())) redirectToSignIn();
  return <EditInvitationAcceptanceForm token={(await params).token} />;
}
