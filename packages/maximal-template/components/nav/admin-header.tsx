/** Slot-only admin header; blocks provide copy and interactive presentation. */
import type { AdminHeaderProps } from "@/types/adminTypes";
/** Display desktop navigation alongside the shared mobile overlay. */
export function AdminHeader({
  brand,
  navigation,
  accountMenu,
  mobile,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex min-w-0 items-center justify-between gap-4 border-b bg-background px-4 py-4 lg:static lg:flex-wrap lg:px-6">
      {brand}
      <div className="hidden min-w-0 lg:block">{navigation}</div>
      <div className="hidden lg:block">{accountMenu}</div>
      {mobile}
    </header>
  );
}
