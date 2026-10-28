// Why: shown while the apps screen reads each app's hipster.json.
import { LoadingLines } from "@/components/blocks/loading-lines";

export function AppsSkeleton() {
  return <LoadingLines lines={4} />;
}
