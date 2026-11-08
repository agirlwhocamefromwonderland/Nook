const V="nook-v1";
const CORE=["./","index.html","garden.html","reader.html","nest.html","manifest.webmanifest","icon.svg","icon-192.png","icon-512.png","icon-maskable-512.png","garden-icon.png","reader-icon.png","nest-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 const u=new URL(e.request.url);
 if(u.origin===location.origin){
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>{
   const net=fetch(e.request).then(res=>{if(res.ok)caches.open(V).then(c=>c.put(e.request,res.clone()));return res})
    .catch(()=>r||(e.request.mode==="navigate"?caches.match("index.html"):undefined));
   return r||net}));
 }else if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
  e.respondWith(caches.open(V).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(res=>{c.put(e.request,res.clone());return res}).catch(()=>r))));
 }
});
