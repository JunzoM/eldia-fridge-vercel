var CACHE = "eldia-fridge-v6";
var ASSETS = ["/"];

self.addEventListener("install", function(e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(ASSETS); }));
});

self.addEventListener("activate", function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }));
  self.clients.claim();
});

self.addEventListener("fetch", function(e) {
  // config.jsとsupabase通信はキャッシュしない
  if(e.request.url.includes("config.js") || e.request.url.includes("supabase.co")) return;
  e.respondWith(caches.match(e.request).then(function(r) {
    return r || fetch(e.request).then(function(res) {
      var rc = res.clone();
      caches.open(CACHE).then(function(c) { c.put(e.request, rc); });
      return res;
    }).catch(function() { return caches.match("/"); });
  }));
});
