import type { Metadata } from "next";
import "./globals.css";

// Only import Google Fonts if not in CI environment
let geistSans: { variable: string } | undefined;
let geistMono: { variable: string } | undefined;

if (!process.env.CI) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Geist, Geist_Mono } = require("next/font/google");
  
  geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    fallback: ['system-ui', 'arial'],
    display: 'swap',
  });

  geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    fallback: ['ui-monospace', 'Monaco', 'Consolas'],
    display: 'swap',
  });
}
 
export const metadata: Metadata = {
  title: "ChatGPT Archive Utility",
  description: "Archive and manage your ChatGPT conversations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use fonts only if not in CI
  const fontClasses = process.env.CI || !geistSans || !geistMono
    ? "antialiased" 
    : `${geistSans.variable} ${geistMono.variable} antialiased`;

  return (
    <html lang="en">
      <body className={fontClasses}>
        {children}
      </body>
    </html>
  );
}
