import { EditInvitationAcceptanceForm } from "@/features/onboarding/editInvitationAcceptanceForm";
import { getIdentity } from "@/lib/auth/auth";
import { redirectToSignIn } from "@/lib/auth/redirects";

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  if (!(await getIdentity())) redirectToSignIn();

  return <EditInvitationAcceptanceForm token={(await params).token} />;
}
