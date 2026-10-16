/* Offline support: network first, falling back to the saved copy.
   Only the Cache Storage copy of the game files lives here; the save (localStorage / IndexedDB) is never touched. */
const CACHE = 'pony-pals-v3.1';
const FILES = ['./', 'index.html', 'style.css?v=3.1', 'js/art.js?v=3.1', 'js/audio.js?v=3.1', 'js/more.js?v=3.1', 'js/more3.js?v=3.1', 'js/update.js?v=3.1', 'js/game.js?v=3.1', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
self.addEventListener('install', e => {
  // cache:'reload' skips the browser HTTP cache so a new worker always stores fresh files
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(f =>
    fetch(new Request(f === './' ? './?fresh=' + Date.now() : f, { cache: 'reload' })).then(r => { if (r.ok) return c.put(f, r); })
      .catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.endsWith('/version.json')) return; // always straight from the network
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: false }).then(m => m || caches.match('./'))));
});
