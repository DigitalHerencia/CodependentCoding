import { DataTableLoadingState } from "@/components/blocks/loading-states";

export function ContactsSkeleton() {
  return <DataTableLoadingState rows={8} />;
}
