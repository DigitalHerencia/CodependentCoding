import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Loaded Vibes Configurator',
  description:
    'Shape a production-minded SaaS recipe without choosing architecture internals.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
