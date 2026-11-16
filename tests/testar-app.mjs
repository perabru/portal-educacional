import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

const original=await readFile(new URL('../app.js',import.meta.url),'utf8');
const source=original.replace(/^import[^\n]*\n/gm,'').replace(/\nstart\(\);\s*$/,'');
const student={uid:'student-one',email:'student@example.com',displayName:'Aluno',emailVerified:true};
const allowed=[{id:'redes',nome:'Redes',semanas:[{n:3,tema:'Endereçamento',bimestre:1}]}];

function harness(){
 const elements=new Map(),signoutNodes=[];
 function make(selector){const classes=new Set();return {selector,innerHTML:'',textContent:'',value:'',disabled:false,open:false,style:{},dataset:{},attributes:{},classList:{add(...list){list.forEach(x=>classes.add(x))},remove(...list){list.forEach(x=>classes.delete(x))},contains:x=>classes.has(x),toggle(x,force){const wanted=force??!classes.has(x);wanted?classes.add(x):classes.delete(x);return wanted}},setAttribute(k,v){this.attributes[k]=v},focus(){this.focused=true},replaceChildren(){this.innerHTML=''},reset(){this.wasReset=true},close(){this.open=false;this.wasClosed=true},showModal(){this.open=true},addEventListener(){}}}
 const element=selector=>{if(!elements.has(selector))elements.set(selector,make(selector));return elements.get(selector)};
 for(const id of ['#logout-btn','#logout-top-btn'])signoutNodes.push(element(id));
 const body=make('body');
 const document={body,querySelector:element,querySelectorAll:s=>s==='[data-signout]'?signoutNodes:[],createElement:()=>make('created')};
 let resets=0;const historyCalls=[];
 const management={active:()=>true,owner:()=>false,mine:()=>allowed,profile:()=>({nome:'Aluno'}),getPost:()=>null,activityChoices:()=>'',reset:()=>resets++};
 const context=vm.createContext({console:{warn(){},error(){},log(){}},document,URL,Blob,Promise,Date,setTimeout:()=>1,clearTimeout(){},window:{scrollTo(){}},history:{replaceState:(...args)=>historyCalls.push(args)},location:{pathname:'/portal-educacional/',search:'?mode=test',hash:'#/notes'},localStorage:{getItem:()=>null,setItem(){}},navigator:{},renderStudentGradeDashboard:()=>'<h1>BOLETIM PRIVADO</h1>',__seed:{user:student,management,subjects:allowed,F:{signOut:async()=>{}},auth:{}}});
 vm.runInContext(source+'\nuser=__seed.user;management=__seed.management;subjects=__seed.subjects;subjectById=Object.fromEntries(subjects.map(s=>[s.id,s]));F=__seed.F;auth=__seed.auth;db={};',context);
 const run=code=>vm.runInContext(code,context);
 return {context,element,run,historyCalls,get resets(){return resets}};
}

{
 const h=harness();h.element('#view').innerHTML='DADOS PRIVADOS';h.element('#submit-modal').open=true;h.element('#sidebar').classList.add('open');h.element('#login-screen').classList.add('is-hidden');
 await h.run('logout()');
 assert.equal(h.run('user'),null);assert.equal(h.element('#view').innerHTML,'');assert.equal(h.element('#submit-modal').open,false);assert.equal(h.element('#sidebar').classList.contains('open'),false);
 assert.equal(h.element('#menu-toggle').attributes['aria-expanded'],'false');assert.equal(h.element('#app-shell').classList.contains('is-hidden'),true);assert.equal(h.element('#login-screen').classList.contains('is-hidden'),false);
 assert.equal(h.element('#submit-form').wasReset,true);assert.equal(h.element('#login-btn').focused,true);assert(h.resets>0);assert.equal(h.historyCalls.at(-1)[2],'/portal-educacional/?mode=test#/home');
}
{
 const h=harness();h.element('#view').innerHTML='PAINEL';h.element('#submit-modal').open=true;h.element('#sidebar').classList.add('open');h.context.rejectSignout=async()=>{throw Object.assign(Error('network'),{code:'auth/network-request-failed'})};h.run('F.signOut=rejectSignout');
 await h.run('logout()');
 assert.equal(h.run('user.uid'),student.uid);assert.equal(h.element('#view').innerHTML,'PAINEL');assert.equal(h.element('#submit-modal').open,true);assert.equal(h.element('#sidebar').classList.contains('open'),true);assert.equal(h.resets,0);assert.equal(h.element('#logout-top-btn').disabled,false);
}
{
 const h=harness();h.run("showModal('bd:pratica:1')");assert.equal(h.element('#sub-course').value,'redes','A student must receive an enrolled course even when a legacy shortcut requests BD.');assert.equal(h.element('#sub-week').value,'3');assert.equal(h.element('#submit-modal').open,true);
 const good=['https://github.com/user/repo','https://www.github.com/user/repo','https://student.github.io/project/'];
 const bad=['javascript:alert(1)','http://github.com/user/repo','https://github.com.evil.example/user/repo','https://github.com@evil.example/user/repo','https://user:password@github.com/user/repo','https://github.com:444/user/repo','https://github.com/login?return_to=https://evil.example','https://evil.github.io.evil.example/project'];
 for(const value of good){h.context.candidate=value;assert.equal(h.run('isGitHubUrl(candidate)'),true,value)}
 for(const value of bad){h.context.candidate=value;assert.equal(h.run('isGitHubUrl(candidate)'),false,value)}
}
for(const page of ['notes','submissions'])for(const interruption of ['route','logout','user'])for(const rejects of [false,true]){
 const h=harness(),requests=[];
 h.context.fetchRecord=p=>new Promise((resolve,reject)=>requests.push({p,resolve,reject}));
 h.run(`currentPage='${page}';F.ref=(_,p)=>p;F.get=fetchRecord;`);
 const task=h.run(page==='notes'?'renderNotes(true)':'renderSubmissions()');
 assert(requests.length>0);
 if(interruption==='logout')await h.run('logout()');
 else if(interruption==='user')h.run("user={uid:'student-two',email:'other@example.com'};sessionVersion++;renderVersion++;");
 else h.run("currentPage='home';renderVersion++;location.hash='#/home';");
 h.element('#view').innerHTML='VIEW AFTER INTERRUPTION';
 for(const r of requests)rejects?r.reject(Error('old request failed')):r.resolve({val:()=>({})});
 await task;
 assert.equal(h.element('#view').innerHTML,'VIEW AFTER INTERRUPTION',`${page}: a ${rejects?'failed':'successful'} late response after ${interruption} must never replace the new view.`);
 assert.equal(h.run('gradeSnapshot'),null,`${page}: late responses must not restore another session's grade cache.`);
}
console.log('App: logout, falhas de saída, troca de página, respostas atrasadas, matrícula e links: OK');
