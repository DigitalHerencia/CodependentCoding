'use client';
import { SystemState } from '@/components/blocks/custom/system-state';
export default function ErrorBoundary({ reset }: { reset: () => void }) {
  return (
    <SystemState
      code="ERROR"
      title="The surface could not be rendered."
      description="The failure stayed bounded. Retry or return to the public architecture."
      retry={reset}
    />
  );
}
