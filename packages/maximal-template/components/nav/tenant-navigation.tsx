/** Workspace sidebar landmark; all primitive composition belongs to the tenant block. */
import type { TenantNavigationProps } from "@/types/tenantTypes";
/** One responsive sidebar carries the same authorized destinations at every viewport width. */
export function TenantNavigation({ children, label }: TenantNavigationProps) {
  return (
    <nav aria-label={label} className="contents">
      {children}
    </nav>
  );
}
