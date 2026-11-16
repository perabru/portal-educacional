// Ícones vetoriais desenhados em uma grade de 16 pixels, sem imagens externas.
const icons=new Map([
 ['🗄️','database'],['🧩','cpu'],['🔌','plug'],['⚡','bolt'],['📡','signal'],['🌐','network'],['🖥️','monitor'],
 ['📖','book'],['🎓','cap'],['📚','book'],['📘','book'],['📱','phone'],['📂','folder'],['📝','edit'],['🖨','printer'],
 ['🤖','robot'],['🐙','code'],['🌿','code'],['⌨️','code'],['🐬','database'],['⚙️','tools'],['📐','tools'],['🐍','code'],
 ['🚀','star'],['🎬','play'],['✅','check'],['☑','check'],['⚠️','alert'],['⚠','alert'],['▦','dashboard'],['▤','book'],
 ['▥','chart'],['♙','user'],['♛','cap'],['✦','star'],['✧','star'],['☰','menu'],['⌘','tools'],['▣','code'],['◷','clock']
]);
const pattern=new RegExp([...icons.keys()].sort((a,b)=>b.length-a.length).map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'gu');
function makeIcon(name){
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.setAttribute('class','pixel-icon');svg.setAttribute('viewBox','0 0 16 16');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
 const use=document.createElementNS('http://www.w3.org/2000/svg','use');use.setAttribute('href',`icons/pixel.svg#${name}`);svg.append(use);return svg;
}
function decorate(root){
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){
  if(!node.parentElement||node.parentElement.closest('script,style,svg,textarea,option,[data-native-symbol]'))continue;
  const value=node.nodeValue;pattern.lastIndex=0;if(!pattern.test(value))continue;pattern.lastIndex=0;
  const parts=document.createDocumentFragment();let cursor=0;
  for(const match of value.matchAll(pattern)){
   if(match.index>cursor)parts.append(document.createTextNode(value.slice(cursor,match.index)));
   parts.append(makeIcon(icons.get(match[0])));cursor=match.index+match[0].length;
  }
  if(cursor<value.length)parts.append(document.createTextNode(value.slice(cursor)));
  node.replaceWith(parts);
 }
}
export function initPixelUI(){
 decorate(document.body);
 const observer=new MutationObserver(changes=>{
  for(const change of changes){
   for(const node of change.addedNodes){
    if(node.nodeType===Node.ELEMENT_NODE&&!node.closest('svg,script,style'))decorate(node);
    else if(node.nodeType===Node.TEXT_NODE&&node.parentElement&&!node.parentElement.closest('svg,script,style'))decorate(node.parentElement);
   }
  }
 });
 observer.observe(document.body,{childList:true,subtree:true});
}
