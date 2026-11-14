"use client";

import { PublicErrorTemplate } from "@/components/templates/public-templates";
import type { PublicErrorBoundaryProps } from "@/types/publicTypes";

/**
 * Handles recoverable errors inside the public route group only.
 *
 * @param props - Error details and the Next.js reset callback.
 * @returns Public presentation with an interactive retry action.
 */
export default function PublicRouteError({ reset }: PublicErrorBoundaryProps) {
  return <PublicErrorTemplate onRetry={reset} />;
}
