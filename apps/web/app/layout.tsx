import type { Metadata } from 'next';
import { Cinzel, Fira_Code, JetBrains_Mono, Oswald } from 'next/font/google';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import './globals.css';

const heritageDisplay = Oswald({
  subsets: ['latin'],
  variable: '--font-big-shoulders-display',
});

const copperplateFallback = Cinzel({
  subsets: ['latin'],
  variable: '--font-copperplate-fallback',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
});

export const metadata: Metadata = {
  title: 'Hipster Stack™ — Constituted not Composable',
  description:
    'A deterministic application constitution system for production-minded TypeScript web applications.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${heritageDisplay.variable} ${copperplateFallback.variable} ${jetBrainsMono.variable} ${firaCode.variable}`}
      >
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
