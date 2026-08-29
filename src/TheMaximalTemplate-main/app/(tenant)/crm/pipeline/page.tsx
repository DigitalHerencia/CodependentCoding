import { PipelineFeature } from "@/features/crm/pipelineFeature";

// URL ownership stops here; orchestration is delegated to the feature.
export default function Page() {
  return <PipelineFeature />;
}
