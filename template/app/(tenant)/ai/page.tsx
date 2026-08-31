import { GenerationFeature } from "@/features/ai/generationFeature";

// URL ownership stops here; orchestration is delegated to the feature.
export default function Page() {
  return <GenerationFeature />;
}
