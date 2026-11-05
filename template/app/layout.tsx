import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Archivo_Black, Fira_Code, JetBrains_Mono } from "next/font/google";
import { connection } from "next/server";
import type { ReactNode } from "react";

import { applicationProduct } from "@/content/application";
import { PwaInstallFeature } from "@/features/pwa/pwa-install-feature.client";

import "@/app/globals.css";

const bodyFont = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});
const displayFont = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-heading",
});
const codeFont = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-code",
});

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
    <html
      lang="en"
      className={`dark ${bodyFont.variable} ${displayFont.variable} ${codeFont.variable}`}
      style={{ colorScheme: "dark" }}
    >
      <body className="m-0 min-h-dvh bg-background font-sans text-foreground antialiased [text-rendering:optimizeLegibility]">
        <ClerkProvider dynamic>
          {children}
          <PwaInstallFeature />
        </ClerkProvider>
      </body>
    </html>
  );
}
