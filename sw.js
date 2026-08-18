/* Binder service worker: keeps the app shell available offline.
   Card data lives in IndexedDB (handled by the app), so this only caches
   the shell, card art from TCGdex, and the OCR library once loaded. */
const VERSION = 'binder-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
const IMAGE_CACHE = 'binder-images-v1';
const LIB_CACHE = 'binder-libs-v1';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => ![VERSION, IMAGE_CACHE, LIB_CACHE].includes(k)).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // App shell: network first so updates land, cache fallback offline
  if (url.origin === self.location.origin) {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return r; }).catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
    return;
  }
  // Card art and set symbols: cache first (they never change)
  if (url.hostname === 'assets.tcgdex.net') {
    e.respondWith(caches.open(IMAGE_CACHE).then(async c => { const hit = await c.match(req); if (hit) return hit; try { const r = await fetch(req); if (r.ok) c.put(req, r.clone()); return r; } catch { return hit || Response.error(); } }));
    return;
  }
  // OCR library and its language data: cache first once fetched
  if (/cdnjs\.cloudflare\.com|jsdelivr\.net|unpkg\.com|tessdata/.test(url.hostname + url.pathname)) {
    e.respondWith(caches.open(LIB_CACHE).then(async c => { const hit = await c.match(req); if (hit) return hit; const r = await fetch(req); if (r.ok) c.put(req, r.clone()); return r; }));
    return;
  }
  // API calls: network only (the app caches results in IndexedDB)
});
