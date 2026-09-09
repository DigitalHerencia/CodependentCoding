"use client";
import Image from "next/image";
import { useState, useTransition } from "react";
import { downloadSocialMedia } from "@/lib/actions/socialActions";
import { Button } from "@/components/ui/button";
import type { MediaAssetDTO } from "@/types/socialTypes";
export function MediaAssetControls({ asset }: { asset: MediaAssetDTO }) {
  const [preview, setPreview] = useState("");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const canPreview = /^image\/(png|jpeg|webp|gif|avif)$/.test(
    asset.contentType,
  );
  return (
    <div className="mt-3 space-y-3">
      {preview && (
        <Image
          src={preview}
          unoptimized
          width={640}
          height={360}
          className="aspect-video w-full object-contain"
          alt={asset.filename}
        />
      )}
      <Button
        disabled={pending}
        size="sm"
        onClick={() =>
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
      >
        {pending ? "Loading…" : canPreview ? "Preview image" : "Download file"}
      </Button>
      <p role="status">{message}</p>
    </div>
  );
}
