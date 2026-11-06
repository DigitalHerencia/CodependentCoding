"use client";

import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";
import { onboardingPresentationCopy } from "@/content/onboarding";
import type { ReactNode } from "react";

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

export function OnboardingAccessBlock({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-dvh bg-background px-4 py-6 text-foreground sm:px-8">
      <header className="mx-auto mb-10 max-w-lg">
        <Wordmark />
      </header>
      {children}
    </main>
  );
}
