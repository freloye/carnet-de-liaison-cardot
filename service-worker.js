onst CACHE_NAME = "carnet-cardot-v0021";
const RESSOURCES = [
  "./",
  "./index.html",
  "./styles.css?v=0021",
  "./config.js?v=0021",
  "./app.js?v=0021",
  "./manifest.webmanifest?v=0021",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(RESSOURCES);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    Promise.all([
      caches.keys().then(function (noms) {
        return Promise.all(
          noms
            .filter(function (nom) { return nom !== CACHE_NAME; })
            .map(function (nom) { return caches.delete(nom); })
        );
      }),
      self.clients.claim()
    ])
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(event.request, { cache: "no-store" })
      .then(function (reponse) {
        if (reponse && reponse.ok) {
          const copie = reponse.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, copie);
          });
        }
        return reponse;
      })
      .catch(function () {
        return caches.match(event.request).then(function (reponse) {
          return reponse || caches.match("./index.html");
        });
      })
  );
});
