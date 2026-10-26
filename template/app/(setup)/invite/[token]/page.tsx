import { InvitationAcceptForm } from "@/features/onboarding/invitationAcceptForm";

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return <InvitationAcceptForm token={(await params).token} />;
}
