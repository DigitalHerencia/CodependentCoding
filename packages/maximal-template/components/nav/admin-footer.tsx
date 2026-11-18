/** Admin footer accepts presentation slots without importing copy or primitives. */
import type { AdminChildrenProps } from "@/types/adminTypes";
/** Keep footer content separate from the focusable main region. */
export function AdminFooter({ children }: AdminChildrenProps) {
  return (
    <footer className="border-t-3 border-foreground px-4 py-8 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
        {children}
      </div>
    </footer>
  );
}
