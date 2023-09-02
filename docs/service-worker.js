
(function(self){
  if (self.location.origin.split("/")[2] !== "alderhealycass.com") return;  
  
  const PRECACHE = 'precache-2343245';
  const RUNTIME = 'runtime-2343245';

  const PRECACHE_URLS = [
    'index.html',
    './',
    '/images/me.png',
    '/images/me@2x.png',
    '/images/me@3x.png',
    '/images/me.webp',
    '/images/me@2x.webp',
    '/images/me@3x.webp',
    '/images/me2.png',
    '/images/me2@2x.png',
    '/images/me2@3x.png',
    '/images/me2.webp',
    '/images/me2@2x.webp',
    '/images/me2@3x.webp'
  ];

  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(PRECACHE)
        .then(cache => cache.addAll(PRECACHE_URLS))
        .then(self.skipWaiting())
    );
  });

  self.addEventListener('activate', event => {
    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
      }).then(cachesToDelete => {
        return Promise.all(cachesToDelete.map(cacheToDelete => {
          return caches.delete(cacheToDelete);
        }));
      }).then(() => self.clients.claim())
    );
  });


  self.addEventListener('fetch', event => {
    if (event.request.url.startsWith(self.location.origin)) {
      event.respondWith(
        caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return caches.open(RUNTIME).then(cache => {
            return fetch(event.request).then(response => {
              return cache.put(event.request, response.clone()).then(() => {
                return response;
              });
            });
          });
        })
      );
    }
  });
})(self);
