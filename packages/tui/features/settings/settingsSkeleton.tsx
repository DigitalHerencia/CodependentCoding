// Why: shown while the settings screen reads settings.json.
import { LoadingLines } from "@/components/blocks/loading-lines";

export function SettingsSkeleton() {
  return <LoadingLines lines={3} />;
}
