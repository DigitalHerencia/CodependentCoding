// Why: shown while the new-app screen reads the presets.
import { LoadingLines } from "@/components/blocks/loading-lines";

export function AppsNewSkeleton() {
  return <LoadingLines lines={3} />;
}
