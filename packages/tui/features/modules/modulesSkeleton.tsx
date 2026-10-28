// Why: shown while the modules screen reads the manifest.
import { LoadingLines } from "@/components/blocks/loading-lines";

export function ModulesSkeleton() {
  return <LoadingLines lines={6} />;
}
