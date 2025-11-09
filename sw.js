const CACHE = 'franko-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './i18n.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/avatar-placeholder.png',
  './assets/slide-1.png',
  './assets/slide-2.png',
  './assets/slide-3.png',
  './assets/travel.png',
  './assets/fitness.png',
  './assets/wood.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.map((k) => (k === CACHE ? null : caches.delete(k))))
      )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then(
        (resp) =>
          resp || fetch(event.request).catch(() => caches.match('./index.html'))
      )
  );
});
