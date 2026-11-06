import {
  downloadPortalDocument,
  sharePortalDocument,
} from "@/lib/actions/portalActions";
import { downloadBase64File } from "@/lib/utils/download";
import type { PortalDocumentDTO } from "@/types/portalTypes";

export function selectDocumentsWorkflow(
  documents: PortalDocumentDTO[],
  query: string,
) {
  return documents.filter((document) =>
    (document.title + " " + (document.latestVersion?.filename ?? ""))
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
}

export function getPortalDocumentCommandsWorkflow() {
  return {
    downloadPortalDocument: async (
      ...args: Parameters<typeof downloadPortalDocument>
    ) => {
      const result = await downloadPortalDocument(...args);
      if (result.ok) downloadBase64File(result.data);
      return result;
    },
    sharePortalDocument,
  };
}
