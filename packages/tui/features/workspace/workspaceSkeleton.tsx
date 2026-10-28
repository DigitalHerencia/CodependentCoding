// Why: shown while the command center reads the checkout.
import { LoadingLines } from "@/components/blocks/loading-lines";

export function WorkspaceSkeleton() {
  return <LoadingLines lines={3} />;
}
