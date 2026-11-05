"use client";
import { portalBlockCopy } from "@/content/portal";
import { Button } from "@/components/ui/button";

import type { PortalDocumentDTO } from "@/types/portalTypes";

export function PortalDocumentControlsBlock({
  document,
  canWrite,
  pending,
  message,
  onDownload,
  onShare,
}: {
  document: PortalDocumentDTO;
  canWrite: boolean;
  pending: boolean;
  message: string;
  onDownload: () => void | Promise<void>;
  onShare: () => void | Promise<void>;
}) {
  return (
    <div className="my-4 space-y-3">
      {document.latestVersion && (
        <Button disabled={pending} onClick={onDownload}>
          {portalBlockCopy.downloadCurrentFile}
        </Button>
      )}
      {canWrite &&
        document.latestVersion &&
        (!document.clientVisible || document.status !== "PUBLISHED") && (
          <Button disabled={pending} onClick={onShare}>
            {portalBlockCopy.shareWithClients}
          </Button>
        )}
      <p role="status">{message}</p>
    </div>
  );
}
