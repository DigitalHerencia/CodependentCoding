import { PublicShell } from "@/components/shells/public-shell";
import type { PublicShellProps } from "@/types/publicTypes";

// ============================================================================
// PUBLIC ROUTE-GROUP LAYOUT
// ============================================================================

/**
 * Applies the public-only shell to routes in the public group.
 *
 * @param props - Public route children.
 * @returns The public shell wrapping the requested route.
 */
export default function PublicLayout({ children }: PublicShellProps) {
  return <PublicShell>{children}</PublicShell>;
}
