// Why: shown while the doctrine screen reads the contract and lint map.
import { LoadingLines } from "@/components/blocks/loading-lines";

export function DoctrineSkeleton() {
  return <LoadingLines lines={6} />;
}
