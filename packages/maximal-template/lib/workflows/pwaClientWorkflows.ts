/** Browser installation and cache capabilities; auth owns provider identity operations. */
import { isDevelopment } from "@/lib/constants/mode";
import { useEffect, useRef, useState } from "react";
import type { PwaInstallPromptEvent } from "@/types/pwaTypes";

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
export function usePwaInstallWorkflow() {
  const promptEvent = useRef<PwaInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (isDevelopment) {
      void (async () => {
        const registration = await navigator.serviceWorker.getRegistration("/");
        const worker =
          registration?.active ??
          registration?.waiting ??
          registration?.installing;
        if (
          registration?.scope === new URL("/", window.location.href).href &&
          worker &&
          new URL(worker.scriptURL).pathname === "/sw.js"
        ) {
          await registration.unregister();
        }
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(
            keys
              .filter((key) => key.startsWith("maximal-shell-"))
              .map((key) => caches.delete(key)),
          );
        }
      })().catch(() =>
        console.warn("Could not clear the development PWA cache."),
      );
      return;
    }

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
      promptEvent.current = event as PwaInstallPromptEvent;
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

  return {
    canInstall,
    showIosInstructions,
    onInstall: install,
    onDismiss: dismiss,
  };
}

/** Wait for the worker to stop in-flight cache writes before purging browser caches. */
async function clearCaches(worker: ServiceWorker | null | undefined) {
  if (worker) {
    await new Promise<void>((resolve, reject) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        channel.port1.close();
        if (event.data === "cleared") resolve();
        else reject(new Error("Cache purge failed."));
      };
      worker.postMessage("logout", [channel.port2]);
    });
  }
  if ("caches" in window)
    await Promise.all((await caches.keys()).map((key) => caches.delete(key)));
}

/** Clear account-related browser caches before an identity signs out. */
export async function clearPwaAccountCachesWorkflow() {
  const registration = await navigator.serviceWorker?.getRegistration();
  await clearCaches(
    navigator.serviceWorker?.controller ?? registration?.active,
  );
}
