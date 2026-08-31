'use client';
import { SystemState } from '@/components/blocks/custom/system-state';
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body className="global-error-frame">
        <SystemState
          code="GLOBAL ERROR"
          title="The public frame failed safely."
          description="No application state was changed."
          retry={reset}
        />
      </body>
    </html>
  );
}
