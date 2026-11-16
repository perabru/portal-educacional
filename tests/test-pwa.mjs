import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const source=await readFile(new URL('../service-worker.js',import.meta.url),'utf8');
const origin='https://perabru.github.io';
const scope=origin+'/portal-educacional/';
const index=scope+'index.html';
const handlers=new Map(),storage=new Map();
let skipped=0,claimed=0,networkCalls=0;
const normalize=key=>typeof key==='string'?key:key.url;
const caches={
  async open(name){
    if(!storage.has(name))storage.set(name,new Map());
    const entries=storage.get(name);
    return {
      async addAll(requests){
        for(const request of requests){
          assert.equal(request.cache,'reload');
          entries.set(request.url,new Response('installed:'+request.url));
        }
      },
      async match(key){return entries.get(normalize(key))?.clone();},
      async put(key,value){entries.set(normalize(key),value.clone());}
    };
  },
  async keys(){return [...storage.keys()];},
  async delete(key){return storage.delete(key);}
};
vm.runInNewContext(source,{
  URL,Request,Response,caches,
  fetch:async request=>{networkCalls++;return new Response('network:'+request.url);},
  self:{
    registration:{scope},
    clients:{async claim(){claimed++;}},
    skipWaiting(){skipped++;},
    addEventListener(type,handler){handlers.set(type,handler);}
  }
});
async function lifecycle(type){let work;handlers.get(type)({waitUntil(promise){work=promise;}});await work;}
async function request(url,{method='GET',mode='cors'}={}){
  let result;
  handlers.get('fetch')({request:{url,method,mode},respondWith(value){result=value;}});
  return result?await result:null;
}

await lifecycle('install');
assert.equal(skipped,0,'An update must wait for the user before replacing an active shell');
const cacheName=[...storage.keys()][0];
assert(storage.get(cacheName).has(scope+'curriculo.json'),'The fallback curriculum must work offline');
storage.get(cacheName).set(index,new Response('current-index'));
storage.get(cacheName).set(scope+'app.js',new Response('current-js'));
storage.set('portal-educacional-v4-20261116',new Map([[index,new Response('legacy')]]));
storage.set('portal-educacional-v3-other-app',new Map([[origin+'/outro/index.html',new Response('other')]]));
storage.set('maximus-inic-v10',new Map([[origin+'/maximus-inic/index.html',new Response('inic')]]));
storage.set('portal-educacional-/another-portal/-v1',new Map());
await lifecycle('activate');
assert.equal(claimed,1);
assert(!storage.has('portal-educacional-v4-20261116'),'Only this app’s legacy cache should be migrated');
assert(storage.has('portal-educacional-v3-other-app'));
assert(storage.has('maximus-inic-v10'));
assert(storage.has('portal-educacional-/another-portal/-v1'));

assert.equal(await(await request(scope+'?utm_source=pwa',{mode:'navigate'})).text(),'current-index');
assert.equal(await(await request(index+'?refresh=1',{mode:'navigate'})).text(),'current-index');
assert.equal(await(await request(scope+'app.js?refresh=1')).text(),'current-js');
assert.equal(networkCalls,0,'A versioned shell must not mix cached JS with fresh HTML');
assert.equal(await request(origin+'/maximus-inic/',{mode:'navigate'}),null);
assert.equal(await request(origin+'/portal-educacional-evil/',{mode:'navigate'}),null);
assert.equal(await request(scope+'materiais/manual.pdf',{mode:'navigate'}),null);
assert.equal(await request('https://apptcc3j-default-rtdb.firebaseio.com/portalEducacionalV1.json'),null);
assert.equal(await request(scope+'app.js',{method:'POST'}),null);
assert.equal(await request(scope+'unknown.json'),null);
handlers.get('message')({data:{type:'OTHER'}});
assert.equal(skipped,0);
handlers.get('message')({data:{type:'SKIP_WAITING'}});
assert.equal(skipped,1);

console.log('PWA: atomic shell, scoped caches, offline curriculum, update consent and cross-app isolation passed.');
