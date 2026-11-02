import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { connection } from "next/server";
import type { ReactNode } from "react";

import { applicationProduct } from "@/content/application";
import { AuthShell } from "@/components/shells/auth-shell";
import { DocumentShell } from "@/components/shells/document-shell";
import { PwaInstallFeature } from "@/features/pwa/pwaInstallFeature.client";
import { getIdentity } from "@/lib/auth/auth";
import { redirectAfterAuth } from "@/lib/auth/redirects";

import "@/app/globals.css";

// Rendered per request so proxy.ts's CSP nonce reaches every script.
export const instant = false;

export const metadata: Metadata = {
  title: applicationProduct.name,
  description: applicationProduct.description,
};

// Auth routes share a frame; Clerk behavior remains under lib/auth.
export default async function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  await connection();
  if (await getIdentity()) redirectAfterAuth();
  return (
    <DocumentShell>
      <ClerkProvider dynamic>
        <AuthShell>{children}</AuthShell>
        <PwaInstallFeature />
      </ClerkProvider>
    </DocumentShell>
  );
}
