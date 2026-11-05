"use client";
import { Button } from "@/components/ui/button";
import { onboardingPresentationCopy } from "@/content/onboarding";
export function OnboardingApprovalBlock({
  pending,
  message,
  onCheck,
}: {
  pending: boolean;
  message: string;
  onCheck: () => void;
}) {
  return (
    <>
      <Button disabled={pending} onClick={onCheck}>
        {onboardingPresentationCopy.checkAccess}
      </Button>
      {message && <p role="status">{message}</p>}
    </>
  );
}
