// PandoraShield Local-First Offline Service Worker
const CACHE_NAME = 'pandorashield-pwa-v3'; // Bumped: force dark mode update
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './favicon.svg',
  './ort-wasm/ort-wasm-simd-threaded.jsep.wasm',
  './ort-wasm/ort-wasm-simd-threaded.wasm',
  './ort-wasm/ort-wasm-simd-threaded.jsep.mjs',
  './ort-wasm/ort-wasm-simd-threaded.mjs'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching offline assets');
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[SW] Pre-cache partial warning:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const isNavigation = event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html');

  if (isNavigation) {
    // Network-First for HTML so users always get the latest hashed assets
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            return cached || caches.match('./index.html');
          });
        })
    );
  } else {
    // Cache-First for static assets (images, js, css, wasm)
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Fetch fresh copy in background to update cache quietly (ignore 404s for old hashes)
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
              }
            })
            .catch(() => {});
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
            return networkResponse;
          })
          .catch(() => {
            // Nothing to do if offline and not in cache
          });
      })
    );
  }
});
