// Guarda la app en el móvil para que abra aunque no haya cobertura.
// Siempre intenta primero la versión más nueva de GitHub (sin caché del navegador).
const CACHE = 'tickets-v3-2';
const ARCHIVOS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './plantilla.xlsx', './pdfjs.js', './pdfjs.worker.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS.map(u => new Request(u, {cache: 'reload'}))))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request.url, {cache: 'no-cache'})
      .then(r => { if (r.redirected) r = new Response(r.body, {status: r.status, statusText: r.statusText, headers: r.headers});
        if (r.ok) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); } return r; })
      .catch(() => caches.match(e.request, {ignoreSearch: true}))
  );
});
