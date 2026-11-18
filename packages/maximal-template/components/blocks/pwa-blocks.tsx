"use client";
/** PWA install presentation; identity/account controls belong to auth. */
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pwaBlockCopy } from "@/content/pwa";
import type { PwaInstallProps } from "@/types/pwaTypes";
/** Render the existing install affordance independently of account navigation. */
export function PwaInstallBlock({
  canInstall,
  showIosInstructions,
  onInstall,
  onDismiss,
}: PwaInstallProps) {
  return (
    <aside className="fixed right-4 bottom-4 z-50 flex max-w-sm items-center gap-3 border border-neutral-400 bg-black p-3 text-sm text-white shadow-[6px_6px_0_0_oklch(54.6%_0.245_262.881_/_0.24)]">
      <div>
        <p className="font-medium">{pwaBlockCopy.installThisApp}</p>
        {showIosInstructions && (
          <p className="mt-1 text-neutral-300">
            {pwaBlockCopy.useShareThenAddToHomeScreen}
          </p>
        )}
      </div>
      {canInstall && (
        <Button size="sm" onClick={onInstall}>
          <Download aria-hidden="true" />
          {pwaBlockCopy.install}
        </Button>
      )}
      <Button
        size="icon"
        variant="ghost"
        aria-label={pwaBlockCopy.dismissInstallPrompt}
        onClick={onDismiss}
      >
        <X aria-hidden="true" />
      </Button>
    </aside>
  );
}
