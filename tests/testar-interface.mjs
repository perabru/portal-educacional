import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

process.env.TZ='America/Sao_Paulo';
const load=async name=>import('data:text/javascript;base64,'+Buffer.from(await readFile(new URL('../'+name,import.meta.url),'utf8')).toString('base64'));
const {createManagement}=await load('management.js');
const {renderStudentGradeDashboard}=await load('notas.js');
const root='portalEducacionalV1/';
const base=[{id:'bd',nome:'Banco de Dados',sigla:'BD',ano:'2º ano',instituicao:'UNIVAP',semanas:[]}];
const original=()=>structuredClone(base);
let subjects=original(),user={uid:'aluno',email:'aluno@example.com',emailVerified:true},reads=[],writes=[],pendingProfile=null,capturedBlob=null,pendingSave=null;
const db={
 [root+'disciplinas']:{novo:{id:'novo',nome:'Nova disciplina',ano:'1º ano',instituicao:'UNIVAP',semanas:[],isExtra:true}},
 [root+'atividades']:{at1:{titulo:'Entrega SQL',disciplina:'bd',tipo:'pratica',notaMax:2,publicada:true,prazo:Date.parse('2026-11-16T12:30:00Z')}},
 [root+'usuarios']:{a:{nome:'=Alice',email:'a@example.com',turma:'A',ano:'2º ano',status:'ativo'},b:{nome:'Bob',email:'b@example.com',turma:'B',ano:'2º ano',status:'ativo'}},
 [root+'submissoes']:{a:{s1:{disciplina:'bd',tipo:'pratica',atividadeId:'at1',github:'https://github.com/a/sql',criadoEm:100}},b:{s2:{disciplina:'bd',tipo:'pratica',atividadeId:'at1',github:'https://github.com/b/sql',criadoEm:101}}}
};
const F={ref:(_,p)=>p,get:async p=>{reads.push(p);if(pendingProfile&&p===root+'usuarios/aluno')return new Promise(resolve=>{pendingProfile.resolve=resolve});return {val:()=>structuredClone(db[p]??null)}},update:async(p,value)=>{writes.push({p,value});db[p]={...(db[p]||{}),...value};if(p===root+'atividades/at1')db[root+'atividades'].at1={...db[root+'atividades'].at1,...value}},set:async(p,value)=>{writes.push({p,value});db[p]=value;if(pendingSave&&p===root+'usuarios/aluno')return new Promise((resolve,reject)=>{pendingSave.resolve=resolve;pendingSave.reject=reject})}};
const nodes=new Map();
const node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',value:'',focus(){},setSelectionRange(){}});return nodes.get(id)};
globalThis.document={getElementById:node,createElement:()=>({click(){}})};
globalThis.confirm=()=>true;
const realCreate=URL.createObjectURL,realRevoke=URL.revokeObjectURL;
URL.createObjectURL=blob=>{capturedBlob=blob;return 'blob:regression'};URL.revokeObjectURL=()=>{};
const management=createManagement({user:()=>user,db:()=>db,F:()=>F,subjects:()=>subjects,setSubjects:v=>subjects=v,toast(){},render:async()=>{},signOut:async()=>{user=null},showModal(){},setSubmissionActivity(){}});
const click=dataset=>management.handleClick({target:{closest:()=>({dataset})}});

await management.init(user);
assert(subjects.some(c=>c.id==='novo'),'New students must see newly created subjects before approval.');
assert(!reads.includes(root+'atividades'),'Unapproved students must not request protected activities.');
assert.match(management.renderGate(),/data-signout/,'Registration must expose logout.');
management.reset();
assert.equal(management.profile(),null);assert.deepEqual(subjects,base,'Logout must restore the original catalog.');

pendingProfile={};
const staleInit=management.init(user);
management.reset();
pendingProfile.resolve({val:()=>({status:'ativo',nome:'Aluno antigo'})});pendingProfile=null;
await staleInit;
assert.equal(management.profile(),null,'A late profile request must not restore a signed-out profile.');

