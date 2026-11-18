/** Slot-only administration header; primitive controls are composed in blocks. */
import type { AdminHeaderProps } from "@/types/adminTypes";
/** Keep the responsive sidebar toggle available at every viewport width. */
export function AdminHeader({ brand, controls }: AdminHeaderProps) {
  return (
    <header className="flex min-h-20 items-center gap-4 border-b-3 border-foreground bg-background px-4 md:px-8">
      {controls}
      {brand}
    </header>
  );
}
