import { Archivo_Black, Fira_Code, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";

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

/**
 * The <html> document every root layout renders. Each route group is its own
 * root layout so `(public)` can prerender while the signed-in groups render
 * the whole document per request (their CSP nonce must reach every script).
 * Sitewide defaults and main-content spacing belong here; shells own
 * navigation and composition.
 */
export function DocumentShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${bodyFont.variable} ${displayFont.variable} ${codeFont.variable}`}
      style={{ colorScheme: "dark" }}
    >
      <body className="m-0 min-h-dvh bg-background font-sans text-foreground antialiased [text-rendering:optimizeLegibility]">
        {children}
      </body>
    </html>
  );
}
