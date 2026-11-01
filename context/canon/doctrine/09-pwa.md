---
title: Progressive Web App
slug: pwa
order: 9
summary: Installable without an app store. Manifest, a hand-written service worker, a minimal offline shell, logout hygiene, and push done safely.
rules: [CC-PWA-001, CC-PWA-002, CC-PWA-003, CC-PWA-004, CC-PWA-005]
---

# Progressive Web App

The goal is an app people install from the browser, so no Google Play or App Store review sits between an idea and its users.

## Manifest

```ts
// app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Acme Ops",
    short_name: "Acme",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      { src: "/icons/192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
```

Colors are the token values, written by the generator; the manifest cannot read CSS variables.

## Service worker

A plain, hand-written `public/sw.js`. No PWA plugin: less supply-chain surface, nothing to go stale. Registered once from a client island with `{ scope: "/", updateViaCache: "none" }`. Its headers are set in `next.config.ts` (Chapter 02): JavaScript content type, `no-cache, no-store, must-revalidate`, and its own `script-src 'self'` CSP.

```js
// public/sw.js
const SHELL = "shell-v1";
const OFFLINE = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((cache) => cache.addAll([OFFLINE, "/icons/192.png"])),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== SHELL).map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (
    request.method !== "GET" ||
    new URL(request.url).origin !== self.location.origin
  )
    return;

  // Immutable build assets: cache-first.
  if (request.url.includes("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ??
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(SHELL).then((cache) => cache.put(request, copy));
            return res;
          }),
      ),
    );
    return;
  }

  // Navigations: always network; offline page only when the network fails. Never cache HTML.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE)));
  }
});

self.addEventListener("message", (event) => {
  if (event.data === "logout")
    event.waitUntil(
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key)))),
    );
});
```

> **CC-PWA-001** · `now` · review
> The service worker never caches an HTML response, an API response, an RSC payload, or anything served to a signed-in user. It caches `/_next/static/*`, icons, and the offline page.
> HTML in a tenant app is personalized. A cached personalized page served offline to the next person on a shared device is a data leak with no server log.
> A site with no sign-in at all (a docs or marketing site) MAY precache its HTML, because no response is personalized.

> **CC-PWA-002** · `now` · review
> Signing out posts `"logout"` to the service worker and waits for cache deletion before redirecting.

> **CC-PWA-003** · `now` · review
> `app/(public)/offline/page.tsx` is static, has no data, and says what works offline (nothing but this page) and how to retry.

## Install

A small client island listens for `beforeinstallprompt` on Android/Chrome and offers an install button. iOS has no prompt: show "Share → Add to Home Screen" instructions when `navigator.standalone === false` on iOS Safari. On iOS, push works only after the app is added to the home screen.

> **CC-PWA-004** · `now` · review
> The install prompt is dismissible and remembered (local preference), never modal, never shown on the first visit.

## Push (optional module)

Not in the base template. When built:

- `web-push` with VAPID keys. The public key MAY use `NEXT_PUBLIC_`; the private key and contact address are server-only.
- `PushSubscription` table with RLS, owned by the user.
- Subscribe and unsubscribe are normal actions (authenticate → parse the subscription with Zod → write).
- Sending is background work (Chapter 08), never a client call. `410 Gone` deletes the subscription.

> **CC-PWA-005** · `now` · review
> No unauthenticated "send a test notification" endpoint, and no subscription held in a module variable — both appear in the reference example and neither is allowed.

Tagging: manifest, service worker, offline page and install prompt are **core**; push is an add-on module.
