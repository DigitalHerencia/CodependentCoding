"use client";

import { Download, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const VISITED_KEY = "pwa-visited";
const DISMISSED_KEY = "pwa-install-dismissed";

function isIosSafari() {
  const userAgent = window.navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(userAgent) &&
    !/CriOS|FxiOS|OPiOS|EdgiOS/.test(userAgent)
  );
}

/** Registers the worker and offers a non-modal install affordance after visit one. */
export function PwaInstallFeature() {
  const promptEvent = useRef<InstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    void navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });

    const returningVisitor = window.localStorage.getItem(VISITED_KEY) === "1";
    window.localStorage.setItem(VISITED_KEY, "1");
    if (!returningVisitor || window.localStorage.getItem(DISMISSED_KEY) === "1")
      return;

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      promptEvent.current = event as InstallPromptEvent;
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    const timer = window.setTimeout(() => {
      setShowIosInstructions(
        isIosSafari() &&
          (window.navigator as Navigator & { standalone?: boolean })
            .standalone !== true,
      );
    });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  if (!canInstall && !showIosInstructions) return null;

  const dismiss = () => {
    window.localStorage.setItem(DISMISSED_KEY, "1");
    setCanInstall(false);
    setShowIosInstructions(false);
  };

  const install = async () => {
    const event = promptEvent.current;
    if (!event) return;
    await event.prompt();
    const { outcome } = await event.userChoice;
    if (outcome === "accepted") setCanInstall(false);
  };

  return (
    <aside className="fixed right-4 bottom-4 z-50 flex max-w-sm items-center gap-3 border border-neutral-400 bg-black p-3 text-sm text-white shadow-[6px_6px_0_0_oklch(54.6%_0.245_262.881_/_0.24)]">
      <div>
        <p className="font-medium">Install this app</p>
        {showIosInstructions && (
          <p className="mt-1 text-neutral-300">
            Use Share, then Add to Home Screen.
          </p>
        )}
      </div>
      {canInstall && (
        <Button size="sm" onClick={install}>
          <Download aria-hidden="true" /> Install
        </Button>
      )}
      <Button
        size="icon"
        variant="ghost"
        aria-label="Dismiss install prompt"
        onClick={dismiss}
      >
        <X aria-hidden="true" />
      </Button>
    </aside>
  );
}
