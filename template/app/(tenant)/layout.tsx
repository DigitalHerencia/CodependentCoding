import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { connection } from "next/server";
import type { ReactNode } from "react";

import { applicationProduct } from "@/content/application";
import { DocumentShell } from "@/components/shells/document-shell";
import { OnboardingGateFeature } from "@/features/onboarding/onboardingGateFeature";
import { getIdentity } from "@/lib/auth/auth";
import { redirectToSignIn } from "@/lib/auth/redirects";

import "@/app/globals.css";

// The whole document renders per request so proxy.ts's CSP nonce reaches
// every script; a prerendered shell would carry scripts without it.
export const instant = false;

export const metadata: Metadata = {
  title: applicationProduct.name,
  description: applicationProduct.description,
};

export default async function TenantLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  await connection();
  const identity = await getIdentity();
  if (!identity) redirectToSignIn();

  return (
    <DocumentShell>
      <ClerkProvider dynamic>
        <OnboardingGateFeature>{children}</OnboardingGateFeature>
      </ClerkProvider>
    </DocumentShell>
  );
}
