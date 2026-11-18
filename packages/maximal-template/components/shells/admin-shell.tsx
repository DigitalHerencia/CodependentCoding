/** Admin shell contains layout slots only; its feature orchestrates authorization. */
import type { AdminShellProps } from "@/types/adminTypes";
/** Preserve a keyboard skip target and a stable minimum-height shell. */
export function AdminShell({
  children,
  header,
  footer,
  skipLink,
}: AdminShellProps) {
  return (
    <div className="flex min-h-dvh min-w-0 flex-col">
      {skipLink}
      {header}
      <main id="admin-main-content" tabIndex={-1} className="min-w-0 flex-1">
        {children}
      </main>
      {footer}
    </div>
  );
}
