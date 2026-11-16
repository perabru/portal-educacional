import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

process.env.TZ='America/Sao_Paulo';
const enrollmentURL='data:text/javascript;base64,'+Buffer.from(await readFile(new URL('../enrollment.js',import.meta.url),'utf8')).toString('base64');
const load=async name=>import('data:text/javascript;base64,'+Buffer.from((await readFile(new URL('../'+name,import.meta.url),'utf8')).replace("'./enrollment.js'",JSON.stringify(enrollmentURL))).toString('base64'));
const {courseMatchesEnrollment,yearMatches,courseClasses}=await import(enrollmentURL);
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
const F={ref:(_,p)=>p,get:async p=>{reads.push(p);if(pendingProfile&&p===root+'usuarios/aluno')return new Promise(resolve=>{pendingProfile.resolve=resolve});return {val:()=>structuredClone(db[p]??null)}},update:async(p,value)=>{writes.push({p,value});db[p]={...(db[p]||{}),...value};if(p===root+'atividades/at1')db[root+'atividades'].at1={...db[root+'atividades'].at1,...value}},set:async(p,value)=>{writes.push({p,value});db[p]=value;if(p.startsWith(root+'disciplinas/'))db[root+'disciplinas'][p.slice((root+'disciplinas/').length)]=value;if(pendingSave&&p===root+'usuarios/aluno')return new Promise((resolve,reject)=>{pendingSave.resolve=resolve;pendingSave.reject=reject})}};
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
assert.match(management.renderGate(),/id="profile-school"/,'School selection must be explicit.');
assert.doesNotMatch(management.renderGate(),/aprova/i,'Registration must not require teacher approval.');
management.reset();
assert.equal(management.profile(),null);assert.deepEqual(subjects,base,'Logout must restore the original catalog.');

pendingProfile={};
const staleInit=management.init(user);
management.reset();
pendingProfile.resolve({val:()=>({status:'ativo',nome:'Aluno antigo'})});pendingProfile=null;
await staleInit;
assert.equal(management.profile(),null,'A late profile request must not restore a signed-out profile.');

const enrollment={instituicao:'UNIVAP',ano:'2º ano',turma:'2IA'};
assert(courseMatchesEnrollment(base[0],enrollment));
assert(!courseMatchesEnrollment(base[0],{...enrollment,ano:'1º ano'}));
assert(!courseMatchesEnrollment(base[0],{...enrollment,instituicao:'MAXIMUS'}));
assert(courseMatchesEnrollment({...base[0],turmas:{'2IA':true}},enrollment));
assert(!courseMatchesEnrollment({...base[0],turmas:{'2IB':true}},enrollment));
assert(courseMatchesEnrollment({...base[0],turmas:{}},enrollment),'Empty class mappings must cover all classes of the selected year.');
assert(yearMatches('1º e 2º anos','1º ano'));assert(yearMatches('1º e 2º anos','2º ano'));assert(!yearMatches('1º e 2º anos','3º ano'));assert(yearMatches('Todos os anos','Outros'));
assert.deepEqual(courseClasses({turmas:' 2ia, 2IB;2ia'}),['2IA','2IB']);

db[root+'usuarios/aluno']={nome:'Aluno legado',email:user.email,instituicao:'UNIVAP',ano:'2º ano',turma:'2IA',materias:{bd:true},status:'pendente'};
await management.init(user);
assert.equal(management.profile().status,'ativo','Legacy pending profiles must activate without teacher approval.');
assert.equal(management.active(),true);assert.deepEqual(management.mine().map(c=>c.id),['bd']);
assert(reads.includes(root+'atividades'),'Automatic activation must load published activities.');
db[root+'usuarios/aluno'].status='removido';
await management.init(user);
assert.equal(management.active(),false);assert.match(management.renderGate(),/Acesso suspenso/);assert.doesNotMatch(management.renderGate(),/student-profile-form/,'Suspended students must remain blocked.');
const originalSet=F.set;
db[root+'usuarios/aluno']={nome:'Legado incompatível',email:user.email,instituicao:'UNIVAP',ano:'1º ano',turma:'1IA',materias:{bd:true},status:'pendente'};
F.set=async(path,value)=>{if(path===root+'usuarios/aluno')throw Error('PERMISSION_DENIED');return originalSet(path,value)};
const originalWarn=console.warn;console.warn=()=>{};
await management.init(user);
console.warn=originalWarn;F.set=originalSet;
assert.equal(management.hasError(),false,'A legacy membership mismatch must open the editable form rather than an access-error gate.');
assert.equal(management.active(),false);assert.match(management.renderGate(),/student-profile-form/);assert.doesNotMatch(management.renderGate(),/aprova/i);
delete db[root+'usuarios/aluno'];management.reset();

