const SHELL = "maximal-shell-v1";
const OFFLINE = "/offline";
const ICON = "/icons/192.png";
let cacheGeneration = 0;
let cacheEnabled = true;
const cacheWrites = new Set();

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL).then((cache) => cache.addAll([OFFLINE, ICON])),
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
  const generation = cacheGeneration;
  if (
    request.method !== "GET" ||
    new URL(request.url).origin !== self.location.origin
  )
    return;

  if (new URL(request.url).pathname.startsWith("/_next/static/")) {
    if (!cacheEnabled) return;
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ??
          fetch(request).then((response) => {
            const contentType = response.headers.get("content-type") ?? "";
            if (
              cacheEnabled &&
              generation === cacheGeneration &&
              response.ok &&
              !/html|rsc|json/i.test(contentType)
            ) {
              const copy = response.clone();
              const write = caches.open(SHELL).then((cache) => {
                if (generation === cacheGeneration)
                  return cache.put(request, copy);
              });
              cacheWrites.add(write);
              void write.finally(() => cacheWrites.delete(write));
              event.waitUntil(write);
            }
            return response;
          }),
      ),
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE)));
  }
});

self.addEventListener("message", (event) => {
  if (event.data !== "logout") return;
  cacheGeneration += 1;
  cacheEnabled = false;
  event.waitUntil(
    Promise.allSettled([...cacheWrites])
      .then(() => caches.keys())
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => event.ports[0]?.postMessage("cleared")),
  );
});
