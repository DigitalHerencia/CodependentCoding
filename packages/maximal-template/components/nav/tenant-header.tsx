/** Slot-only workspace header; domain blocks supply branding and responsive controls. */
import type { TenantHeaderProps } from "@/types/tenantTypes";
/** Preserve a visible toggle for the shared responsive sidebar. */
export function TenantHeader({ brand, controls }: TenantHeaderProps) {
  return (
    <header className="flex min-h-20 items-center gap-4 border-b-3 border-foreground px-4 md:px-8">
      {controls}
      {brand}
    </header>
  );
}
