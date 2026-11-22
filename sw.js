/* Good Boy Bobo — keeps a copy of the game's files on the phone so screens open instantly after the first visit.
   Pages (HTML) always check the network first so updates show up right away; art, sound and code files with a
   ?v= version are served from the copy (a new version has a new address); everything else is served from the
   copy and refreshed quietly in the background. Videos stream straight from the network. */
const C='gbb-v2';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==location.origin||r.headers.has('range')||/\.(mp4|mov|m4v)$/i.test(u.pathname))return;
 if(r.mode==='navigate'||/\.html?$/i.test(u.pathname)||u.pathname.endsWith('/')){
  e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r)));return}
 e.respondWith(caches.open(C).then(c=>c.match(r).then(hit=>{
  const net=fetch(r).then(res=>{if(res.ok&&res.type==='basic')c.put(r,res.clone());return res});
  if(hit){if(!u.search.includes('v='))net.catch(()=>{});return hit}
  return net})));
});
