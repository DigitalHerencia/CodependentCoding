import { EditInvitationAcceptanceForm } from "@/features/onboarding/editInvitationAcceptanceForm";
import { OnboardingAccessFeature } from "@/features/onboarding/onboarding-access-feature";

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <OnboardingAccessFeature>
      <EditInvitationAcceptanceForm token={(await params).token} />
    </OnboardingAccessFeature>
  );
}
