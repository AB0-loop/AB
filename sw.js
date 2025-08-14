const CACHE_NAME = 'aurum-bespoke-v1';
const urlsToCache = [
  '/',
  '/book/',
  '/assets/logos/aurum-logo.jpg',
  '/assets/logos/icons/logo-512.png',
  '/assets/logos/icons/logo-192.png',
  '/assets/logos/icons/logo-180.png',
  '/assets/logos/icons/favicon.ico',
  '/css/styles.css',
  '/js/script.js',
  '/manifest.webmanifest'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});