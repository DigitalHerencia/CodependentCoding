"use client";
import { pwaBlockCopy } from "@/content/pwa";
import { LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PwaAccountMenuBlock({
  onManageAccount,
  onSignOut,
}: {
  onManageAccount: () => void | Promise<void>;
  onSignOut: () => void | Promise<void>;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        aria-label={pwaBlockCopy.manageAccount}
        onClick={onManageAccount}
        size="icon"
        variant="outline"
      >
        <UserRound aria-hidden="true" />
      </Button>
      <Button onClick={onSignOut} size="sm" variant="ghost">
        <LogOut aria-hidden="true" />
        {pwaBlockCopy.signOut}
      </Button>
    </div>
  );
}
import { Download, X } from "lucide-react";

export function PwaInstallBlock({
  canInstall,
  showIosInstructions,
  onInstall,
  onDismiss,
}: {
  canInstall: boolean;
  showIosInstructions: boolean;
  onInstall: () => void | Promise<void>;
  onDismiss: () => void | Promise<void>;
}) {
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
