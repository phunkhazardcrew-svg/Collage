// Offline-Unterstützung: App-Dateien werden beim Installieren zwischengespeichert.
// Bei Änderungen an der App VERSION erhöhen, damit Handys die neue Fassung laden.
const VERSION = 'foto-merge-v6';
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
];
const NET_TIMEOUT_MS = 4000;

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION)
      // cache: 'reload' = am HTTP-Cache vorbei, damit wirklich die neue Fassung gespeichert wird
      .then((c) => c.addAll(FILES.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Netzwerk zuerst (immer neueste Version), bei Offline oder sehr langsamem Netz: Zwischenspeicher.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  const fromCache = () => caches.match(req, { ignoreSearch: true })
    .then((hit) => hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined));
  const network = fetch(req, { cache: 'no-cache' }).then((res) => {
    if (res.ok) {
      const copy = res.clone();
      e.waitUntil(caches.open(VERSION).then((c) => c.put(req, copy)).catch(() => {}));
    }
    return res;
  });
  network.catch(() => {}); // Fehler wird unten behandelt
  const timeout = new Promise((resolve) => setTimeout(resolve, NET_TIMEOUT_MS)).then(fromCache);
  e.respondWith(
    Promise.race([network, timeout])
      .then((res) => res || network)
      .catch(() => fromCache().then((hit) => hit || Response.error())),
  );
});
