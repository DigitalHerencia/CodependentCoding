import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Archivo_Black, Fira_Code, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { applicationProduct } from "@/content/application";

import "./globals.css";

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

export const metadata: Metadata = {
  title: applicationProduct.name,
  description: applicationProduct.description,
};

// Sitewide defaults and main-content spacing belong here. Shells own navigation
// and composition; blocks retain only their internal content spacing.
export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${bodyFont.variable} ${displayFont.variable} ${codeFont.variable}`}
      style={{ colorScheme: "dark" }}
    >
      <body className="m-0 min-h-dvh bg-background font-sans text-foreground antialiased [text-rendering:optimizeLegibility]">
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
