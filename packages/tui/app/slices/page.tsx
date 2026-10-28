// Why: the slice screen; nothing to load first, so it shows the companion directly.
import { SlicesFeatureClient } from "@/features/slices/slicesFeature.client";

export function SlicesPage() {
  return <SlicesFeatureClient />;
}
