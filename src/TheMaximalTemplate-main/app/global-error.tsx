"use client";
import { ErrorBlock } from "@/components/blocks/error-states";

// Fatal route errors require a client boundary; recovery presentation remains a block.
export default function GlobalError({
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <html lang="en">
      <body>
        <ErrorBlock title="Something went wrong" onRetry={reset} />
      </body>
    </html>
  );
}
