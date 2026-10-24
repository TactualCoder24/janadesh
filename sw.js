// Janadesh service worker: lets the site install and open without a connection. Written by build/make_dist.py (the build number below changes with every build).
const BUILD = '20261025021709', SHELL = 'janadesh-shell-' + BUILD, DATA = 'janadesh-data', LIBS = 'janadesh-libs';
const PRECACHE = ['./', 'manifest.webmanifest', 'logo/janadesh-icon-192.png', 'logo/janadesh-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(SHELL).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('janadesh-shell-') && k !== SHELL).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
async function networkFirst(req, cacheName){
  const cache = await caches.open(cacheName);
  try{ const r = await Promise.race([fetch(req), new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), 6000))]); if(r && r.ok) cache.put(req, r.clone()); return r; }
  catch(err){ const hit = await cache.match(req, {ignoreSearch: true}); if(hit) return hit; throw err; }
}
async function cacheFirst(req, cacheName){
  const cache = await caches.open(cacheName), hit = await cache.match(req); if(hit) return hit;
  const r = await fetch(req); if(r && r.ok) cache.put(req, r.clone()); return r;
}
async function staleWhileRevalidate(req, cacheName){
  const cache = await caches.open(cacheName), hit = await cache.match(req);
  const fresh = fetch(req).then(r => { if(r && (r.ok || r.type === 'opaque')) cache.put(req, r.clone()); return r; }).catch(() => null);
  return hit || (await fresh) || Response.error();
}
self.addEventListener('fetch', e => {
  const req = e.request; if(req.method !== 'GET') return;
  const url = new URL(req.url);
  if(url.origin === location.origin){
    if(req.mode === 'navigate') return e.respondWith(networkFirst(new Request('./'), SHELL));
    if(url.pathname.includes('/source/')) return e.respondWith(cacheFirst(req, DATA));           // the address carries the build number, so a cached file is never stale
    if(/\/(logo|manifest)/.test(url.pathname) || url.pathname.endsWith('/index.html')) return e.respondWith(networkFirst(req, SHELL));
    return;
  }
  if(/(cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(url.hostname)) return e.respondWith(staleWhileRevalidate(req, LIBS));
});
