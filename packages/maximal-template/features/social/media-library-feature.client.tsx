"use client";

import {
  MediaAssetControlsTemplate,
  SocialMediaTemplate,
} from "@/components/templates/social-templates";
import { socialPresentationCopy } from "@/content/social";
import { NewWorkspaceFileForm } from "@/features/uploads/newWorkspaceFileForm";
import { selectMediaLibraryWorkflow } from "@/lib/workflows/socialClientWorkflows";
import type { MediaAssetDTO, MediaAssetView } from "@/types/socialTypes";
import { useState, useTransition } from "react";

export function MediaLibraryFeatureClient({
  assets,
}: {
  assets: MediaAssetDTO[];
}) {
  const [query, setQuery] = useState("");
  const view = selectMediaLibraryWorkflow(assets, query);
  return (
    <SocialMediaTemplate
      renderControls={(asset) => (
        <MediaAssetControls asset={asset} openAsset={view.openAsset} />
      )}
      assets={view.assets}
      toolbarProps={{ query: query, onQueryChange: setQuery }}
    >
      <NewWorkspaceFileForm domain="social" />
    </SocialMediaTemplate>
  );
}

function MediaAssetControls({
  asset,
  openAsset,
}: {
  asset: MediaAssetView;
  openAsset: ReturnType<typeof selectMediaLibraryWorkflow>["openAsset"];
}) {
  const [preview, setPreview] = useState("");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  return (
    <MediaAssetControlsTemplate
      asset={asset}
      preview={preview}
      pending={pending}
      message={message}
      canPreview={asset.canPreview}
      onOpen={() =>
        startTransition(async () => {
          try {
            const result = await openAsset(asset);
            if (!result.ok) {
              setMessage(result.error.message);
              return;
            }
            if (result.data.preview) setPreview(result.data.preview);
          } catch {
            setMessage(
              socialPresentationCopy.fileUnavailableCheckStorageConfigurationOrDownloadSizeMaximum,
            );
          }
        })
      }
    />
  );
}
