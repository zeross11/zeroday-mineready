const CACHE = 'mineready-v9.3.1';
const CORE = [
  './','./index.html','./404.html','./styles.css','./hardening.css','./data.js','./views.js','./app.js','./hardening.js',
  './manifest.webmanifest','./assets/icon.svg','./assets/qr/ZMR-1042.png','./assets/qr/ZMR-1049.png',
  './assets/qr/ZMR-1056.png','./assets/qr/ZMR-1088.png','./health.json'
];
self.addEventListener('install', event => event.waitUntil(
  caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())
));
self.addEventListener('activate', event => event.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim())
));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => {
      const copy = response.clone(); caches.open(CACHE).then(cache => cache.put('./index.html', copy)); return response;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok && new URL(event.request.url).origin === self.location.origin) {
      const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy));
    }
    return response;
  })));
});
