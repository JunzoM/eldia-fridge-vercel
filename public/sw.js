var CACHE = "eldia-fridge-v9";
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

  var req = e.request;
  var isNav = req.mode === "navigate" || req.destination === "document";

  if(isNav){
    // HTMLはネットワークファースト（最新を常時取得、オフライン時のみキャッシュ）
    e.respondWith(
      fetch(req).then(function(res){
        var rc = res.clone();
        caches.open(CACHE).then(function(c){ c.put(req, rc); });
        return res;
      }).catch(function(){
        return caches.match(req).then(function(r){ return r || caches.match("/"); });
      })
    );
    return;
  }

  // 静的アセットはキャッシュファースト
  e.respondWith(caches.match(req).then(function(r) {
    return r || fetch(req).then(function(res) {
      var rc = res.clone();
      caches.open(CACHE).then(function(c) { c.put(req, rc); });
      return res;
    }).catch(function() { return caches.match("/"); });
  }));
});
