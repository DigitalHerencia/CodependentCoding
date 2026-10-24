// Why: Skeleton: matches the {{entity}} list layout.
import { Skeleton } from "@/components/ui/skeleton";

export function {{Entities}}Skeleton() {
  return (
    <div
      aria-label="Loading /{{route}}"
      className="animate-pulse space-y-4 border border-border p-4"
      role="status"
    >
      <Skeleton className="h-10 w-52 rounded-none" />
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton className="h-40 rounded-none" key={index} />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
