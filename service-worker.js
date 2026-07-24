const CACHE_NAME = "carnet-cardot-v0017";
const RESSOURCES = [
  "./",
  "./index.html",
  "./styles.css?v=0017",
  "./config.js?v=0017",
  "./app.js?v=0017",
  "./manifest.webmanifest?v=0017",
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
    caches.keys().then(function (noms) {
      return Promise.all(
        noms
          .filter(function (nom) { return nom !== CACHE_NAME; })
          .map(function (nom) { return caches.delete(nom); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(function (reponse) {
        const copie = reponse.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, copie);
        });
        return reponse;
      })
      .catch(function () {
        return caches.match(event.request).then(function (reponse) {
          return reponse || caches.match("./index.html");
        });
      })
  );
});
