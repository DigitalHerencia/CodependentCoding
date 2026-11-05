import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { connection } from "next/server";
import type { ReactNode } from "react";

import { applicationProduct } from "@/content/application";
import { DocumentShell } from "@/components/shells/document-shell";
import { PwaInstallFeature } from "@/features/pwa/pwaInstallFeature.client";

import "@/app/globals.css";

// Rendered per request so proxy.ts's CSP nonce reaches every script.
export const instant = false;

export const metadata: Metadata = {
  title: applicationProduct.name,
  description: applicationProduct.description,
};

// The root provides the shared document and Clerk context.
export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  await connection();
  return (
    <DocumentShell>
      <ClerkProvider dynamic>
        {children}
        <PwaInstallFeature />
      </ClerkProvider>
    </DocumentShell>
  );
}
