import { OnboardingAccessFeature } from "@/features/onboarding/onboarding-access-feature";
import { InvitationAcceptForm } from "@/features/onboarding/invitation-accept-form";

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <OnboardingAccessFeature>
      <InvitationAcceptForm token={(await params).token} />
    </OnboardingAccessFeature>
  );
}
