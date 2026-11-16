"use client";
import { AdminErrorTemplate } from "@/components/templates/admin-shell-templates";

// Route-group errors need a client boundary; recovery presentation remains a block.
export default function RouteError({
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return <AdminErrorTemplate onRetry={reset} />;
}
