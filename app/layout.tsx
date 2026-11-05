import type { Metadata } from "next";
import {
  Archivo_Black,
  Cinzel,
  Fira_Code,
  JetBrains_Mono,
} from "next/font/google";
import { SiteShell } from "@/components/shells/site-shell";
import "./globals.css";

const heritageDisplay = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-big-shoulders-display",
});

// Cinzel and Fira Code are not used on the homepage, so they are not preloaded.
const copperplateFallback = Cinzel({
  subsets: ["latin"],
  preload: false,
  variable: "--font-copperplate-fallback",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  preload: false,
  variable: "--font-fira-code",
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
      <body
        className={`${heritageDisplay.variable} ${copperplateFallback.variable} ${jetBrainsMono.variable} ${firaCode.variable}`}
      >
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
