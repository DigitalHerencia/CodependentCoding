"use client";
import { portalPresentationCopy } from "@/content/portal";
import { PortalDocumentControlsBlock } from "@/components/blocks/portal-blocks";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  downloadPortalDocument,
  sharePortalDocument,
} from "@/lib/actions/portalActions";
import type { PortalDocumentDTO } from "@/types/portalTypes";
export function PortalDocumentControls({
  document,
  canWrite,
}: {
  document: PortalDocumentDTO;
  canWrite: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  return (
    <PortalDocumentControlsBlock
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
            const file = result.data;
            const bytes = Uint8Array.from(atob(file.base64), (character) =>
              character.charCodeAt(0),
            );
            const url = URL.createObjectURL(
              new Blob([bytes], { type: "application/octet-stream" }),
            );
            const link = documentElement(file.filename, url);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
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
function documentElement(filename: string, url: string) {
  const link = window.document.createElement("a");
  link.href = url;
  link.download = filename;
  window.document.body.append(link);
  return link;
}
