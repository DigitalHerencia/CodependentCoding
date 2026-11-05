"use client";
import { MediaAssetControlsBlock } from "@/components/blocks/social-blocks";
import { useState, useTransition } from "react";
import { downloadSocialMedia } from "@/lib/actions/socialActions";
import type { MediaAssetDTO } from "@/types/socialTypes";
export function MediaAssetControls({ asset }: { asset: MediaAssetDTO }) {
  const [preview, setPreview] = useState("");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const canPreview = /^image\/(png|jpeg|webp|gif|avif)$/.test(
    asset.contentType,
  );
  return (
    <MediaAssetControlsBlock
      asset={asset}
      preview={preview}
      pending={pending}
      message={message}
      canPreview={canPreview}
      onOpen={() =>
        startTransition(async () => {
          try {
            const file = await downloadSocialMedia(asset.id);
            if (canPreview) {
              setPreview(`data:${asset.contentType};base64,${file.base64}`);
            } else {
              const bytes = Uint8Array.from(atob(file.base64), (character) =>
                character.charCodeAt(0),
              );
              const url = URL.createObjectURL(
                new Blob([bytes], { type: "application/octet-stream" }),
              );
              const link = document.createElement("a");
              link.href = url;
              link.download = file.filename;
              document.body.append(link);
              link.click();
              link.remove();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }
          } catch {
            setMessage(
              "File unavailable. Check storage configuration or download size (maximum 10 MB).",
            );
          }
        })
      }
    />
  );
}
