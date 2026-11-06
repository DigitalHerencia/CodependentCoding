"use client";

import { PortalDocumentControlsTemplate } from "@/components/templates/portal-templates";
import { portalPresentationCopy } from "@/content/portal";
import { getPortalDocumentCommandsWorkflow } from "@/lib/workflows/portalClientWorkflows";
import type { PortalDocumentDTO } from "@/types/portalTypes";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function DocumentFeatureClient({
  document,
  canWrite,
}: {
  document: PortalDocumentDTO;
  canWrite: boolean;
}) {
  const { downloadPortalDocument, sharePortalDocument } =
    getPortalDocumentCommandsWorkflow();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  return (
    <PortalDocumentControlsTemplate
      document={document}
      canWrite={canWrite}
      pending={pending}
      message={message}
      onDownload={() =>
        startTransition(async () => {
          try {
            const result = await downloadPortalDocument({
              documentId: document.id,
            });
            if (!result.ok) {
              setMessage(result.error.message);
              return;
            }
          } catch {
            setMessage(
              portalPresentationCopy.downloadFailedCheckFileAvailabilityStorageConfigurationAndPermissions,
            );
          }
        })
      }
      onShare={() =>
        startTransition(async () => {
          try {
            {
              const result = await sharePortalDocument({
                documentId: document.id,
                expectedVersion: document.version,
              });
              if (!result.ok) {
                setMessage(result.error.message);
                return;
              }
            }
            setMessage(
              portalPresentationCopy.documentSharedWithWorkspaceClients,
            );
            router.refresh();
          } catch {
            setMessage(
              portalPresentationCopy.documentCouldNotBeSharedCheckAccessOrReload,
            );
          }
        })
      }
    />
  );
}
