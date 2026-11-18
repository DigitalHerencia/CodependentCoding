/** Workspace footer accepts only presentation slots. */
import type { TenantChildrenProps } from "@/types/tenantTypes";
/** Keep the domain footer separate from the focusable main region. */
export function TenantFooter({ children }: TenantChildrenProps) {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-5 text-sm text-muted-foreground">
      {children}
    </footer>
  );
}
