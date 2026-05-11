var CACHE = "eldia-fridge-v10";
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
  var req = e.request;
  var url = req.url;

  // GET以外、http(s)以外のスキームは触らない（chrome-extension://等を除外）
  if(req.method !== "GET") return;
  if(!/^https?:/.test(url)) return;

  // config.jsとsupabase通信はキャッシュしない
  if(url.includes("config.js") || url.includes("supabase.co")) return;

  var isNav = req.mode === "navigate" || req.destination === "document";

  if(isNav){
    // HTMLはネットワークファースト（最新を常時取得、オフライン時のみキャッシュ）
    e.respondWith(
      fetch(req).then(function(res){
        var rc = res.clone();
        caches.open(CACHE).then(function(c){ c.put(req, rc).catch(function(){}); });
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
      caches.open(CACHE).then(function(c) { c.put(req, rc).catch(function(){}); });
      return res;
    }).catch(function() { return caches.match("/"); });
  }));
});
