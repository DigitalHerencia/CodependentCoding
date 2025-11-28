import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'Loaded Vibes - Bad Vibes, Clean Code',
  description:
    'Bad vibes. Clean code. Solid infra. Sharted loads. An enterprise-grade agentic TypeScript web development framework.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-256.png', sizes: '256x256', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <Analytics />
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
