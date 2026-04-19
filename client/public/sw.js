const CACHE = 'cc-rewards-v1';
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

  // Never cache API calls — always hit network, fall through to cached
  // card data only if network fails so the stamp card still opens offline.
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
        .catch(() => caches.match(request))
    );
    return;
  }

  // Navigation requests: network first, fall back to cache, then shell
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((resp) => {
          const clone = resp.clone();
          caches.open(CACHE).then((c) => c.put(request, clone)).catch(() => {});
          return resp;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('/')))
    );
    return;
  }

  // Static assets: stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((resp) => {
          const clone = resp.clone();
          caches.open(CACHE).then((c) => c.put(request, clone)).catch(() => {});
          return resp;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