// Saving a profile may finish after logout or after another student signs in.
const NativeFormData=globalThis.FormData;
globalThis.FormData=class {constructor(form){this.values=new Map(form.fields)}entries(){return this.values.entries()}get(key){return this.values.get(key)}};
for(const interruption of ['reset','new-user'])for(const fails of [false,true]){
 user={uid:'aluno',email:'aluno@example.com',emailVerified:true};
 await management.init(user);
 pendingSave={};
 const form={id:'student-profile-form',fields:[['nome','Aluno anterior'],['ano','2º ano'],['turma','A'],['mat-bd','bd']]};
 const saving=management.handleSubmit({target:form,preventDefault(){}});
 assert.equal(typeof pendingSave.resolve,'function');
 management.reset();
 if(interruption==='new-user'){
  user={uid:'novo-aluno',email:'outro@example.com',emailVerified:true};
  db[root+'usuarios/novo-aluno']={nome:'Outro aluno',status:'ativo',materias:{bd:true},instituicao:'UNIVAP'};
  await management.init(user);
 }
 const target=management.profile();
 const lookup=document.getElementById;
 document.getElementById=id=>id==='profile-msg'?null:lookup(id);
 if(fails)pendingSave.reject(Error('Falha de uma sessão anterior'));else pendingSave.resolve();
 pendingSave=null;
 await saving;
 document.getElementById=lookup;
 assert.equal(management.profile(),target,'A late profile save must not replace the profile after '+interruption+' ('+(fails?'error':'success')+').');
}
globalThis.FormData=NativeFormData;

user={uid:'admin',email:'brunomichel00@gmail.com',emailVerified:true};
await management.init(user);await management.renderAdmin();
await click({editActivity:'at1'});
assert.match(node('view').innerHTML,/value="2026-11-16T09:30"/,'Editing a deadline must retain local wall time.');
await click({adminTab:'deliveries'});
management.handleInput({target:{id:'filter-class',value:'B',selectionStart:1}});
assert.match(node('view').innerHTML,/Bob/);assert.doesNotMatch(node('view').innerHTML,/=Alice/,'Typing a class must immediately filter the visible deliveries.');
await click({export:''});
assert.match(await capturedBlob.text(),/Bob/);assert.doesNotMatch(await capturedBlob.text(),/=Alice/,'Export must match active filters.');
management.handleInput({target:{id:'filter-class',value:'',selectionStart:0}});
await click({export:''});
assert.match(await capturedBlob.text(),/"'=Alice"/,'Student-controlled CSV cells must not execute spreadsheet formulas.');
await click({deleteActivity:'at1'});
assert.deepEqual(writes.at(-1).value.publicada,false);assert.equal(writes.at(-1).value.ativo,false);
await management.renderAdmin();
assert.equal(management.getPost('at1').notaMax,2,'Removing an activity must preserve historic grading metadata.');
assert.equal(management.postedList().length,0,'Removed activities must no longer accept new submissions.');
await click({aiGrade:'a|s1'});
assert.equal(management.hasError(),false,'A failed correction service must not lock the administrator out of their profile.');

const html=renderStudentGradeDashboard({subjects:base,submissions:{bad:{disciplina:'bd',tipo:'projeto'},zero:{disciplina:'bd',tipo:'pratica',github:'https://aluno.github.io/projeto/',notaMax:2,atividadeTitulo:'Título original'},other:{disciplina:'bd',tipo:'pratica',notaMax:2,atividadeId:'editada'}},grades:{bad:{nota:null},zero:{nota:0},other:{nota:1.5}},posts:{editada:{notaMax:1,titulo:'Renomeada'}}});
assert.match(html,/Corrigidas: <b>2<\/b>/);assert.match(html,/Aguardando: <b>1<\/b>/,'A missing grade must remain pending, including null scores.');
assert.match(html,/https:\/\/aluno.github.io\/projeto\//,'Accepted GitHub Pages submissions must keep their links.');
assert.match(html,/1,5 \/ 2,0/,'Historic score limits must use the submission snapshot.');
assert.match(html,/Título original/);
for(const invalid of ['https://user:password@github.com/aluno/projeto','https://github.com:444/aluno/projeto','https://evil.github.com/aluno/projeto','https://github.com.evil.example/aluno/projeto']){
 const markup=renderStudentGradeDashboard({submissions:{bad:{disciplina:'bd',tipo:'pratica',github:invalid}}});
 assert.doesNotMatch(markup,/Ver GitHub/,'Unsafe or unsupported hosts must not become grade-table links: '+invalid);
}

URL.createObjectURL=realCreate;URL.revokeObjectURL=realRevoke;
console.log('Interface: matrícula, sessão, filtros, prazos, histórico, CSV e notas: OK');
