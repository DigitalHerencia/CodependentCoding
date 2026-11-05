"use client";
import { GenericErrorPage } from "@/components/blocks/error-pages";

// Route-group errors need a client boundary; recovery presentation remains a block.
export default function RouteError({
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <GenericErrorPage
      actions={[
        { label: "Try again", onClick: reset },
        { label: "Go home", href: "/", variant: "outline" },
      ]}
      className="min-h-[60vh]"
      title="Something went wrong"
    />
  );
}
