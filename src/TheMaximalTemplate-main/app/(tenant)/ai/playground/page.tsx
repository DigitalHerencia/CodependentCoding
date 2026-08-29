import { PlaygroundFeature } from "@/features/ai/playgroundFeature";

// URL ownership stops here; orchestration is delegated to the feature.
export default function Page() {
  return <PlaygroundFeature />;
}
