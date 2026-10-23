/* 旅程手帖：只快取「網頁本身」，不含任何行程資料（行程資料仍需授權後由 GitHub 讀取，離線時使用本機快取）。 */
const CACHE='travel-shell-v1';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.add('./')).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;
 if(r.method!=='GET'||r.mode!=='navigate')return;
 e.respondWith((async()=>{
  const cache=await caches.open(CACHE),cached=await cache.match('./');
  const net=fetch(r).then(res=>{if(res.ok)cache.put('./',res.clone());return res});
  if(!cached)return net;
  const timeout=new Promise(ok=>setTimeout(()=>ok(null),4000));
  try{return (await Promise.race([net,timeout]))||cached}catch{return cached}
 })())
});
