import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

import "./globals.css";

// The root layout owns only the document frame; product shells remain reusable.
export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
