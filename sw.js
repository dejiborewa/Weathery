let CACHE_NAME = "site-cache";
let urlsToCache = ["/index.html", "/style.css", "/index.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          //  Cached response
          return response;
        }
        return fetch(event.request).then((response) => {
          // New Network request

          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          /* clone the response. A response is a stream
                        and because we want the browser to consume the response 
                        as well as the cache consuming the response, we need 
                        to clone it so we have two streams */
          let responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
  );
});

self.addEventListener("activate", (event) => {
  let cacheKeepList = ["site-cache"];

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (cacheKeepList.indexOf(key) === -1) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
