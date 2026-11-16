// O shell é instalado como uma única versão. Dados pessoais ficam no Firebase.
const VERSION='v9-20261116-pixel-sutil';
const SCOPE=new URL(self.registration.scope);
const CACHE_PREFIX=`portal-educacional-${SCOPE.pathname}-`;
const CACHE_NAME=CACHE_PREFIX+VERSION;
const CORE=['./','./index.html','./styles.css','./pixel.css','./pixel-ui.js','./enrollment.js','./icons/pixel.svg','./fonts/pixelify-regular.woff2','./fonts/pixelify-bold.woff2','./app.js','./management.js','./notas.js','./curriculo.js','./curriculo.json','./favicon.svg','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
const CORE_URLS=new Set(CORE.map(path=>new URL(path,SCOPE).href));
const INDEX_URL=new URL('./index.html',SCOPE).href;

self.addEventListener('install',event=>{
  // Ignora o cache HTTP para não instalar código de duas publicações diferentes.
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(
    [...CORE_URLS].map(url=>new Request(url,{cache:'reload'}))
  )));
});

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING')self.skipWaiting();
});

self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key!==CACHE_NAME).map(async key=>{
    if(key.startsWith(CACHE_PREFIX)){await caches.delete(key);return;}
    // Migra somente o cache antigo que contém o índice deste aplicativo.
    if(/^portal-educacional-v\d/.test(key)){
      const cache=await caches.open(key);
      if(await cache.match(INDEX_URL))await caches.delete(key);
    }
  }));
  await self.clients.claim();
})()));

self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==SCOPE.origin||!url.pathname.startsWith(SCOPE.pathname))return;
  // Um link para outro aplicativo ou um PDF nunca substitui o nosso índice.
  const isShell=request.mode==='navigate'&&(url.pathname===SCOPE.pathname||url.pathname===new URL(INDEX_URL).pathname);
  const key=isShell?INDEX_URL:url.origin+url.pathname;
  if(!isShell&&!CORE_URLS.has(key))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    const saved=await cache.match(key);
    if(saved)return saved;
    // CacheStorage pode ter sido limpo pelo navegador após a instalação.
    const response=await fetch(request);
    if(response.ok&&!response.redirected)await cache.put(key,response.clone());
    return response;
  })());
});
