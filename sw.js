const CACHE_NAME='echo-below-story-vault-pacing-v13';

self.addEventListener('install',event=>{
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate',event=>{
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    try{
      const fresh=await fetch(event.request);
      if(fresh.ok&&new URL(event.request.url).origin===self.location.origin)cache.put(event.request,fresh.clone());
      return fresh;
    }catch(error){
      const cached=await cache.match(event.request);
      if(cached)return cached;
      throw error;
    }
  })());
});
