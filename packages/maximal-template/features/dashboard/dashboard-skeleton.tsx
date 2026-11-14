import { Skeleton } from "@/components/ui/skeleton";
import { dashboardCopy } from "@/content/dashboard";

/** Dashboard-specific, accessible Suspense fallback without a second tenant shell. */
export function DashboardSkeleton() {
  return (
    <section role="status" aria-label={dashboardCopy.loading} className="space-y-5 p-4">
      <Skeleton className="h-10 w-56" />
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton className="h-28 w-full" key={index} />
        ))}
      </div>
      <Skeleton className="h-60 w-full" />
      <Skeleton className="h-40 w-full" />
      <span className="sr-only">{dashboardCopy.loading}</span>
    </section>
  );
}
