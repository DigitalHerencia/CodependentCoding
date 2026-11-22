"use client";

import {
  SocialMediaControlsTemplate,
  SocialMediaTemplate,
} from "@/components/templates/social-templates";
import { NewWorkspaceFileForm } from "@/features/uploads/newWorkspaceFileForm";
import { resolveSocialMediaWorkflow } from "@/lib/workflows/socialWorkflows";
import { selectSocialMedia } from "@/lib/utils/social";
import { downloadBlobFile } from "@/lib/utils/download";
import type {
  SocialMediaFeatureProps,
  SocialMediaControlsProps,
} from "@/types/socialTypes";
import { useEffect, useRef, useState, useTransition } from "react";

/** Own bounded asset filtering and preserve the existing uploads-owned ingestion form. */
export function SocialMediaFeatureClient({
  assets,
  canUpload,
}: SocialMediaFeatureProps) {
  const [query, setQuery] = useState("");
  return (
    <SocialMediaTemplate
      assets={selectSocialMedia(assets, query)}
      toolbarProps={{ query, onQueryChange: setQuery }}
      renderControls={(asset) => (
        <SocialMediaControls key={asset.id} asset={asset} />
      )}
    >
      {canUpload && <NewWorkspaceFileForm domain="social" />}
    </SocialMediaTemplate>
  );
}
/** Own browser artifact effects, release temporary preview URLs, and preserve failures as failures. */
function SocialMediaControls({
  asset,
}: Pick<SocialMediaControlsProps, "asset">) {
  const [preview, setPreview] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const mounted = useRef(false);
  const [outcome, setOutcome] =
    useState<SocialMediaControlsProps["outcome"]>("idle");
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  return (
    <SocialMediaControlsTemplate
      asset={asset}
      preview={preview}
      pending={pending}
      error={error}
      outcome={outcome}
      onPreviewLoad={() => setOutcome("preview")}
      onPreviewError={() => {
        setPreview("");
        setOutcome("idle");
        setError("UNAVAILABLE");
      }}
      onOpen={() =>
        startTransition(async () => {
          setError("");
          setOutcome("idle");
          setPreview("");
          try {
            const result = await resolveSocialMediaWorkflow(
              asset.id,
              asset.canPreview,
            );
            if (!mounted.current) return;
            if (!result.ok) {
              setError(result.error.message);
              return;
            }
            if (asset.canPreview) {
              setPreview(
                URL.createObjectURL(
                  new Blob([result.data.bytes], {
                    type: result.data.contentType,
                  }),
                ),
              );
            } else {
              downloadBlobFile(
                new Blob([result.data.bytes], {
                  type: result.data.contentType,
                }),
                result.data.filename,
              );
              setOutcome("download");
            }
          } catch {
            setError("UNAVAILABLE");
          }
        })
      }
    />
  );
}
