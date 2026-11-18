/** Admin footer accepts presentation slots without importing copy or primitives. */
import type { AdminChildrenProps } from "@/types/adminTypes";
/** Keep footer content separate from the focusable main region. */
export function AdminFooter({ children }: AdminChildrenProps) {
  return (
    <footer className="border-t px-4 py-5 text-sm text-muted-foreground lg:px-6">
      {children}
    </footer>
  );
}