// Saving a profile may finish after logout or after another student signs in.
const NativeFormData=globalThis.FormData;
globalThis.FormData=class {constructor(form){this.values=new Map(form.fields)}entries(){return this.values.entries()}get(key){return this.values.get(key)}};
for(const interruption of ['reset','new-user'])for(const fails of [false,true]){
 user={uid:'aluno',email:'aluno@example.com',emailVerified:true};
 await management.init(user);
 pendingSave={};
 const form={id:'student-profile-form',fields:[['nome','Aluno anterior'],['instituicao','UNIVAP'],['ano','2º ano'],['turma','A'],['mat-bd','bd']]};
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
user={uid:'aluno',email:'aluno@example.com',emailVerified:true};delete db[root+'usuarios/aluno'];await management.init(user);
const registerForm={id:'student-profile-form',fields:[['nome','Novo aluno'],['instituicao','UNIVAP'],['ano','2º ano'],['turma','2ia'],['mat-bd','bd']]};
await management.handleSubmit({target:registerForm,preventDefault(){}});
assert.equal(management.profile().status,'ativo','The first registration must grant immediate access.');
assert.equal(management.profile().turma,'2IA');assert.equal(management.active(),true);assert.deepEqual(management.mine().map(c=>c.id),['bd']);assert.match(management.renderPosted(),/Atividades especiais/);
const viewBefore=node('view').innerHTML;
const changedForm={fields:[['nome','Texto preservado'],['instituicao','UNIVAP'],['ano','1º ano'],['turma','1IA']]};
await management.handleChange({target:{id:'profile-year',closest:()=>changedForm}});
assert.match(node('profile-courses').innerHTML,/Nova disciplina/);assert.doesNotMatch(node('profile-courses').innerHTML,/Banco de Dados/);assert.equal(node('view').innerHTML,viewBefore,'Changing enrollment filters must preserve the surrounding form inputs.');
const coursesBeforeBlur=node('profile-courses').innerHTML;
await management.handleChange({target:{id:'profile-class',closest(){throw Error('A class blur must not replace checkbox nodes.')}}});
assert.equal(node('profile-courses').innerHTML,coursesBeforeBlur,'Leaving the class field must preserve the checkbox being clicked.');

user={uid:'admin',email:'brunomichel00@gmail.com',emailVerified:true};await management.init(user);
const courseForm={id:'course-form',fields:[['nome','Pesquisa'],['sigla','PES'],['instituicao','MAXIMUS'],['ano','1º e 2º anos'],['turmas','1a, 2B'],['descricao','Pesquisa científica']]};
await management.handleSubmit({target:courseForm,preventDefault(){}});
const created=writes.findLast(x=>x.p.startsWith(root+'disciplinas/'));
assert.equal(created.value.instituicao,'MAXIMUS');assert.equal(created.value.ano,'1º e 2º anos');assert.deepEqual(created.value.turmas,{'1A':true,'2B':true},'Admin course creation must persist school/year/class mappings.');
const editForm={id:'course-edit-form',fields:[['id',created.value.id],['nome','Pesquisa'],['instituicao','UNIVAP'],['ano','3º ano'],['turmas','3c'],['descricao','Pesquisa atualizada']],querySelector:()=>null};
await management.handleSubmit({target:editForm,preventDefault(){}});
const edited=writes.findLast(x=>x.p===created.p);
assert.equal(edited.value.instituicao,'UNIVAP');assert.equal(edited.value.ano,'3º ano');assert.deepEqual(edited.value.turmas,{'3C':true},'Admin course editing must update enrollment mappings.');
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
