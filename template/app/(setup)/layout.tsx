import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { connection } from "next/server";
import type { ReactNode } from "react";

import { applicationProduct } from "@/content/application";
import { Wordmark } from "@/components/brand/wordmark";
import { DocumentShell } from "@/components/shells/document-shell";
import { PwaInstallFeature } from "@/features/pwa/pwaInstallFeature.client";
import { getIdentity } from "@/lib/auth/auth";
import { redirectToSignIn } from "@/lib/auth/redirects";

import "@/app/globals.css";

// Rendered per request so proxy.ts's CSP nonce reaches every script.
export const instant = false;

export const metadata: Metadata = {
  title: applicationProduct.name,
  description: applicationProduct.description,
};

export default async function SetupLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  await connection();
  if (!(await getIdentity())) redirectToSignIn();
  return (
    <DocumentShell>
      <ClerkProvider dynamic>
        <main className="min-h-dvh bg-background px-4 py-6 text-foreground sm:px-8">
          <header className="mx-auto mb-10 max-w-lg">
            <Wordmark />
          </header>
          {children}
        </main>
        <PwaInstallFeature />
      </ClerkProvider>
    </DocumentShell>
  );
}
