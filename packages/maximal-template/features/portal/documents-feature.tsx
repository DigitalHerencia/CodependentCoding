import { loadDocumentsWorkflow } from "@/lib/workflows/portalWorkflows";
import { DocumentsFeatureClient } from "./documents-feature.client";

export async function DocumentsFeature() {
  const { documents, canWrite } = await loadDocumentsWorkflow();
  return <DocumentsFeatureClient documents={documents} canWrite={canWrite} />;
}
