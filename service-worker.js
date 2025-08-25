const CACHE_NAME = 'madrasaty-v1';
const ASSETS = [
  '/', 'index.html', 'css/style.css',
  'js/app.js', 'js/ads.js',
  'manifest.json',
  'content/assets/icon-192.png', 'content/assets/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))
  ));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});