import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Loaded Vibes - Bad Vibes, Clean Code',
  description:
    'Bad vibes. Clean code. Solid infra. Sharted loads. A synthwave dev workflow framework for unreasonably picky engineers.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
