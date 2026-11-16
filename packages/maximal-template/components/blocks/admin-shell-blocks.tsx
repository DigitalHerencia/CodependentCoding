import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { adminNavigationCopy } from "@/content/admin-navigation";

/** Administration route fallback stays inside the existing authenticated shell. */
export function AdminLoadingBlock({
  label = adminNavigationCopy.loadingContent,
}: {
  label?: string;
}) {
  return (
    <section
      role="status"
      aria-busy="true"
      aria-label={label}
      className="space-y-4 p-4"
    >
      <span className="sr-only">{label}</span>
      <div aria-hidden className="space-y-4">
        <Skeleton className="h-9 w-56 max-w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </section>
  );
}

/** Safe administration recovery; never expose the error or render a misleading 404. */
export function AdminErrorBlock({ onRetry }: { onRetry: () => void }) {
  return (
    <section
      role="alert"
      className="mx-auto flex min-h-[60vh] max-w-3xl items-center p-4"
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{adminNavigationCopy.errorTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{adminNavigationCopy.errorDescription}</p>
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={onRetry}>
              {adminNavigationCopy.tryAgain}
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/users">
                {adminNavigationCopy.returnToAdmin}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
