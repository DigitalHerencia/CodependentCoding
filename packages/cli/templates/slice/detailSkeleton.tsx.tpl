// Why: Skeleton: matches the {{entity}} detail layout.
import { Skeleton } from "@/components/ui/skeleton";

export function {{Entity}}Skeleton() {
  return (
    <div
      aria-label="Loading /{{route}}/[{{param}}]"
      className="animate-pulse space-y-4 border border-border p-4"
      role="status"
    >
      <Skeleton className="h-10 w-52 rounded-none" />
      <Skeleton className="h-64 rounded-none" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
