import type { Metadata } from "next";
import type { ReactNode } from "react";

import { applicationProduct } from "@/content/application";
import { DocumentShell } from "@/components/shells/document-shell";
import { PublicShell } from "@/components/shells/public-shell";
import { PwaInstallFeature } from "@/features/pwa/pwaInstallFeature.client";

import "@/app/globals.css";

// The build fails if anything dynamic enters a public page (doctrine Ch. 03).
// Public pages load no Clerk JavaScript; proxy.ts gives them the static CSP.
export const ensureStatic = "navigation";

export const metadata: Metadata = {
  title: applicationProduct.name,
  description: applicationProduct.description,
};

export default function PublicLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <DocumentShell>
      <PublicShell>{children}</PublicShell>
      <PwaInstallFeature />
    </DocumentShell>
  );
}
