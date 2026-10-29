import { cn } from "@/lib/utils/cn";
import { Skeleton } from "@/components/ui/skeleton";

export function DataTableLoadingState({ rows = 6 }: { rows?: number }) {
  return (
    <div
      aria-label="Loading records"
      role="status"
      className="space-y-3 border-3 border-foreground bg-card p-4"
    >
      <div className="h-11 animate-pulse bg-muted" />
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="grid grid-cols-4 gap-3 border-t border-border pt-3"
        >
          <span className="h-5 animate-pulse bg-muted" />
          <span className="h-5 animate-pulse bg-muted" />
          <span className="h-5 animate-pulse bg-muted" />
          <span className="h-5 animate-pulse bg-muted" />
        </div>
      ))}
      <span className="sr-only">Loading records</span>
    </div>
  );
}

export function RecordDetailLoadingState() {
  return (
    <div
      aria-label="Loading record"
      role="status"
      className="space-y-6 border-3 border-foreground bg-card p-6"
    >
      <div className="h-8 w-2/3 animate-pulse bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="space-y-2 border-l-3 border-primary pl-3">
            <span className="block h-3 w-20 animate-pulse bg-muted" />
            <span className="block h-5 w-32 animate-pulse bg-muted" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading record</span>
    </div>
  );
}

const formWidths = {
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
} as const;

export function FormLoadingState({
  fields = 4,
  width = "3xl",
}: {
  fields?: number;
  width?: keyof typeof formWidths;
}) {
  return (
    <div
      aria-label="Loading form"
      role="status"
      className={cn("mx-auto space-y-5 surface-card p-5", formWidths[width])}
    >
      <div className="h-8 w-48 animate-pulse bg-muted" />
      {Array.from({ length: fields }, (_, index) => (
        <div key={index} className="space-y-2">
          <span className="block h-4 w-28 animate-pulse bg-muted" />
          <span className="block h-10 animate-pulse bg-muted" />
        </div>
      ))}
      <div className="h-10 w-32 animate-pulse bg-muted" />
      <span className="sr-only">Loading form</span>
    </div>
  );
}

export function PageLoadingState() {
  return (
    <div
      aria-label="Loading page"
      role="status"
      className="space-y-6 p-4 md:p-6"
    >
      <div className="h-10 w-64 animate-pulse bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-24 animate-pulse bg-muted" />
        ))}
      </div>
      <div className="h-80 animate-pulse bg-muted" />
      <span className="sr-only">Loading page</span>
    </div>
  );
}

// Shared placeholder for workspace pages: left rail, header, four stat
// cards, main panel and right rail.
export function WorkspaceLoadingState({ route }: { route: string }) {
  return (
    <div
      aria-label={`Loading ${route}`}
      className="grid min-h-[42rem] animate-pulse border border-border lg:grid-cols-[11rem_minmax(0,1fr)_14rem]"
      role="status"
    >
      <Skeleton className="hidden rounded-none border-r border-border lg:block" />
      <div className="space-y-4 p-4">
        <Skeleton className="h-10 w-52 rounded-none" />
        <div className="grid gap-2 sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton className="h-20 rounded-none" key={index} />
          ))}
        </div>
        <Skeleton className="h-80 rounded-none" />
      </div>
      <Skeleton className="hidden rounded-none border-l border-border lg:block" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
