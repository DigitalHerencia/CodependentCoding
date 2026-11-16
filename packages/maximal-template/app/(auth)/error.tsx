"use client";
import { AuthErrorTemplate } from "@/components/templates/auth-templates";

// Route-group errors need a client boundary; recovery presentation remains a block.
export default function RouteError({
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return <AuthErrorTemplate reset={reset} />;
}
