import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

const original=await readFile(new URL('../app.js',import.meta.url),'utf8');
const source=original.replace(/^import[^\n]*\n/gm,'').replace(/\nstart\(\);\s*$/,'');
const curriculum=JSON.parse(await readFile(new URL('../curriculo.json',import.meta.url),'utf8'));
const custom={id:'curso_personalizado',nome:'Oficina <Web>',ano:'1º ano',instituicao:'UNIVAP',origem:'Professor',semanas:[
 {n:2,bimestre:1,tema:'HTML & segurança',personalizado:true,exercicios:['<img src=x onerror="alert(1)">','Calcule 2 < 3 & comprove.']},
 {n:4,bimestre:2,tema:'Entrega personalizada',personalizado:true,exercicios:['Primeira etapa.','Segunda etapa.','Terceira etapa.','Quarta etapa.']},
 {n:5,bimestre:3,tema:'Síntese',personalizado:true,exercicios:['Explique sua conclusão.']},
 {n:7,bimestre:3,tema:'Revisão sem tarefa',sem_tema:true}
]};
const subjects=[...curriculum,custom];
let exportedBlob=null;
class RuntimeURL extends URL {}
RuntimeURL.createObjectURL=blob=>{exportedBlob=blob;return 'blob:exercise-test'};
RuntimeURL.revokeObjectURL=()=>{};
const elements=new Map();
const element=selector=>{if(!elements.has(selector))elements.set(selector,{textContent:'',classList:{add(){},remove(){}},style:{}});return elements.get(selector)};
const context=vm.createContext({console,URL:RuntimeURL,Blob,Date,Promise,setTimeout:()=>1,clearTimeout(){},document:{querySelector:element,createElement:()=>({click(){}})},window:{scrollTo(){}},location:{href:'https://perabru.github.io/portal-educacional/',pathname:'/portal-educacional/',search:'',hash:'#/home'},localStorage:{getItem:()=>null,setItem(){}},navigator:{},__subjects:subjects});
vm.runInContext(source+"\nsubjects=__subjects;subjectById=Object.fromEntries(subjects.map(s=>[s.id,s]));user={uid:'exercise-test'};management={active:()=>true,owner:()=>true,mine:()=>subjects,renderPosted:()=>''};",context);
const run=code=>vm.runInContext(code,context);
const plain=value=>JSON.parse(JSON.stringify(value));
const orderedLists=html=>[...html.matchAll(/<ol\b([^>]*)>([\s\S]*?)<\/ol>/gi)].filter(match=>/numbered-exercises/.test(match[1])).map(match=>[...match[2].matchAll(/<li\b([^>]*)>([\s\S]*?)<\/li>/gi)].map(item=>({number:Number(item[1].match(/data-exercise-number=["'](\d+)["']/)?.[1]),body:item[2]})));
const visibleText=html=>html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();

// The existing point scales are part of the assessment contract.
for(const course of subjects){
 context.course=course;
 assert.deepEqual(plain(run('rubric(course.id,2).map(row=>row[1])')),[0.4,0.4,0.4,0.4,0.4]);
 const expected=course.id==='maximus_tca'?[2,3,3,2]:course.id==='maximus_tcc'?[3,3,2,2]:[4,3,2,1];
 assert.deepEqual(plain(run('rubric(course.id,10).map(row=>row[1])')),expected);
}

function assertNumbered(html,counts,prefix='Exercício'){
 const lists=orderedLists(html);
 assert.deepEqual(lists.map(items=>items.length),counts,'Each rendered lesson/task must retain the expected exercise count.');
 for(const list of lists)list.forEach((item,index)=>{
  assert.equal(item.number,index+1,'Visible list order must restart at 1 for each activity.');
  const label=item.body.match(/<h5\b[^>]*class="[^"]*exercise-label[^"]*"[^>]*>([\s\S]*?)<\/h5>/i);
  assert(label,'Every item needs a readable exercise or project-step label.');
  assert.equal(visibleText(label[1]),prefix+' '+(index+1));
  assert.match(item.body,/class="[^"]*exercise-action/,'The instruction must have a distinct readable body.');
 });
 return lists;
}

for(const course of subjects){
 context.course=course;
 const weeks=course.semanas.filter(week=>!week.sem_tema);
 const counts=weeks.map(week=>week.exercicios?.length||3);
 for(const week of course.semanas){
  context.week=week;
  const weekly=run('weekCard(course,week)');
  if(week.sem_tema){assert.deepEqual(orderedLists(weekly),[],'Review-only weeks must not invent exercises.');continue;}
  const count=week.exercicios?.length||3;
  assertNumbered(weekly,[count]);
  assert.equal((weekly.match(/type="checkbox"/g)||[]).length,count,'Weekly completion controls must match the actual exercise count.');
  assert.match(weekly,new RegExp(`data-submit="${course.id}:semanal:${week.n}"`),'A lesson must submit for its own course and week.');
  assert.match(weekly,/um único link/,'The delivery instructions must tell students what to send.');
 }
 const practical=run("taskCard(course,'pratica')"),project=run("taskCard(course,'projeto')");
 assertNumbered(practical,[5]);assertNumbered(project,[4],'Etapa');
 assert.equal((practical.match(/class="exercise-points"/g)||[]).length,5,'Every practice exercise must show its point value.');
 assert.equal((practical.match(/0,4 ponto/g)||[]).length,6,'The introduction and all five exercises retain the 0.4 point scale.');
 assert.match(practical,/Total<\/strong><\/td><td><strong>2,0 pontos/);assert.match(project,/Total<\/strong><\/td><td><strong>10,0 pontos/);
 assert.match(practical,new RegExp(`data-submit="${course.id}:pratica:1"`));assert.match(project,new RegExp(`data-submit="${course.id}:projeto:1"`));
 const workbook=run('renderApostila(course.id)'),exported=run('buildApostilaHTML(course)');
 assertNumbered(workbook,counts);assertNumbered(exported,counts);
 assert.doesNotMatch(workbook,/<input\b/i,'The workbook should contain instructions rather than unsaved completion controls.');
 assert.doesNotMatch(exported,/<(?:input|button)\b/i,'The downloadable workbook must remain usable as a standalone printable document.');
 assert.match(exported,/GitHub/);assert.match(exported,/envie o link pelo portal/);
 assert.doesNotMatch(exported,/Consulte o exemplo/i,'Exports must not promise an example they do not contain.');
}

context.course=custom;context.week=custom.semanas[0];
for(const rendered of [run('weekCard(course,week)'),run('renderApostila(course.id)'),run('buildApostilaHTML(course)')]){
 assert.match(rendered,/&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt;/,'Teacher-entered exercise text must be escaped exactly once.');
 assert.match(rendered,/2 &lt; 3 &amp; comprove/);
 assert.doesNotMatch(rendered,/<img\b|<Web>|&amp;lt;img/i,'Exercise text must never become markup or visibly double-escaped entities.');
}
context.week=custom.semanas[2];
const singular=run('weeklyExerciseBlock(course,week)');
assert.match(singular,/1 exercício<\/span>/);assert.match(singular,/Faça o exercício indicado/);assert.doesNotMatch(singular,/Exercício 1 a Exercício 1/);
const cleaned=run("numberedExerciseList(['1. Construa uma tabela.','Exercício 9 — Valide a consulta.'])");
const cleanedItems=assertNumbered(cleaned,[2]);
assert.match(cleanedItems[0][0].body,/>Construa uma tabela\.</);assert.match(cleanedItems[0][1].body,/>Valide a consulta\.</);
assert.doesNotMatch(cleaned,/>1\. Construa|>Exercício 9/i,'Imported numbering must not compete with the new visible sequence.');
run('createApostila(course.id)');
assert(exportedBlob instanceof Blob,'The download must use the verified workbook content.');
assert.equal(await exportedBlob.text(),run('buildApostilaHTML(course)'));
console.log('Exercícios: numeração, enunciados, quantidades, apostilas, exportação e pontuação: OK');
