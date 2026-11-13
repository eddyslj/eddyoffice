/* Offline helper: keeps a copy of the app so it opens without internet.
   When online it always fetches the newest version first. */
const CACHE = 'doc-31a462efb0';
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k.split('-')[0] === CACHE.split('-')[0]).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  /* a file shared from another app (Android Share menu): keep it and open the app */
  if (req.method === 'POST' && new URL(req.url).pathname === new URL('share', self.registration.scope).pathname) {
    e.respondWith((async () => {
      try {
        const fd = await req.formData(); const f = fd.getAll('file').find((x) => x && typeof x === 'object' && x.size >= 0);
        if (f) {
          const c = await caches.open('eddy-inbox');
          await c.put(new URL('shared-file', self.registration.scope).href, new Response(f, { headers: { 'content-type': f.type || 'application/octet-stream', 'x-name': encodeURIComponent(f.name || 'shared-file') } }));
        }
      } catch (err) { console.error(err); }
      return Response.redirect(new URL('./?shared=1', self.registration.scope).href, 303);
    })());
    return;
  }
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('./')))
  );
});
