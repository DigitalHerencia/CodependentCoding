import { PortalDocumentDetailTemplate } from "@/components/templates/portal-templates";
import { NewWorkspaceFileForm } from "@/features/uploads/newWorkspaceFileForm";
import { loadDocumentWorkflow } from "@/lib/workflows/portalWorkflows";
import { DocumentFeatureClient } from "./document-feature.client";
import { NewDocumentVersionForm } from "./newDocumentVersionForm";

export async function DocumentFeature({ documentId }: { documentId: string }) {
  const { document, canWrite, assets } = await loadDocumentWorkflow({
    documentId,
  });
  return (
    <PortalDocumentDetailTemplate document={document}>
      <DocumentFeatureClient document={document} canWrite={canWrite} />
      {canWrite && <NewWorkspaceFileForm domain="portal" />}
      {canWrite && (
        <NewDocumentVersionForm
          key={document.version}
          document={document}
          assets={assets}
        />
      )}
    </PortalDocumentDetailTemplate>
  );
}
