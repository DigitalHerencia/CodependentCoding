// Why: the checks screen; nothing to load first, so it shows the companion directly.
import { ChecksFeatureClient } from "@/features/checks/checksFeature.client";

export function ChecksPage() {
  return <ChecksFeatureClient />;
}
