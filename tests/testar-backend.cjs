// Testes isolados do contrato callable: Firebase/GitHub/Gemini substituídos por serviços controlados.
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.resolve(__dirname,'../functions/index.js'),'utf8');
const ROOT='portalEducacionalV1',uid='student_123',sid='delivery_123';
const admin={uid:'teacher_123',token:{email:'brunomichel00@gmail.com',email_verified:true}};
const sha='a'.repeat(40);
const packet=value=>({candidates:[{content:{parts:[{text:JSON.stringify(value)}]}}]});
const valid={notaSugerida:1.7,justificativa:'Implementação e evidências presentes.',criterios:[null,{criterio:'Código',explicacao:'README e app.js',pontos:1.7}],confianca:'media'};
function setup({geminiStatus=200,geminiData=packet(valid),secret='private-test-key',failure=false,existing=null}={}){
 const store=new Map([[`${ROOT}/submissoes/${uid}/${sid}`,{disciplina:'bd',tipo:'pratica',github:'https://github.com/teste/projeto',notaMax:1.8}]]);
 if(existing)store.set(`${ROOT}/iaSugestoes/${uid}/${sid}`,existing);
 const reads=[],requests=[],snapshot=value=>({exists:()=>value!=null,val:()=>value});
 const db={ref:p=>({get:async()=>{reads.push(p);return snapshot(store.get(p));},set:async value=>store.set(p,value),remove:async()=>store.delete(p),transaction:async fn=>{const value=fn(store.get(p)||null);if(value===undefined)return {committed:false};store.set(p,value);return {committed:true};}})};
 class HttpsError extends Error{constructor(code,message){super(message);this.code=code;}}
 const context={exports:{},URL,AbortSignal,console,require:name=>{
  if(name==='firebase-functions/v2/https')return {onCall:(_options,handler)=>handler,HttpsError};
  if(name==='firebase-functions/params')return {defineSecret:()=>({value:()=>secret})};
  if(name==='firebase-admin/app')return {initializeApp:()=>{}};
  if(name==='firebase-admin/database')return {getDatabase:()=>db};
  throw Error('Dependência inesperada '+name);
 },fetch:async(url,options)=>{
  requests.push({url,options});
  if(failure)throw Error('network');
  if(url.startsWith('https://generativelanguage.googleapis.com'))return {ok:geminiStatus===200,status:geminiStatus,json:async()=>geminiData};
  if(url==='https://api.github.com/repos/teste/projeto')return {ok:true,json:async()=>({default_branch:'main',private:false})};
  if(url.endsWith('/commits/main'))return {ok:true,json:async()=>({sha})};
  if(url.includes('/git/trees/'))return {ok:true,json:async()=>({tree:[{type:'blob',size:20,path:'.env'},{type:'blob',size:20,path:'README.md'},{type:'blob',size:20,path:'app.js'}]})};
  if(url.startsWith('https://raw.githubusercontent.com'))return {ok:true,text:async()=>url.endsWith('README.md')?'Projeto e instruções de teste.':'function main(){return true;}'};
  throw Error('URL inesperada '+url);
 }};
 vm.createContext(context);vm.runInContext(source+'\nexports.test={githubRepo,parseGemini,textAllowed};',context);
 return {handler:context.exports.corrigirEntregaGemini,helpers:context.exports.test,store,reads,requests};
}
let n=0;
async function check(name,fn){await fn();n++;console.log('OK '+name);}
(async()=>{
 await check('somente administrador verificado',async()=>{const s=setup();await assert.rejects(s.handler({auth:{uid,token:{email:'aluno@example.com',email_verified:true}},data:{uid,submissionId:sid}}),e=>e.code==='permission-denied');await assert.rejects(s.handler({auth:{...admin,token:{...admin.token,email_verified:false}},data:{uid,submissionId:sid}}),e=>e.code==='permission-denied');assert.equal(s.requests.length,0);});
 await check('identificadores não permitem caminhos',async()=>{const s=setup();await assert.rejects(s.handler({auth:admin,data:{uid:'../usuarios',submissionId:sid}}),e=>e.code==='invalid-argument');});
 await check('chave ausente falha antes de consultar serviços',async()=>{const s=setup({secret:''});await assert.rejects(s.handler({auth:admin,data:{uid,submissionId:sid}}),e=>e.code==='failed-precondition');assert.equal(s.requests.length,0);});
 await check('GitHub rejeita credenciais e endereços externos',async()=>{const {helpers}=setup();for(const url of ['https://evil.test/teste/projeto','https://secret@github.com/teste/projeto','https://github.com/teste/.git','http://github.com/teste/projeto'])assert.throws(()=>helpers.githubRepo(url),e=>e.code==='invalid-argument');assert.equal(helpers.githubRepo('https://github.com/teste/projeto.git').repo,'projeto');assert.equal(helpers.githubRepo('https://aluno.github.io/projeto').owner,'aluno');assert.equal(helpers.githubRepo('https://aluno.github.io/projeto/').repo,'projeto');assert.equal(helpers.githubRepo('https://www.github.com/teste/projeto').repo,'projeto');assert.throws(()=>helpers.githubRepo('https://aluno.github.io/'),e=>e.code==='invalid-argument');assert.equal(helpers.textAllowed('.env'),false);assert.equal(helpers.textAllowed('src/app.js'),true);});
 await check('nota nula e avaliação sem justificativa são recusadas',async()=>{const {helpers}=setup();for(const data of [{notaSugerida:null,justificativa:'Não'}, {notaSugerida:1},null])assert.throws(()=>helpers.parseGemini(packet(data),2),e=>e.code==='unavailable');assert.equal(helpers.parseGemini(packet({...valid,notaSugerida:8}),2).notaSugerida,2);assert.equal(helpers.parseGemini(packet(valid),2).criterios.length,1);});
 await check('análise respeita snapshot, versão de código e revisão docente',async()=>{const s=setup();const result=await s.handler({auth:admin,data:{uid,submissionId:sid}});assert.equal(result.ok,true);const draft=s.store.get(`${ROOT}/iaSugestoes/${uid}/${sid}`);assert.equal(draft.maximo,1.8);assert.equal(draft.commit,sha);assert.equal(draft.publicada,false);assert.equal(s.store.has(`${ROOT}/avaliacoes/${uid}/${sid}`),false);assert.equal(s.store.has(`${ROOT}/iaAnalisesEmCurso/${uid}/${sid}`),false);const raw=s.requests.filter(x=>x.url.startsWith('https://raw.githubusercontent.com'));assert.equal(raw.length,2);assert(raw.every(x=>x.url.includes('/'+sha+'/')));assert(!s.requests.some(x=>x.url.endsWith('/.env')));});
 await check('cooldown evita repetição e libera trava',async()=>{const s=setup({existing:{geradoEm:Date.now()}});await assert.rejects(s.handler({auth:admin,data:{uid,submissionId:sid}}),e=>e.code==='resource-exhausted');assert.equal(s.requests.length,0);assert.equal(s.store.has(`${ROOT}/iaAnalisesEmCurso/${uid}/${sid}`),false);});
 await check('solicitação concorrente é recusada',async()=>{const s=setup();s.store.set(`${ROOT}/iaAnalisesEmCurso/${uid}/${sid}`,{iniciadoEm:Date.now()});await assert.rejects(s.handler({auth:admin,data:{uid,submissionId:sid}}),e=>e.code==='resource-exhausted');assert.equal(s.requests.length,0);});
 await check('falha no GitHub informa indisponibilidade e libera trava',async()=>{const s=setup({failure:true});await assert.rejects(s.handler({auth:admin,data:{uid,submissionId:sid}}),e=>e.code==='unavailable');assert.equal(s.store.has(`${ROOT}/iaAnalisesEmCurso/${uid}/${sid}`),false);});
 await check('cota Gemini não publica avaliação',async()=>{const s=setup({geminiStatus:429});await assert.rejects(s.handler({auth:admin,data:{uid,submissionId:sid}}),e=>e.code==='resource-exhausted');assert.equal(s.store.has(`${ROOT}/iaSugestoes/${uid}/${sid}`),false);assert.equal(s.store.has(`${ROOT}/iaAnalisesEmCurso/${uid}/${sid}`),false);});
 await check('atividade de outra disciplina é recusada',async()=>{const s=setup();s.store.get(`${ROOT}/submissoes/${uid}/${sid}`).atividadeId='activity_123';s.store.set(`${ROOT}/atividades/activity_123`,{disciplina:'redes',tipo:'pratica',notaMax:2});await assert.rejects(s.handler({auth:admin,data:{uid,submissionId:sid}}),e=>e.code==='failed-precondition');assert.equal(s.requests.length,0);});
 console.log(`${n} testes de backend passaram.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
