// Only a public offline document is stored. Orders, memberships, account requests and payment callbacks stay on the network.
const scope = new URL(self.registration.scope);
const prefix = 'tawfeer-offline:' + scope.pathname + ':';
const cacheName = prefix + '0fc8152e5c25';
const offline = new URL('offline.html', scope).href;
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.add(new Request(offline, {cache: 'reload'}));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith(prefix) && k !== cacheName).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.mode !== 'navigate') return;
  const url = new URL(request.url);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  const path = url.pathname.slice(scope.pathname.length);
  if (path && path !== 'index.html' && !/^city-[a-z-]+\.html$/.test(path)) return;
  event.respondWith((async () => {
    try {
      return await fetch(request);
    } catch {
      const cache = await caches.open(cacheName);
      return await cache.match(offline) || new Response('توفير يحتاج إلى اتصال بالإنترنت. أعد تحميل الصفحة بعد الاتصال.', {
        status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store'}
      });
    }
  })());
});
