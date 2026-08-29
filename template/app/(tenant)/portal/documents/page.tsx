import { DocumentsFeature } from "@/features/portal/documentsFeature";

// URL ownership stops here; orchestration is delegated to the feature.
export default function Page() {
  return <DocumentsFeature />;
}
