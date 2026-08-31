import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth/provider";
import "./globals.css";

// The root layout owns only the document frame; product shells remain reusable.
export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
