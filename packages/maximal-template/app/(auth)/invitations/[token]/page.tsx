/** Page contracts and composition for the owning application slice. */
import { Suspense } from "react";

import { InvitationsAcceptanceFeature } from "@/features/invitations/invitationsAcceptanceFeature";
import { AuthFormSkeleton } from "@/features/auth/authFormSkeleton";

export default function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <Suspense fallback={<AuthFormSkeleton />}>
      <InvitationsAcceptanceFeature params={params} />
    </Suspense>
  );
}
