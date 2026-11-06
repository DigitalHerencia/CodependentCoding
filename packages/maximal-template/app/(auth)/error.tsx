"use client";
import { GenericErrorTemplate } from "@/components/templates/shared-templates";

// Route-group errors need a client boundary; recovery presentation remains a block.
export default function RouteError({
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <GenericErrorTemplate
      actions={[
        { label: "Try again", onClick: reset },
        { label: "Return to auth", href: "/sign-in", variant: "outline" },
      ]}
      className="min-h-[60vh]"
      title="Something went wrong"
    />
  );
}
