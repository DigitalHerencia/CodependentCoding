/** Slot-only administration frame; workflows own all identity and access decisions. */
import type { AdminShellProps } from "@/types/adminTypes";
/** The shared responsive sidebar sits alongside a flexible, keyboard-accessible main region. */
export function AdminShell({
  children,
  navigation,
  header,
  footer,
  skipLink,
}: AdminShellProps) {
  return (
    <>
      {skipLink}
      {navigation}
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        {header}
        <main id="admin-main-content" tabIndex={-1} className="min-w-0 flex-1">
          {children}
        </main>
        {footer}
      </div>
    </>
  );
}
