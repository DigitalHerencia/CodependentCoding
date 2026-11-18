/** Workspace frame accepts presentation slots without authorization, copy or primitive imports. */
import type { TenantShellProps } from "@/types/tenantTypes";
/** Share the sidebar provider with the header toggle and preserve the keyboard skip target. */
export function TenantShell({
  children,
  navigation,
  header,
  footer,
  skipLink,
}: TenantShellProps) {
  return (
    <>
      {skipLink}
      {navigation}
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        {header}
        <main id="tenant-main-content" tabIndex={-1} className="min-w-0 flex-1">
          {children}
        </main>
        {footer}
      </div>
    </>
  );
}
