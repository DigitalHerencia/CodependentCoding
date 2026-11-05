"use client";

import { useClerkAccount } from "@/lib/auth/clerkAccount";
import { LogOut, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";

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

export function PwaAccountMenu() {
  const { openUserProfile, signOut } = useClerkAccount();
  const safeSignOut = async () => {
    const registration = await navigator.serviceWorker?.getRegistration();
    await clearCaches(
      navigator.serviceWorker?.controller ?? registration?.active,
    );
    await signOut({ redirectUrl: "/sign-in" });
  };
  return (
    <div className="flex items-center gap-2">
      <Button
        aria-label="Manage account"
        onClick={() => openUserProfile()}
        size="icon"
        variant="outline"
      >
        <UserRound aria-hidden="true" />
      </Button>
      <Button onClick={safeSignOut} size="sm" variant="ghost">
        <LogOut aria-hidden="true" /> Sign out
      </Button>
    </div>
  );
}
