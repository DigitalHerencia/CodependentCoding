import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteShell } from "@/components/shells/site-shell";
import "./globals.css";

export const ensureStatic = "navigation";

const cinzel = localFont({
  src: "../public/fonts/cinzel-latin-variable.woff2",
  weight: "600 700",
  style: "normal",
  display: "swap",
  variable: "--font-cinzel",
  adjustFontFallback: "Times New Roman",
  fallback: ["Copperplate Gothic", "Copperplate", "serif"],
});

const jetBrainsMono = localFont({
  src: "../public/fonts/jetbrains-mono-latin-variable.woff2",
  weight: "100 800",
  style: "normal",
  display: "swap",
  variable: "--font-jetbrains-mono",
  adjustFontFallback: "Arial",
  fallback: ["ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
});

export const metadata: Metadata = {
  title: "The Codependent Coding™ Web App Architecture",
  description:
    "A software factory: the Codependent Coding doctrine, the Maximal Template, the Hipster Stack CLI, and the Loaded Vibes plugin.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${jetBrainsMono.variable}`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
