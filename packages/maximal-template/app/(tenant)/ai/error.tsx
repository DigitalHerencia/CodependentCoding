"use client";

import { AiErrorBlock } from "@/components/blocks/ai-blocks";
import type { AiErrorBoundaryProps } from "@/types/aiTypes";

/** Next owns recovery while the block owns accessible, diagnostic-free error presentation. */
export default function AiRouteError({ reset }: AiErrorBoundaryProps) {
  return <AiErrorBlock onRetry={reset} />;
}
