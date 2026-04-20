const CACHE = 'cc-rewards-v2';
const SHELL = ['/', '/loyalty', '/menu', '/manifest.webmanifest', '/icon-192.svg', '/icon-512.svg', '/coffee.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Don't intercept cross-origin or Vite dev/HMR requests.
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/@') || url.pathname.startsWith('/src/') || url.pathname.includes('/node_modules/')) return;

  // API calls: network-first, cached loyalty card fallback only.
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((resp) => {
          if (url.pathname.startsWith('/api/loyalty/') && resp.ok) {
            const clone = resp.clone();
            caches.open(CACHE).then((c) => c.put(request, clone)).catch(() => {});
          }
          return resp;
        })
        .catch(async () => (await caches.match(request)) || Response.error())
    );
    return;
  }

  // Navigation: network-first, fall back to cache, then shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((resp) => {
          const clone = resp.clone();
          caches.open(CACHE).then((c) => c.put(request, clone)).catch(() => {});
          return resp;
        })
        .catch(async () =>
          (await caches.match(request)) ||
          (await caches.match('/')) ||
          Response.error()
        )
    );
    return;
  }

  // Static assets: stale-while-revalidate.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((resp) => {
          const clone = resp.clone();
          caches.open(CACHE).then((c) => c.put(request, clone)).catch(() => {});
          return resp;
        })
        .catch(() => cached || Response.error());
      return cached || network;
    })
  );
});
