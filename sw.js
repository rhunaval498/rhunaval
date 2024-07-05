const staticCacheName = 'site-static-v1';  // Increment version
const dynamicCacheName = 'site-dynamic-v1';   // Increment version
const assets = [
  '/',
  'index.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/logo.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  'pages/fallback.html'
];

// Install event
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log('Caching shell assets');
      cache.addAll(assets);
    })
  );
});

// Activate event
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
  // Force immediate reload of all tabs to ensure new service worker is activated
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      if (cacheRes) {
        // If request is found in cache, return it
        return cacheRes;
      } else {
        // If request is not found in cache, fetch from network
        return fetch(evt.request).then(fetchRes => {
          // Clone fetch response to cache
          return caches.open(dynamicCacheName).then(cache => {
            cache.put(evt.request.url, fetchRes.clone());
            return fetchRes;
          });
        }).catch(() => {
          // Handle fetch errors
          if (evt.request.url.endsWith('.html')) {
            // For HTML requests, return a fallback page
            return caches.match('pages/fallback.html');
          } else {
            // For other requests, return a default response
            return new Response('Oops! Something went wrong.', {
              status: 500,
              headers: { 'Content-Type': 'text/plain' }
            });
          }
        });
      }
    })
  );
});

// Force refresh when new service worker takes over
self.addEventListener('controllerchange', () => {
  window.location.reload();
});
