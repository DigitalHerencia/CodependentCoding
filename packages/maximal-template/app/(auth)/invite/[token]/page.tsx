import { Suspense } from "react";

import { EditInvitationAcceptanceForm } from "@/features/invitations/editInvitationAcceptanceForm";
import { InvitationSkeleton } from "@/features/invitations/invitation-skeleton";
import { getIdentity } from "@/lib/auth/auth";
import { redirectToSignIn } from "@/lib/auth/redirects";

export default function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <Suspense fallback={<InvitationSkeleton />}>
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
