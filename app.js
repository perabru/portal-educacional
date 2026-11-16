import { initPixelUI } from './pixel-ui.js?v=20261116.8';
import { loadCurriculum } from './curriculo.js?v=20261116.8';
import { createManagement } from './management.js?v=20261116.8';
import {renderStudentGradeDashboard} from './notas.js?v=20261116.8';

const FIREBASE_CONFIG = {
 apiKey:'AIzaSyA8wnEafMcts4vCesDTzf3dhB7Z8wliAsg', authDomain:'apptcc3j.firebaseapp.com',
 databaseURL:'https://apptcc3j-default-rtdb.firebaseio.com', projectId:'apptcc3j',
 storageBucket:'apptcc3j.firebasestorage.app', messagingSenderId:'787728618694',
 appId:'1:787728618694:web:5681bf84f6089b9d46f3c7'
};
const TEACHER_EMAIL='brunomichel00@gmail.com';
const MAXIMUS_INIC_URL='https://perabru.github.io/maximus-inic/';
const DB_ROOT='portalEducacionalV1';
const videoGit='https://www.youtube.com/playlist?list=PLHz_AreHm4dm7ZULPAmadvNhH6vk9oNZA';
const M={
 bd:{emoji:'🗄️',accent:'#69a4ff',video:'https://www.youtube.com/watch?v=Ofktsne-utM',videoLabel:'Curso MySQL #01 – Curso em Vídeo',pratica:[
 'Desenhe um modelo entidade-relacionamento de uma biblioteca com ao menos quatro entidades.',
 'Crie as tabelas no MySQL com chaves primárias e estrangeiras.',
 'Cadastre no mínimo cinco registros em cada tabela e execute SELECT com WHERE e ORDER BY.',
 'Faça uma consulta com JOIN e uma agregação com GROUP BY.',
 'Publique scripts .sql, diagrama e capturas de execução no GitHub.'],projeto:'Sistema de Gerenciamento de Biblioteca',brief:'Desenvolver um banco de dados relacional para livros, usuários, empréstimos e devoluções, com consultas e integridade referencial.',deliver:['Modelo conceitual, lógico e físico','Scripts de criação e carga de dados','Consultas com JOIN, agrupamento e filtros','README com instruções e capturas'],example:'Modele um cenário simples (aluno, livro, empréstimo), identifique suas entidades, campos e relacionamentos. Implemente uma pequena evidência de consulta SQL quando aplicável.'},
 cldi:{emoji:'🧩',accent:'#a69eff',video:'https://www.youtube.com/results?search_query=curso+logica+digital+portas+logicas',videoLabel:'Aulas de lógica digital (busca temática)',pratica:[
 'Converta números entre decimal, binário e hexadecimal e registre os cálculos.',
 'Desenhe portas AND, OR, NOT, NAND e NOR no simulador.',
 'Construa e teste uma tabela verdade de três entradas.',
 'Simplifique uma expressão booleana e compare circuitos equivalentes.',
 'Publique esquemas, tabelas e evidências de simulação no GitHub.'],projeto:'Fechadura Eletrônica com Portas Lógicas',brief:'Projetar uma lógica combinacional para liberar acesso com base em condições de entrada e validações de segurança.',deliver:['Tabela verdade completa','Expressão booleana simplificada','Circuito simulado e testado','README com imagens e explicação'],example:'Represente entradas A e B em uma tabela verdade, compare estados de saída e construa o circuito correspondente em um simulador.'},
 cldii:{emoji:'🔌',accent:'#68e4d1',video:'https://www.youtube.com/results?search_query=flip+flop+registradores+circuitos+digitais+aula',videoLabel:'Circuitos sequenciais (busca temática)',pratica:[
 'Simule um flip-flop RS e documente os estados válidos.',
 'Monte e compare flip-flops JK, D e T com clock.',
 'Represente uma sequência de pulsos em diagrama temporal.',
 'Simule contador assíncrono e registre sua sequência de estados.',
 'Organize arquivos e capturas dos circuitos no GitHub.'],projeto:'Contador Digital de Eventos',brief:'Desenvolver um circuito sequencial com clock, contagem, exibição de estados e condição de reinicialização.',deliver:['Diagrama do circuito','Explicação do clock e estados','Simulação com testes documentados','README com resultados'],example:'Compare o valor armazenado antes e depois de um pulso de clock, registrando uma tabela de transição de estados.'},
 eai:{emoji:'⚡',accent:'#ffbf6c',video:'https://www.youtube.com/results?search_query=eletronica+basica+lei+de+ohm+multimetro',videoLabel:'Eletrônica básica (busca temática)',pratica:[
 'Identifique resistores e seus valores a partir do código de cores.',
 'Calcule tensão, corrente e resistência utilizando a Lei de Ohm.',
 'Monte dois circuitos, um em série e outro em paralelo, no simulador.',
 'Meça grandezas com multímetro virtual e compare com valores teóricos.',
 'Registre cálculos, imagens da protoboard e conclusões no GitHub.'],projeto:'Sistema de Iluminação Inteligente',brief:'Construir ou simular circuito com sensor, alimentação e acionamento de LEDs, justificando a seleção de componentes.',deliver:['Esquema elétrico e lista de componentes','Cálculos de corrente e resistência','Simulação ou montagem segura','README com medições e testes'],example:'Em um circuito DC de 5 V, use R = 1 kΩ para estimar I = V/R = 5 mA. Compare o valor teórico com o simulador quando aplicável.'},
 ps:{emoji:'📡',accent:'#f5a3cb',video:'https://www.youtube.com/results?search_query=telecomunicacoes+sinais+modulacao+aula',videoLabel:'Telecomunicações e sinais (busca temática)',pratica:[
 'Desenhe um sinal senoidal indicando amplitude, período e frequência.',
 'Calcule frequência e comprimento de onda em três cenários.',
 'Compare meios guiados e não guiados de transmissão.',
 'Produza um gráfico ou simulação de atenuação e ruído.',
 'Documente fórmulas, gráficos e interpretação técnica no GitHub.'],projeto:'Analisador Didático de Sinais',brief:'Construir um painel ou simulação que represente uma forma de onda e demonstre frequência, amplitude, perdas ou interferências.',deliver:['Modelo matemático e justificativa','Gráficos e simulações','Comparação de dois meios de transmissão','README com análise dos resultados'],example:'Para um sinal senoidal de 1 kHz, calcule o período T = 1/f = 1 ms e represente pelo menos dois ciclos em um gráfico.'},
 redes:{emoji:'🌐',accent:'#6db1ff',video:'https://www.youtube.com/results?search_query=curso+redes+de+computadores+packet+tracer',videoLabel:'Curso de redes / Packet Tracer (busca temática)',pratica:[
 'Desenhe topologia com dois switches, um roteador e quatro computadores.',
 'Distribua endereços IPv4 válidos e registre uma tabela de IPs.',
 'Configure DHCP e teste obtenção automática de endereços.',
 'Habilite um serviço de rede (DNS, HTTP ou FTP) e teste conectividade.',
 'Publique o arquivo .pkt, evidências do ping e README no GitHub.'],projeto:'Rede Escolar Segura no Packet Tracer',brief:'Planejar e configurar topologia com segmentos, endereçamento, serviços e regras básicas de segurança para uma escola.',deliver:['Arquivo .pkt com topologia operacional','Plano de endereçamento IP e serviços','Testes de conectividade e segurança','README com desenhos e capturas'],example:'Monte duas estações e um switch no Packet Tracer. Atribua IPs da mesma rede e execute ping; documente a mudança no resultado ao corrigir uma configuração.'},
 sc:{emoji:'🖥️',accent:'#b4c1ff',video:'https://www.youtube.com/results?search_query=curso+em+video+linux+hardware+sistemas+operacionais',videoLabel:'Hardware, Linux e sistemas operacionais (busca temática)',pratica:[
 'Identifique componentes principais de um computador e suas funções.',
 'Converta números binários/hexadecimais e registre operações.',
 'Execute comandos básicos de Linux em máquina virtual ou laboratório.',
 'Documente processos, memória, sistema de arquivos e permissões.',
 'Publique scripts e um manual com capturas no GitHub.'],projeto:'Laboratório de Diagnóstico Computacional',brief:'Criar um guia ou ferramenta que colete e interprete informações de hardware, memória, armazenamento e processos do sistema.',deliver:['Relatório de arquitetura do computador','Comandos/scripts com resultados','Explicação de segurança e backups','README com testes reproduzíveis'],example:'Registre a configuração de CPU, memória e armazenamento de uma máquina. Relacione o comportamento observado ao tópico da semana.'},


  maximus_tca:{emoji:'📖',accent:'#79d2b9',video:'https://www.youtube.com/results?search_query=pesquisa+cientifica+projeto+escolar+metodologia',videoLabel:'Metodologia e pesquisa científica',pratica:['Defina o problema pesquisável.','Escreva justificativa e objetivos.','Planeje uma metodologia viável.','Organize referências confiáveis.','Registre cada etapa no Maximus INIC.'],projeto:'Trabalho de Conclusão de Ano',brief:'Construir investigação escolar com problema delimitado, metodologia, evidências, apresentação e acompanhamento no Maximus INIC.',deliver:['Tema e problema de pesquisa','Metodologia e cronograma','Evidências e discussão','Apresentação e documentação'],example:'Investigue um problema observável da comunidade escolar, descrevendo o recorte e a coleta de evidências.'},
  maximus_tcc:{emoji:'🎓',accent:'#d79fff',video:'https://www.youtube.com/results?search_query=como+fazer+TCC+introducao+metodologia+resultados',videoLabel:'TCC e pesquisa científica',pratica:['Revise tema e questão de pesquisa.','Justifique objetivos do projeto.','Descreva metodologia e cronograma.','Registre resultados sem inventar evidências.','Acompanhe o grupo no Maximus INIC.'],projeto:'Trabalho de Conclusão de Curso',brief:'Desenvolver TCC com orientação, metodologia, resultados e defesa, usando o aplicativo Maximus INIC para acompanhamento.',deliver:['Proposta e revisão bibliográfica','Metodologia e evidências','Resultados, discussão e conclusão','Documento final e apresentação'],example:'Descreva o problema real, relacione as evidências coletadas e justifique a solução apresentada.'},
};
const ORIGINALS={"bd": ["PLANEJAMENTO técnico_BANCO_DADOS_2023.xlsm", "Planejamento BANCO DE DADOS 23.pdf", "Planejamento_BANCO_DE_DADOS_23_assinado.pdf"], "cldi": ["PLANEJAMENTO técnico_CLDI_2023.xlsm", "Planejamento CLDI 23.pdf", "Planejamento_CLDI_23_assinado.pdf"], "cldii": ["PLANEJAMENTO técnico_CLDII_2023.xlsm", "Planejamento CLDII 23.pdf", "Planejamento_CLDII_23_assinado.pdf"], "eai": ["PLANEJAMENTO técnico_EAI_2023.xlsm", "Planejamento EAI 23.pdf", "Planejamento_EAI_23_assinado.pdf"], "ps": ["PLANEJAMENTO técnico_PS_2023.xlsm", "Planejamento PS 23.pdf", "Planejamento_PS_23_assinado.pdf"], "redes": ["PLANEJAMENTO técnico_redes 2023 - Copia.xlsm", "Planejamento REDES 23.pdf", "Planejamento_REDES_23_assinado.pdf"], "sc": ["PLANEJAMENTO técnico_sitema_computacional_2023 - Copia.xlsm", "Planejamento SC 23.pdf", "Planejamento_SC_23_assinado.pdf"]};
const TOOLS=[
 ['Android Studio','IDE oficial para desenvolvimento Android e Kotlin','https://developer.android.com/studio/','📱'],
 ['XAMPP','Ambiente local Apache, PHP e MariaDB','https://www.apachefriends.org/pt_br/download.html','🗄️'],
 ['Git','Controle de versões pelo terminal','https://git-scm.com/downloads','🌿'],
 ['GitHub Desktop','Controle de versões com interface gráfica','https://desktop.github.com/','🐙'],
 ['Visual Studio Code','Editor multiplataforma para programação','https://code.visualstudio.com/','⌨️'],
 ['MySQL Workbench','Modelagem e administração de bancos de dados','https://dev.mysql.com/downloads/workbench/','🐬'],
 ['Cisco Packet Tracer','Simulador de redes; requer conta no Cisco NetAcad','https://www.netacad.com/cisco-packet-tracer','🌐'],
 ['Tinkercad Circuits','Simulação online de circuitos e Arduino','https://www.tinkercad.com/circuits','🔌'],
 ['Arduino IDE','Programação e upload para placas Arduino','https://www.arduino.cc/en/software','⚙️'],
 ['diagrams.net','Diagramas UML, arquitetura e fluxogramas','https://app.diagrams.net/','📐'],
 ['Python','Linguagem e ambiente de desenvolvimento','https://www.python.org/downloads/','🐍'],
 ['VirtualBox','Virtualização para atividades de sistemas operacionais','https://www.virtualbox.org/wiki/Downloads','🖥️']
];
const EXTRAS=[
 ['SumoBotStudio','Laboratório de robôs sumô, futebol e desafios de lógica','https://perabru.github.io/SumoBotStudio/','🤖','PROJETO DO PROFESSOR'],
 ['Git e GitHub – Curso em Vídeo','Curso gratuito de versionamento, repositórios e colaboração','https://www.cursoemvideo.com/curso/curso-de-git-e-github/','🐙','DESTAQUE'],
 ['GitHub Skills: Introduction','Exercício prático oficial para criar branches e pull requests','https://github.com/skills/introduction-to-github','🌿','OFICIAL'],
 ['GitHub Skills: Git','Prática oficial de comandos, commits e histórico','https://github.com/skills/introduction-to-git','⌨️','OFICIAL'],
 ['GitHub Pages – Aprenda','Curso prático para publicação de sites estáticos','https://learn.github.com/learning/gitHubPages','🚀','OFICIAL'],
 ['Git e GitHub – Videoaulas','Playlist do Curso em Vídeo com Gustavo Guanabara',videoGit,'🎬','VIDEOAULAS'],
 ['MySQL – Curso em Vídeo','Curso introdutório sobre bases de dados relacionais','https://www.youtube.com/watch?v=Ofktsne-utM','🗄️','VIDEOAULA'],
 ['Drive de Pobre – catálogo externo','Catálogo solicitado pelo professor; disponibilidade e licenças não verificadas','https://drivedepobre.com/','📚','CATÁLOGO EXTERNO']
];
const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link=(u,label,cls='pill-link')=>{try{const url=new URL(String(u),'https://portal.invalid/');if(!['https:','http:'].includes(url.protocol)||url.username||url.password)return `<span>${esc(label)}</span>`;return `<a class="${esc(cls)}" href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`}catch{return `<span>${esc(label)}</span>`}};
let subjects=[],subjectById={},user=null,auth=null,db=null,F=null,management=null,currentPage='home',selectedBim=0,teacherRows=[],gradeFilter='todos',gradeSnapshot=null,callableAI=null;
const title=s=>`<div class="page-head"><div><div class="kicker">${esc(s.top||'PORTAL EDUCACIONAL')}</div><h1>${esc(s.h)}</h1><p>${esc(s.p||'')}</p></div>${s.actions||''}</div>`;
function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(window._toastT);window._toastT=setTimeout(()=>t.classList.remove('show'),4100)}
function nav(route){location.hash='#/'+route;closeMenu();}
function setConnection(s){$('#conn-state').textContent=s;$('.status-dot').style.background=s==='Conectado'?'#48d5a3':'#ffce70'}
function getSub(id){return subjectById[id]}
function courseCount(s){return s.semanas.filter(w=>!w.sem_tema).length}
function visibleSubjects(){return management?.active()&&!management.owner()?management.mine():subjects}
function metaFor(s){return M[s.id]||{emoji:'📚',accent:'#67b7e5',video:s.video||'https://www.youtube.com/results?search_query='+encodeURIComponent(s.nome+' aula'),videoLabel:'Pesquisar videoaulas',pratica:['Prepare uma explicação do tema estudado.','Demonstre um exemplo prático.','Documente o código, o processo e os testes.','Crie um tutorial para outro aluno.','Publique tudo no GitHub.'],projeto:'Projeto Integrador de '+s.nome,brief:'Construa um projeto demonstrativo que integre os conteúdos da disciplina.',deliver:['Funcionalidade reproduzível','Código e materiais no GitHub','README de documentação','Apresentação dos testes'],example:'Crie um protótipo, documente cada etapa e compartilhe com o professor via GitHub.'}}
function doneKey(id,n,i){return `portal-educacional-ex-${user?.uid||'anon'}-${id}-${n}-${i}`}
function doneCount(id){let n=0;const s=getSub(id); if(!s)return 0;for(const w of s.semanas.filter(w=>!w.sem_tema)){for(let i=0;i<weeklyExercises(s,w).length;i++)if(savedValue(doneKey(id,w.n,i))==='1')n++}return n}
function progress(s){return Math.round(doneCount(s.id)/Math.max(1,s.semanas.filter(w=>!w.sem_tema).reduce((n,w)=>n+weeklyExercises(s,w).length,0))*100)}
function schoolOf(s){return (s.instituicao||'UNIVAP').toUpperCase()==='MAXIMUS'?'MAXIMUS':'UNIVAP'}
function courseSections(){const entries=visibleSubjects();if(!entries.length)return empty('Seu catálogo está vazio','Atualize escola, ano, turma e disciplinas no seu perfil.');return `<div class="course-grid">${entries.map(courseCard).join('')}</div>`}
function maximusAppCard(s){if(!['maximus_tca','maximus_tcc'].includes(s.id))return '';return `<aside class="notice max-inic-card"><span>📱</span><div><strong>Aplicativo para TCA e TCC</strong><p>Use o Maximus INIC para acompanhar o grupo e escrever o trabalho. No celular, abra o link e escolha a opção de instalar o aplicativo no navegador.</p>${link(MAXIMUS_INIC_URL,'Abrir Maximus INIC','primary-btn')}</div></aside>`}
function courseCard(s){const m=metaFor(s);return `<article class="course-card" style="--accent:${m.accent}"><div class="course-card-top"><span class="course-icon" aria-hidden="true">${m.emoji}</span><small>${esc(s.ano||'Disciplina')}</small></div><h3>${esc(s.nome)}</h3><p>${esc(s.descricao||'')}</p><div class="tag-list"><span class="badge">${courseCount(s)} ${courseCount(s)===1?'semana':'semanas'}</span></div><div class="course-footer"><span>${progress(s)}% concluído</span><a href="#/course/${s.id}">Abrir disciplina</a></div></article>`}
function renderHome(){const items=visibleSubjects(),p=management?.profile();const classroom=!management?.owner()&&p?`<div class="enrollment-summary"><span class="profile-chip">${esc(p.instituicao==='MAXIMUS'?'Maximus':p.instituicao||'')}</span><span class="profile-chip">${esc(p.ano)}</span><span class="profile-chip">Turma ${esc(p.turma)}</span><button class="classroom-edit" data-go="profile">Editar cadastro</button></div>`:'';return `<section class="hero hero-simple"><div class="hero-copy"><div class="eyebrow">Portal Educacional</div><h1>Suas disciplinas</h1><p>Acesse materiais, envie atividades e acompanhe suas notas.</p>${classroom}<div class="hero-actions"><button class="primary-btn" data-go="courses">Disciplinas</button><button class="outline-btn" data-go="notes">Minhas notas</button></div></div></section><div class="stat-grid"><div class="stat"><span class="stat-icon">▦</span><div><strong>${items.length}</strong><small>Disciplinas</small></div></div><div class="stat"><span class="stat-icon">▤</span><div><strong>${items.reduce((n,c)=>n+c.semanas.length,0)}</strong><small>Semanas de aula</small></div></div></div><div class="section-heading"><h2>Disciplinas</h2></div>${courseSections()}`}
function renderCourses(){return `${title({top:'DISCIPLINAS',h:'Disciplinas',p:'Selecione uma disciplina para consultar aulas, atividades e projetos.'})}${courseSections()}`}
function renderCourse(id){const s=getSub(id);if(!s)return empty('Disciplina não encontrada','Confira o endereço e tente novamente.');const m=metaFor(getSub(id)||{id});return `<div class="course-banner"><span class="course-icon" style="background:${m.accent}23">${m.emoji}</span><div><div class="kicker">${esc(s.ano)}</div><h1>${esc(s.nome)}</h1><p>${esc(s.descricao)}</p></div></div><div class="page-actions"><button class="primary-btn" data-go="apostila/${id}">📚 Abrir apostila</button><button class="outline-btn" data-go="tasks/${id}">Lista prática e projeto</button></div>${maximusAppCard(s)}<div class="bim-tabs">${[0,1,2,3,4].map(b=>`<button data-bim="${b}" class="${selectedBim===b?'active':''}">${b===0?'Todas as semanas':b+'º bimestre'}</button>`).join('')}</div><div class="two-col"><section><div class="section-heading" style="margin-top:0"><h2>Trilha de aulas</h2><span class="badge blue">${s.semanas.length} ${s.semanas.length===1?'semana':'semanas'}</span></div><div class="week-list">${s.semanas.filter(w=>!selectedBim||w.bimestre===selectedBim).map(w=>weekCard(s,w)).join('')}</div></section><aside class="aside-stack"><div class="panel"><div class="kicker">AVALIAÇÃO</div><h3>Atividades da disciplina</h3><p>Lista prática: até <strong>2,0 pontos</strong>. Projeto da disciplina: nota de <strong>0 a 10</strong>.</p><button class="primary-btn full" data-go="tasks/${id}">Ver enunciados </button></div><div class="panel"><h3>Material de apoio</h3><p>Apostila digital completa e plano original fornecido pelo professor.</p><button class="outline-btn full" data-go="apostila/${id}">Ler apostila</button><div style="margin-top:9px">${sourceLink(s)}<div class="archive-links">${originalLinks(s)}</div></div></div><div class="panel"><h3>Curso em vídeo</h3><p>Videoaulas e buscas temáticas relacionadas à disciplina.</p>${link(m.video,m.videoLabel)}</div><div class="panel"><h3>Meu progresso</h3><p>${doneCount(id)} de ${s.semanas.filter(w=>!w.sem_tema).reduce((n,w)=>n+weeklyExercises(s,w).length,0)} exercícios marcados como concluídos neste aparelho.</p><div style="height:7px;border-radius:7px;background:var(--border);overflow:hidden"><div style="width:${progress(s)}%;height:100%;background:var(--blue)"></div></div><small class="muted">O progresso é local; a entrega oficial ocorre pelo GitHub.</small></div></aside></div>`}
function originalLinks(s){return (ORIGINALS[s.id]||[]).map(f=>link('materiais/planejamentos/'+encodeURIComponent(f),f.toLowerCase().endsWith('xlsm')?' Planilha Excel (XLSM)':f.includes('assinado')?' Planejamento assinado (PDF)':' Planejamento (PDF)')).join('')}
function renderMaterials(){return title({top:'ARQUIVO DO CURSO',h:'Planejamentos e documentos originais',p:'Todos os 21 arquivos presentes no ZIP enviado: planejamentos PDF, versões assinadas e planilhas XLSM.'})+`<div class="notice"><span>📂</span><div><strong>Material didático original</strong><p>Antes de habilitar macros de qualquer planilha XLSM, verifique sua procedência com o professor.</p></div></div>`+visibleSubjects().filter(s=>ORIGINALS[s.id]).map(s=>`<div class="panel" style="margin:14px 0"><h3>${esc(s.nome)}</h3><div class="archive-links">${originalLinks(s)}</div></div>`).join('')+``}
function sourceLink(s){if(!s?.planejamento)return '<span class="muted">Material editável pelo professor</span>';const a=`materiais/planejamentos/${encodeURIComponent(s.planejamento)}`;return link(a,' Baixar documento original')}
function weeklyTargets(s,w){return [`Compreender os conceitos e a terminologia de “${w.tema}”.`,`Relacionar o conteúdo às aplicações de ${s.nome}.`,`Produzir um registro prático e documentar o resultado no GitHub.`]}
function weeklyExercises(s,w){if(Array.isArray(w.exercicios)&&w.exercicios.length)return w.exercicios.map(String);const v=String(w.tema||'');switch(s.id){case 'bd':return [`Elabore um exemplo de dados ou tabelas que demonstre o tema: ${v}.`,'Construa um modelo, consulta ou script SQL relacionado ao conteúdo e comente as etapas.','Registre os testes e publique script/diagrama e README no GitHub.'];case 'cldi':return [`Desenhe uma representação lógica ou tabela verdade para: ${v}.`,'Simule pelo menos duas entradas diferentes e analise as saídas.','Documente equações, esquemas e evidências no GitHub.'];case 'cldii':return [`Represente os estados e transições envolvidos em: ${v}.`,'Monte ou simule um circuito sequencial demonstrativo, quando aplicável.','Registre diagrama temporal, capturas e conclusão no GitHub.'];case 'eai':return [`Identifique componentes e grandezas relevantes para: ${v}.`,'Calcule ou simule valores elétricos, informando unidades e medições.','Publique esquema, contas e relatório do experimento no GitHub.'];case 'ps':return [`Faça um esquema ou gráfico que represente: ${v}.`,'Resolva uma aplicação numérica ou compare dois cenários de transmissão.','Registre fórmulas, observações e resultados no GitHub.'];case 'redes':return [`Desenhe uma topologia ou situação real envolvendo: ${v}.`,'Configure ou simule um cenário no Packet Tracer quando aplicável.','Teste, capture as evidências e publique a documentação no GitHub.'];case 'sc':return [`Explique por meio de um diagrama o funcionamento de: ${v}.`,'Realize teste com comandos, máquina virtual ou representação técnica quando aplicável.','Publique capturas, código e análise no GitHub.'];default:return [`Escreva ou revise a parte da pesquisa referente a: ${v}.`,'Produza uma evidência objetiva, revisão ou diagrama pertinente à etapa.','Atualize o repositório do grupo com documentação e histórico dos commits.']}}
function content(s,w){const m=metaFor(s);return `<h4>Conteúdo da aula</h4><p>${esc(w.tema)}</p><h4>Referências</h4>${w.video?link(w.video,'Videoaula'):link(m.video,m.videoLabel)}${w.material?link(w.material,'Material da semana'):''}`}
function cleanExerciseText(text){
 return String(text??'').trim().replace(/^\s*(?:(?:exerc[ií]cio|quest[aã]o|etapa)\s*\d+\s*[).:\-–—]?\s+|\d+[).:\-–—]\s+)/i,'');
}
function numberedExerciseList(items,{prefix='Exercício',className='',subject=null,week=null,interactive=false,points=null}={}){
 return `<ol class="numbered-exercises ${className}" aria-label="${prefix==='Etapa'?'Etapas do projeto':'Exercícios a fazer'}">${items.map((text,i)=>{
  const checkId=subject&&week?`ch-${subject.id}-${week.n}-${i}`:'';
  return `<li data-exercise-number="${i+1}"><span class="exercise-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><div class="exercise-body"><div class="exercise-item-heading"><h5 class="exercise-label">${prefix} ${i+1}</h5>${points!==null?`<span class="exercise-points">${Number(points).toLocaleString('pt-BR',{maximumFractionDigits:2})} ponto</span>`:''}</div><p class="exercise-action">${esc(cleanExerciseText(text))}</p>${interactive?`<label class="exercise-check" for="${checkId}"><input type="checkbox" aria-label="Concluir o exercício ${i+1} da semana ${week.n}" data-check="${subject.id}:${week.n}:${i}" id="${checkId}" ${savedValue(doneKey(subject.id,week.n,i))==='1'?'checked':''}><span>Concluí este exercício</span></label>`:''}</div></li>`;
 }).join('')}</ol>`;
}
function exerciseDelivery(count,prefix='Exercício'){
 const range=count===1?`${prefix} 1`:`${prefix} 1 a ${prefix} ${count}`;
 return `<aside class="exercise-delivery"><strong>O que entregar</strong><p>Publique as respostas no GitHub, identificadas como <b>${range}</b>. Inclua os arquivos produzidos e as evidências pedidas. Depois envie <b>um único link</b> da atividade pelo portal.</p></aside>`;
}
function weeklyExerciseBlock(s,w,{interactive=false,buttons=false}={}){
 const questions=weeklyExercises(s,w),count=questions.length;
 return `<section class="exercise-block" aria-labelledby="exercises-${esc(s.id)}-${w.n}"><header class="exercise-heading"><div><span class="exercise-kicker">AGORA É SUA VEZ</span><h4 id="exercises-${esc(s.id)}-${w.n}">Exercícios da semana ${w.n}</h4></div><span class="exercise-count">${count} ${count===1?'exercício':'exercícios'}</span></header><p class="exercise-intro">Faça ${count===1?'o exercício indicado':'todos os exercícios numerados abaixo'}. Leia cada enunciado e registre sua resposta no repositório.</p>${numberedExerciseList(questions,{className:'exercise-list',subject:s,week:w,interactive})}${interactive?'<p class="exercise-helper">Marcar um exercício como concluído organiza seu estudo neste aparelho. Para entregar ao professor, envie o link abaixo.</p>':''}${exerciseDelivery(count)}${buttons?`<div class="week-actions"><button class="primary-btn" data-submit="${s.id}:semanal:${w.n}">Enviar exercícios da semana ${w.n}</button><button class="outline-btn" data-go="apostila/${s.id}">Abrir apostila</button></div>`:''}</section>`;
}
function weekCard(s,w){
 if(w.sem_tema)return `<article class="week-card"><div class="week-btn"><span class="week-num">S${String(w.n).padStart(2,'0')}</span><div><strong>Semana ${w.n}: revisão e orientação</strong><small>Sem tópico definido no planejamento original</small></div><span class="badge">REVISÃO</span></div></article>`;
 const count=weeklyExercises(s,w).length;
 return `<article class="week-card" id="week-${w.n}"><button class="week-btn" data-expand="${w.n}" aria-expanded="false" aria-controls="detail-${w.n}"><span class="week-num">S${String(w.n).padStart(2,'0')}</span><div style="flex:1"><strong>${esc(w.tema)}</strong><small>Semana ${w.n} · ${w.bimestre}º bimestre · ${count} ${count===1?'exercício':'exercícios'}</small></div><span class="week-open-label">Abrir aula</span></button><div class="week-detail is-hidden" id="detail-${w.n}"><div class="reading-content">${content(s,w)}</div>${weeklyExerciseBlock(s,w,{interactive:true,buttons:true})}</div></article>`;
}
function rubric(id,max){if(max===2)return [['Exercício 1',0.4],['Exercício 2',0.4],['Exercício 3',0.4],['Exercício 4',0.4],['Exercício 5 — Documentação e GitHub',0.4]];if(id==='maximus_tca')return [['Problema de pesquisa e justificativa',2],['Objetivos e metodologia',3],['Planejamento e evidências',3],['Referências e documentação',2]];if(id==='maximus_tcc')return [['Pesquisa e metodologia',3],['Resultados e evidências',3],['Documentação e referências',2],['Apresentação e defesa',2]];return [['Funcionalidade e execução',4],['Correção técnica',3],['Código, documentação e GitHub',2],['Apresentação e testes',1]]}
function rubricTable(id,max){return `<table class="rubric"><thead><tr><th>Critério</th><th>Valor máximo</th></tr></thead><tbody>${rubric(id,max).map(([q,n])=>`<tr><td>${esc(q)}</td><td>${n.toLocaleString('pt-BR',{minimumFractionDigits:1})}</td></tr>`).join('')}<tr><td><strong>Total</strong></td><td><strong>${max.toFixed(1).replace('.',',')} pontos</strong></td></tr></tbody></table>`}
function taskCard(s,kind){
 const m=metaFor(s),pr=kind==='pratica',max=pr?2:10,items=pr?m.pratica:m.deliver,prefix=pr?'Exercício':'Etapa';
 return `<article class="task-card"><div class="tag-list"><span class="badge ${pr?'green':'red'}">${pr?'LISTA PRÁTICA':'PROJETO'}</span><span class="badge">${pr?'Até 2,0 pontos':'Nota de 0 a 10'}</span></div><h3>${pr?'Lista prática: exercícios a fazer':esc(m.projeto)}</h3><p class="exercise-intro">${pr?'Resolva os cinco exercícios abaixo. Cada exercício vale até 0,4 ponto; a lista completa vale até 2,0 pontos.':esc(m.brief)}</p><section class="exercise-block"><div class="exercise-heading"><h4>${pr?'Faça estes exercícios':'O que desenvolver no projeto'}</h4><span class="exercise-count">${items.length} ${pr?'exercícios':'etapas'}</span></div>${numberedExerciseList(items,{prefix,className:pr?'task-step-list':'project-step-list',points:pr?0.4:null})}${exerciseDelivery(items.length,prefix)}</section><details class="assessment-details"><summary>Ver critérios de avaliação — até ${max.toLocaleString('pt-BR',{minimumFractionDigits:1})} pontos</summary>${rubricTable(s.id,max)}</details><div class="task-footer"><span class="badge blue">Entrega pelo GitHub</span><button class="primary-btn" data-submit="${s.id}:${kind}:1">${pr?'Enviar lista prática':'Enviar projeto'}</button></div></article>`;
}
function renderTasks(id){
 if(id&&!getSub(id))return empty('Disciplina não encontrada','Confira o endereço.');
 const items=id?[getSub(id)]:visibleSubjects();
 return `${title({top:'ATIVIDADES',h:id?getSub(id).nome:'Exercícios e projetos',p:'A lista prática vale até 2,0 pontos. O projeto da disciplina vale de 0 a 10.',actions:'<button class="outline-btn" data-go="guide">Como entregar no GitHub</button>'})}<aside class="notice"><span>☑</span><div><strong>Qual atividade devo fazer?</strong><p><b>Exercícios da semana:</b> abra a aula e faça a sequência numerada no final.</p><p><b>Lista prática e projeto:</b> siga as instruções dos cartões abaixo e envie cada atividade no botão correspondente.</p></div></aside>${management?.renderPosted(id)||''}${items.map(s=>`<div class="section-heading"><div><h2>${metaFor(s).emoji} ${esc(s.nome)}</h2><p>Confira os enunciados e os itens de entrega.</p></div><button class="outline-btn" data-go="course/${s.id}">Ver exercícios das aulas</button></div><div class="task-grid">${taskCard(s,'pratica')}${taskCard(s,'projeto')}</div>`).join('')}`;
}
function renderApostila(id){
 const s=getSub(id);if(!s)return empty('Apostila não encontrada','');const m=metaFor(s);
 return `${title({top:'BIBLIOTECA DIGITAL',h:'Apostila • '+s.nome,p:'Conteúdo das aulas e exercícios numerados ao final de cada semana.',actions:`<button class="primary-btn" data-download="${id}">Baixar apostila HTML</button><button class="outline-btn" data-print>Imprimir / PDF</button>`})}${[1,2,3,4].map(b=>`<section class="panel" style="margin:17px 0"><div class="kicker">CAPÍTULO ${b}</div><h2>${b}º bimestre</h2>${s.semanas.filter(w=>w.bimestre===b&&!w.sem_tema).map(w=>`<div class="reading-content workbook-week"><h3>Semana ${w.n}: ${esc(w.tema)}</h3>${content(s,w)}${weeklyExerciseBlock(s,w)}</div>`).join('')||'<p>Sem tema definido no planejamento fornecido.</p>'}</section>`).join('')}<div class="panel"><h3>Referências para aprofundamento</h3><p>${link(m.video,m.videoLabel)}${link('https://github.com/skills/introduction-to-github','GitHub Skills')}</p><p>Disciplina: ${esc(s.nome)}. Fonte do planejamento: ${esc(s.origem)}.</p></div>`;
}
function buildApostilaHTML(s){
 return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Apostila — ${esc(s.nome)}</title><style>body{font:16px/1.7 Arial,sans-serif;color:#18283c;max-width:850px;margin:40px auto;padding:0 24px}h1,h2,h3{color:#16467f;line-height:1.3}h1{font-size:30px}h2{border-bottom:2px solid #2862ac;padding-bottom:8px;margin-top:40px}h3{margin-top:28px}.exercise-block{border:1px solid #b5c9df;background:#f8fbff;padding:20px;margin:24px 0}.exercise-heading{display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap}.exercise-heading h4{font-size:20px;margin:4px 0}.exercise-kicker{font-size:11px;font-weight:bold;color:#4f6480}.exercise-count{font-size:13px}.numbered-exercises{list-style:none;padding:0;counter-reset:none}.numbered-exercises>li{display:flex;align-items:flex-start;gap:14px;border-top:1px solid #d0dce9;padding:16px 0;break-inside:avoid}.exercise-number{font-size:17px;font-weight:bold;color:#16467f;background:#e1edfa;padding:5px 9px;flex-shrink:0}.exercise-label{font-size:16px;margin:0 0 6px}.exercise-action{margin:0}.exercise-delivery{border-left:4px solid #2862ac;background:#edf4fd;padding:12px 16px;margin-top:16px}.exercise-delivery p{margin:4px 0}.workbook-week{padding-bottom:20px}@media print{body{margin:0;max-width:none}h2,h3,h4{break-after:avoid}.exercise-heading,.exercise-delivery{break-inside:avoid}.exercise-block{background:white;box-decoration-break:clone}}</style></head><body><h1>Apostila • ${esc(s.nome)}</h1><p>Portal Educacional — Prof. Bruno Michel Pera.</p><p>Identifique as respostas por semana e número do exercício. Ao concluir a atividade, publique os arquivos no GitHub e envie o link pelo portal.</p>${[1,2,3,4].map(b=>`<h2>${b}º bimestre</h2>`+s.semanas.filter(w=>w.bimestre===b&&!w.sem_tema).map(w=>`<section class="workbook-week"><h3>Semana ${w.n} — ${esc(w.tema)}</h3><p>Conteúdo da aula: ${esc(w.tema)}.</p>${weeklyExerciseBlock(s,w)}</section>`).join('')).join('')}<p>Fonte do planejamento: ${esc(s.origem)}.</p></body></html>`;
}
function createApostila(id){
 const s=getSub(id);if(!s)return;
 const a=document.createElement('a'),url=URL.createObjectURL(new Blob([buildApostilaHTML(s)],{type:'text/html;charset=utf-8'}));
 a.href=url;a.download=`Apostila_${id.toUpperCase()}.html`;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);
 toast('Apostila gerada com os exercícios numerados. Você pode imprimir em PDF.');
}
function renderExtras(){return `${title({top:'EXPLORE • LEARN • BUILD',h:'Cursos extras',p:'Cursos e materiais complementares.'})}<div class="notice"><span>🎮</span><div><strong>Desafio extra: SumoBotStudio</strong><p>Experimente o simulador de robôs criado pelo professor. Aplique lógica, sensores, programação e estratégia em desafios interativos.</p>${link('https://perabru.github.io/SumoBotStudio/','Acessar SumoBotStudio')}</div></div><div class="resource-grid">${EXTRAS.map(x=>`<article class="resource-card"><span class="resource-icon">${x[3]}</span><span class="badge blue">${esc(x[4])}</span><strong>${esc(x[0])}</strong><p>${esc(x[1])}</p>${link(x[2],'Acessar curso')}</article>`).join('')}</div><div class="notice"><span>ℹ️</span><div><strong>Catálogo Drive de Pobre</strong><p>O endereço solicitado está incluído como referência externa, mas não foi possível verificar os cursos específicos do catálogo. Para GitHub, priorizamos os cursos gratuitos e oficialmente acessíveis acima.</p></div></div>`}
function renderTools(){return `${title({top:'KIT DO DESENVOLVEDOR',h:'Downloads e ferramentas',p:'Instaladores, ambientes e serviços oficiais para os laboratórios das disciplinas.'})}<div class="resource-grid">${TOOLS.map(t=>`<article class="resource-card"><span class="resource-icon">${t[3]}</span><strong>${esc(t[0])}</strong><p>${esc(t[1])}</p>${link(t[2],'Abrir download oficial')}</article>`).join('')}</div><div class="notice"><span>🔐</span><div><strong>Instale com segurança</strong><p>Os botões levam aos sites oficiais; versões e licenças podem mudar. Use equipamentos autorizados e siga as orientações do laboratório.</p></div></div>`}
function renderGuide(){const steps=[['Crie uma conta e um repositório','Entre em github.com, crie um repositório público com nome da disciplina e ative um README.'],['Organize suas pastas','Use pastas como semana-01/, semana-02/, lista-pratica/ e projeto/. Inclua código-fonte, esquemas e imagens.'],['Faça commits frequentes','Cada avanço deve ter commit com mensagem explicativa; não envie somente um ZIP sem histórico.'],['Documente no README.md','Explique objetivo, tecnologias, instalação, como executar, testes e autores. Inclua capturas e resultados.'],['Copie o link do repositório','Exemplo: https://github.com/usuario/projeto-disciplina. Confira se o link abre sem pedir permissão.'],['Envie no portal','Clique em Enviar atividade, informe disciplina, tipo, semana (quando aplicável) e o endereço do GitHub.']];return `${title({top:'REGRAS DE ENTREGA',h:'Guia rápido do GitHub',p:'Todas as atividades devem estar publicadas e documentadas antes do envio.'})}<div class="two-col"><div><div class="guide-steps">${steps.map((x,i)=>`<div class="guide-step"><span>${String(i+1).padStart(2,'0')}</span><div><h3>${esc(x[0])}</h3><p>${esc(x[1])}</p></div></div>`).join('')}</div></div><aside class="aside-stack"><div class="panel"><h3>Checklist antes da entrega</h3><ul><li>Repositório público no GitHub</li><li>Código ou simulação executável</li><li>README com instruções e resultados</li><li>Capturas e evidências quando aplicável</li><li>Link testado em janela anônima</li><li>Disciplina e tarefa identificadas</li></ul><button class="primary-btn full" data-submit="bd:pratica:1">Enviar atividade</button></div><div class="panel"><h3>Aprenda Git e GitHub</h3>${link('https://www.cursoemvideo.com/curso/curso-de-git-e-github/','Curso gratuito – Curso em Vídeo')}${link('https://github.com/skills/introduction-to-github','GitHub Skills – Introdução')}${link(videoGit,'Videoaulas do curso')}</div></aside></div>`}
function empty(h,p){return `<div class="empty-state"><b>▤</b><h3>${esc(h)}</h3><p>${esc(p)}</p><button class="primary-btn" data-go="home">Voltar ao início</button></div>`}
function myDate(ts){if(!ts)return 'Data indisponível';return new Date(ts).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'})}
function submissionLabel(o){const s=getSub(o.disciplina);return o.atividadeTitulo||`${s?.nome||o.disciplina} · ${o.tipo==='pratica'?'Lista prática (até 2 pontos)':o.tipo==='projeto'?'Projeto (0–10)':`Semana ${o.semana}`}`}
function viewSubmission(uid,key,o,grade,teacher=false){grade=grade&&grade.nota!==null&&grade.nota!==''&&Number.isFinite(Number(grade.nota))?grade:null;const at=management?.getPost(o.atividadeId),max=Number(o.notaMax??at?.notaMax??(o.tipo==='pratica'?2:10));return `<div class="submission-row"><div style="min-width:0"><strong>${esc(submissionLabel(o))}</strong><small>${esc(o.nome||'Aluno')} · ${myDate(o.criadoEm)}</small><div>${link(o.github,'Ver repositório GitHub')}</div>${o.comentario?`<p style="font-size:12px;margin:8px 0">${esc(o.comentario)}</p>`:''}${grade?`<p style="font-size:12px;margin:5px 0">📝 <b>Professor:</b> ${esc(grade.comentario||'Avaliado')}</p>`:''}${teacher?`<div class="grade-area"><label>Nota <input type="number" min="0" max="${max}" step="0.1" id="nota-${key}" value="${grade?.nota??''}" aria-label="Nota"></label><textarea rows="1" id="feedback-${key}" placeholder="Feedback ao aluno">${esc(grade?.comentario||'')}</textarea><button class="primary-btn" data-grade="${uid}:${key}:${max}">Salvar</button></div>`:''}</div><div class="submission-meta">${grade?`<span class="badge green">${Number(grade.nota).toFixed(1).replace('.',',')} / ${max.toFixed(1).replace('.',',')}</span>`:'<span class="badge blue">Enviado</span>'}</div></div>`}

async function renderNotes(force=false){
 const view=$('#view'),uid=user?.uid,version=renderVersion,session=sessionVersion;
 const current=()=>user?.uid===uid&&renderVersion===version&&sessionVersion===session&&currentPage==='notes';
 view.innerHTML=title({top:'MINHAS NOTAS',h:'Consultando seu boletim',p:'Carregando notas e comentários...'});
 if(!db||!F||!uid)return;
 try{
  const [subs,notes,posted]=await Promise.all([F.get(F.ref(db,`${DB_ROOT}/submissoes/${uid}`)),F.get(F.ref(db,`${DB_ROOT}/avaliacoes/${uid}`)),F.get(F.ref(db,`${DB_ROOT}/atividades`))]);
  if(!current())return;
  gradeSnapshot={uid,submissions:subs.val()||{},grades:notes.val()||{},posts:posted.val()||{}};
  view.innerHTML=renderStudentGradeDashboard({subjects:visibleSubjects(),...gradeSnapshot,filter:gradeFilter,studentName:management.profile()?.nome||user.displayName||'Estudante'});
 }catch(e){if(current())view.innerHTML=empty('Notas indisponíveis','Não foi possível consultar suas notas. Tente novamente.');}
}
async function renderSubmissions(){
 const root=$('#view'),uid=user?.uid,version=renderVersion,session=sessionVersion;
 const current=()=>user?.uid===uid&&renderVersion===version&&sessionVersion===session&&currentPage==='submissions';
 const heading=()=>title({top:'MINHAS ENTREGAS',h:'Atividades enviadas',p:'Consulte seus envios e os comentários do professor.',actions:'<button class="primary-btn" data-submit="nova:pratica:1">Nova entrega</button>'});
 root.innerHTML=heading()+'<div class="loading-panel" role="status">Carregando entregas...</div>';
 if(!db||!F||!uid)return;
 try{
  const [ss,gg]=await Promise.all([F.get(F.ref(db,`${DB_ROOT}/submissoes/${uid}`)),F.get(F.ref(db,`${DB_ROOT}/avaliacoes/${uid}`))]);
  if(!current())return;
  const entries=Object.entries(ss.val()||{}).sort((a,b)=>(b[1].criadoEm||0)-(a[1].criadoEm||0)),grades=gg.val()||{};
  root.innerHTML=heading()+(entries.length?entries.map(([key,o])=>viewSubmission(uid,key,o,grades[key])).join(''):empty('Nenhuma atividade enviada','Envie o link do seu repositório GitHub.'));
 }catch(e){if(current())root.innerHTML=heading()+empty('Entregas indisponíveis','Confira sua conexão e tente novamente.');}
}
async function renderTeacher(){if(user?.email?.toLowerCase()!==TEACHER_EMAIL){$('#view').innerHTML=empty('Acesso restrito','Este painel é exclusivo do professor.');return}const root=$('#view');root.innerHTML=title({top:'ÁREA DO PROFESSOR',h:'Correção de atividades',p:'Confira os links enviados e atribua feedback e notas.'})+empty('Carregando registros...','');try{const [ss,gg]=await Promise.all([F.get(F.ref(db,`${DB_ROOT}/submissoes`)),F.get(F.ref(db,`${DB_ROOT}/avaliacoes`))]);const sub=ss.val()||{},notes=gg.val()||{};teacherRows=Object.entries(sub).flatMap(([uid,rows])=>Object.entries(rows||{}).map(([key,o])=>({uid,key,o,grade:notes?.[uid]?.[key]}))).sort((a,b)=>(b.o.criadoEm||0)-(a.o.criadoEm||0));root.innerHTML=title({top:'ÁREA DO PROFESSOR',h:'Correção de atividades',p:`${teacherRows.length} entrega(s) encontradas. O acesso depende das regras de segurança do Firebase.`})+`<div class="toolbar"><input class="search" id="teacher-search" placeholder="Buscar por nome, disciplina ou atividade..."><span class="badge blue">${teacherRows.length} entregas</span></div><div id="teacher-results">${teacherRows.length?teacherRows.map(x=>viewSubmission(x.uid,x.key,x.o,x.grade,true)).join(''):empty('Nenhuma atividade recebida','Os links dos alunos aparecerão aqui.')}</div>`}catch(e){root.innerHTML=title({h:'Painel do professor',p:'O Firebase precisa permitir leitura global de entregas para sua conta.'})+`<div class="notice"><span>⚠</span><div><strong>Não foi possível carregar o painel</strong><p>${esc(e.message)}. Mescle as regras de segurança em SETUP-FIREBASE.md.</p></div></div>`}}
async function saveGrade(code){const [uid,key,maxStr]=code.split(':'),max=Number(maxStr),n=Number($('#nota-'+key)?.value),feedback=$('#feedback-'+key)?.value.trim()||'';if(!Number.isFinite(n)||n<0||n>max||$('#nota-'+key).value.trim()===''){toast(`Informe uma nota entre 0 e ${max}.`);return}try{await F.set(F.ref(db,`${DB_ROOT}/avaliacoes/${uid}/${key}`),{nota:n,comentario:feedback,avaliadoEm:Date.now(),professor:user.email});toast('Nota e feedback salvos.');await renderTeacher()}catch(e){toast('Erro ao salvar nota: '+e.message)}}
function showModal(spec=''){
 if(!user||!management?.active())return;
 const [id,typ,week]=spec.split(':'),allowed=visibleSubjects(),s=allowed.find(x=>x.id===id)||allowed[0];
 if(!s){toast('Selecione uma disciplina no seu cadastro.');return}
 $('#sub-course').innerHTML=allowed.map(x=>`<option value="${esc(x.id)}">${esc(x.nome)}</option>`).join('');
 $('#sub-course').value=s.id;$('#sub-type').value=['semanal','pratica','projeto'].includes(typ)?typ:'pratica';
 fillWeeks(Number(week)||1);$('#sub-url').value='';$('#sub-note').value='';$('#form-message').textContent='';$('#submit-modal').showModal();
}
function fillWeeks(preselected=1){
 const s=getSub($('#sub-course').value);if(!s)return;
 const weeks=s.semanas.filter(w=>!w.sem_tema);
 $('#sub-week').innerHTML=weeks.map(w=>`<option value="${w.n}">Semana ${w.n}: ${esc(w.tema.slice(0,52))}</option>`).join('');
 $('#sub-week').value=String(weeks.some(w=>Number(w.n)===Number(preselected))?preselected:weeks[0]?.n||'');
 $('#week-wrap').classList.toggle('is-hidden',$('#sub-type').value!=='semanal');
 const posts=management?.activityChoices(s.id,$('#sub-type').value)||'';
 $('#sub-activity').innerHTML='<option value="">Lista/projeto fixo ou exercício da semana</option>'+posts;
 $('#sub-activity-wrap').classList.toggle('is-hidden',!posts);
}
function isGitHubUrl(value){
 try{const x=new URL(value);return x.protocol==='https:'&&!x.username&&!x.password&&!x.port&&(x.hostname==='github.com'||x.hostname==='www.github.com'||/^[a-z0-9-]+\.github\.io$/.test(x.hostname))&&x.pathname.split('/').filter(Boolean).length>=(x.hostname.endsWith('.github.io')?1:2)}catch{return false}
}
async function sendSubmission(e){
 e.preventDefault();const message=$('#form-message');message.textContent='';
 if(!user||!db||!F||!management?.active()){message.textContent='Complete seu cadastro para enviar atividades.';return}
 const uid=user.uid,version=sessionVersion,github=$('#sub-url').value.trim(),comment=$('#sub-note').value.trim(),s=getSub($('#sub-course').value),typ=$('#sub-type').value,atividadeId=$('#sub-activity').value||'';
 if(!s||!visibleSubjects().some(x=>x.id===s.id)){message.textContent='Disciplina não autorizada para sua matrícula.';return}
 if(!['semanal','pratica','projeto'].includes(typ)){message.textContent='Selecione um tipo de atividade válido.';return}
 const post=atividadeId?management.getPost(atividadeId):null,semana=Number($('#sub-week').value);
 if(atividadeId&&(!post||post.ativo===false||post.publicada===false||post.disciplina!==s.id||post.tipo!==typ)){message.textContent='Esta atividade não está disponível. Selecione novamente.';return}
 if(typ==='semanal'&&!s.semanas.some(w=>!w.sem_tema&&Number(w.n)===semana)){message.textContent='Selecione uma semana válida.';return}
 if(!isGitHubUrl(github)){message.textContent='Use um link HTTPS de repositório GitHub ou de um projeto no GitHub Pages.';return}
 if(comment.length>750){message.textContent='O comentário pode ter no máximo 750 caracteres.';return}
 const btn=$('#submit-btn');if(btn.disabled)return;btn.disabled=true;btn.textContent='Enviando...';
 try{
  const ref=F.push(F.ref(db,`${DB_ROOT}/submissoes/${uid}`));
  await F.set(ref,{disciplina:s.id,tipo:typ,semana:typ==='semanal'?semana:null,atividadeId,github,comentario:comment,nome:management.profile()?.nome||user.displayName||user.email,email:user.email,criadoEm:Date.now(),notaMax:Number(post?.notaMax??(typ==='pratica'?2:10)),atividadeTitulo:post?.titulo||''});
  if(version!==sessionVersion||user?.uid!==uid)return;
  $('#submit-modal').close();gradeSnapshot=null;toast('Entrega registrada!');
  if(currentPage==='submissions')await render();else nav('submissions');
 }catch(err){if(version===sessionVersion&&user?.uid===uid)message.textContent='Não foi possível registrar a entrega. Confira sua conexão e tente novamente.'}
 finally{btn.disabled=false;btn.textContent='Enviar atividade'}
}
function updateNav(){const p=currentPage==='course'||currentPage==='apostila'?'courses':currentPage;document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===p));$('#teacher-nav').classList.toggle('is-hidden',!management?.owner())}
let sessionVersion=0,renderVersion=0,signingOut=false,installPrompt=null;
const savedValue=(key,fallback=null)=>{try{return localStorage.getItem(key)??fallback}catch{return fallback}};
function storeValue(key,value){try{localStorage.setItem(key,value)}catch{}}
function closeMenu(){
 $('#sidebar').classList.remove('open');
 $('#menu-toggle').setAttribute('aria-expanded','false');
}
function clearSession(){
 sessionVersion++;renderVersion++;
 user=null;gradeSnapshot=null;teacherRows=[];gradeFilter='todos';selectedBim=0;currentPage='home';
 management?.reset?.();
 closeMenu();
 if($('#submit-modal').open)$('#submit-modal').close();
 $('#submit-form').reset();$('#form-message').textContent='';$('#view').replaceChildren();
 $('#user-name').textContent='Estudante';$('#user-avatar').textContent='U';
 $('#teacher-nav').classList.add('is-hidden');document.body.classList.remove('onboarding');
 $('#app-shell').classList.add('is-hidden');$('#login-screen').classList.remove('is-hidden');
 $('#login-help').textContent='';$('#login-btn').disabled=false;
 history.replaceState(null,'',location.pathname+location.search+'#/home');
 setConnection('Aguardando login');
}
async function logout(){
 if(signingOut||!auth||!F)return;
 signingOut=true;
 document.querySelectorAll('[data-signout]').forEach(b=>b.disabled=true);
 try{await F.signOut(auth);clearSession();toast('Você saiu da conta.');$('#login-btn').focus()}
 catch(e){toast('Não foi possível sair. Tente novamente.');console.warn('Sair:',e.code||e.message)}
 finally{signingOut=false;document.querySelectorAll('[data-signout]').forEach(b=>b.disabled=false)}
}
async function handleAuthState(u){
 const version=++sessionVersion;
 renderVersion++;gradeSnapshot=null;teacherRows=[];gradeFilter='todos';
 if(!u){clearSession();return}
 management?.reset?.();user=u;
 $('#view').innerHTML='<div class="loading-panel" role="status">Carregando seu cadastro...</div>';
 document.body.classList.remove('onboarding');closeMenu();
 $('#user-name').textContent=u.displayName||u.email||'Aluno(a)';
 $('#user-avatar').textContent=(u.displayName||'A').slice(0,1).toUpperCase();
 $('#login-screen').classList.add('is-hidden');$('#app-shell').classList.remove('is-hidden');
 await management.init(u);
 if(version!==sessionVersion||user?.uid!==u.uid)return;
 setConnection(management.hasError?.()?'Acesso restrito':(management.active()?'Conectado':'Complete seu cadastro'));
 await render();
}
async function render(){
 if(!user||!management)return;
 const version=++renderVersion,uid=user.uid;
 const parts=(location.hash||'#/home').replace(/^#\/?/,'').split('/').filter(Boolean);
 currentPage=parts[0]||'home';
 const pageNames={home:'Início',courses:'Disciplinas',course:'Disciplina',tasks:'Atividades',apostila:'Apostila',profile:'Meu cadastro',notes:'Minhas notas',teacher:'Administração',submissions:'Minhas entregas',guide:'Guia do GitHub',extras:'Cursos extras',materials:'Materiais',tools:'Ferramentas'};
 $('#breadcrumb').innerHTML=`PORTAL EDUCACIONAL <span>/</span> ${esc(pageNames[currentPage]||'Página')}`;
 setConnection(management.hasError?.()?'Acesso restrito':management.active()?'Conectado':'Complete seu cadastro');
 updateNav();const view=$('#view');
 document.body.classList.toggle('onboarding',management.hasError?.()||!management.active());
 if(management.hasError?.()||!management.active()){view.innerHTML=management.renderGate();return}
 if(!management.owner()&&currentPage==='teacher'){nav('home');return}
 if(!management.owner()&&['course','apostila','tasks'].includes(currentPage)&&parts[1]&&!visibleSubjects().some(x=>x.id===parts[1])){
  view.innerHTML=empty('Esta disciplina não faz parte do seu cadastro','Confira escola, ano, turma e disciplinas em Meu cadastro.');return;
 }
 const pages={home:renderHome,courses:renderCourses,tools:renderTools,materials:renderMaterials,extras:renderExtras,guide:renderGuide,profile:()=>management.renderProfile()};
 if(pages[currentPage])view.innerHTML=pages[currentPage]();
 else if(currentPage==='course'){selectedBim=0;view.innerHTML=renderCourse(parts[1])}
 else if(currentPage==='tasks')view.innerHTML=renderTasks(parts[1]);
 else if(currentPage==='apostila')view.innerHTML=getSub(parts[1])?renderApostila(parts[1]):empty('Disciplina não encontrada','Confira o endereço.');
 else if(currentPage==='submissions')await renderSubmissions();
 else if(currentPage==='notes')await renderNotes();
 else if(currentPage==='teacher'){
  view.innerHTML='<div class="loading-panel" role="status">Carregando o painel...</div>';
  const html=await management.renderAdmin();
  if(version===renderVersion&&user?.uid===uid)view.innerHTML=html;
 }else view.innerHTML=empty('Página não encontrada','');
 if(version===renderVersion&&user?.uid===uid)window.scrollTo({top:0,behavior:'instant'});
}
function bootUI(){
 initPixelUI();
 document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>nav(b.dataset.page)));
 $('#menu-toggle').addEventListener('click',()=>{
  const open=$('#sidebar').classList.toggle('open');$('#menu-toggle').setAttribute('aria-expanded',String(open));
 });
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
 document.addEventListener('click',e=>{
  if(e.target.closest('[data-signout]')){e.stopPropagation();void logout();return}
  if($('#sidebar').classList.contains('open')&&!e.target.closest('#sidebar, #menu-toggle'))closeMenu();
 });
 const applyTheme=mode=>{
  const light=mode==='light';document.body.dataset.theme=light?'light':'dark';
  const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=light?'#f5f7fb':'#0b1220';
  document.querySelectorAll('[data-theme-toggle]').forEach(b=>{
   b.setAttribute('aria-pressed',String(light));b.setAttribute('aria-label',light?'Ativar modo escuro':'Ativar modo claro');
   const icon=b.querySelector('[data-theme-symbol]'),caption=b.querySelector('[data-theme-caption]');
   if(icon)icon.textContent=light?'☀':'☾';if(caption)caption.textContent=light?'Modo claro':'Modo escuro';
  });
 };
 applyTheme(savedValue('portal-educacional-theme')||(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'));
 document.querySelectorAll('[data-theme-toggle]').forEach(b=>b.addEventListener('click',()=>{
  const next=document.body.dataset.theme==='light'?'dark':'light';storeValue('portal-educacional-theme',next);applyTheme(next);
 }));
 $('#modal-close').onclick=$('#cancel-submit').onclick=()=>$('#submit-modal').close();
 $('#sub-course').addEventListener('change',()=>fillWeeks());$('#sub-type').addEventListener('change',()=>fillWeeks());
 $('#submit-form').addEventListener('submit',sendSubmission);
 window.addEventListener('hashchange',()=>{void render().catch(e=>{console.error(e);toast('Não foi possível abrir esta tela. Tente novamente.')})});
 $('#view').addEventListener('submit',async e=>{if(management)await management.handleSubmit(e)});
 $('#view').addEventListener('change',async e=>{
  if(management&&await management.handleChange(e))return;
  const code=e.target.dataset.check;if(code){const [id,n,i]=code.split(':');storeValue(doneKey(id,n,i),e.target.checked?'1':'0')}
 });
 $('#view').addEventListener('input',e=>management?.handleInput(e));
 $('#view').addEventListener('click',async e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-signout')){e.stopPropagation();await logout();return}
  if(b.dataset.go){nav(b.dataset.go);return}
  if(management&&await management.handleClick(e))return;
  if(b.dataset.submit){showModal(b.dataset.submit);return}
  if(b.hasAttribute('data-expand')){
   const target=$('#detail-'+b.dataset.expand),expand=target.classList.contains('is-hidden');target.classList.toggle('is-hidden');b.setAttribute('aria-expanded',String(expand));const label=b.querySelector('.week-open-label');if(label)label.textContent=expand?'Fechar aula':'Abrir aula';return;
  }
  if(b.hasAttribute('data-bim')){selectedBim=Number(b.dataset.bim);$('#view').innerHTML=renderCourse(location.hash.split('/')[2]);return}
  if(b.dataset.download){createApostila(b.dataset.download);return}
  if(b.hasAttribute('data-print')){window.print();return}
  if(b.dataset.grade){await saveGrade(b.dataset.grade);return}
  if(b.dataset.gradeFilter){gradeFilter=b.dataset.gradeFilter;await renderNotes();return}
  if(b.hasAttribute('data-notes-refresh'))await renderNotes(true);
 });
}
async function setupPWA(){
 const button=$('#install-btn');
 const installed=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;if(!installed())button.classList.remove('is-hidden')});
 if(/iphone|ipad|ipod/i.test(navigator.userAgent)&&!installed())button.classList.remove('is-hidden');
 button.addEventListener('click',async()=>{
  if(!installPrompt){toast('No Safari, toque em Compartilhar e em Adicionar à Tela de Início.');return}
  const prompt=installPrompt;installPrompt=null;button.classList.add('is-hidden');
  try{await prompt.prompt();await prompt.userChoice}catch{toast('Use a opção Instalar app no menu do navegador.')}
 });
 window.addEventListener('appinstalled',()=>{installPrompt=null;button.classList.add('is-hidden')});
 if(!('serviceWorker'in navigator))return;
 try{
  const registration=await navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'});
  let reloadForUpdate=false;
  const showUpdate=()=>{if(registration.waiting)$('#update-notice').classList.remove('is-hidden')};
  showUpdate();registration.addEventListener('updatefound',()=>{
   const worker=registration.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)showUpdate()});
  });
  $('#update-btn').onclick=()=>{if(registration.waiting){reloadForUpdate=true;registration.waiting.postMessage({type:'SKIP_WAITING'})}};
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloadForUpdate){reloadForUpdate=false;location.reload()}});
  void registration.update().catch(()=>{});
 }catch(e){console.warn('PWA:',e.message)}
}
async function start(){
 bootUI();void setupPWA();$('#login-btn').disabled=true;
 try{
  subjects=await loadCurriculum();subjectById=Object.fromEntries(subjects.map(x=>[x.id,x]));
  setConnection('Inicializando...');
  const base='https://www.gstatic.com/firebasejs/13.3.0/';
  const [appMod,authMod,dbMod]=await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-database.js')]);
  F={...authMod,...dbMod};const app=appMod.initializeApp(FIREBASE_CONFIG);auth=authMod.getAuth(app);db=dbMod.getDatabase(app);
  management=createManagement({
   user:()=>user,db:()=>db,F:()=>F,subjects:()=>subjects,
   setSubjects:arr=>{subjects=arr;subjectById=Object.fromEntries(arr.map(x=>[x.id,x]))},render,toast,showModal,
   setSubmissionActivity:id=>{$('#sub-activity').value=id},signOut:logout,
   aiGrade:async(uid,submissionId)=>{
    if(!callableAI){const fnMod=await import(base+'firebase-functions.js');callableAI=fnMod.httpsCallable(fnMod.getFunctions(app,'us-central1'),'corrigirEntregaGemini',{timeout:120000})}
    const res=await callableAI({uid,submissionId});return res.data;
   }
  });
  try{await authMod.setPersistence(auth,authMod.browserLocalPersistence)}
  catch{try{await authMod.setPersistence(auth,authMod.browserSessionPersistence)}catch{await authMod.setPersistence(auth,authMod.inMemoryPersistence)}}
  $('#login-btn').addEventListener('click',async()=>{
   const b=$('#login-btn');b.disabled=true;$('#login-help').textContent='';
   const provider=new authMod.GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});
   try{await authMod.signInWithPopup(auth,provider)}
   catch(e){
    if(e.code==='auth/popup-blocked'||e.code==='auth/operation-not-supported-in-this-environment'){
     try{await authMod.signInWithRedirect(auth,provider)}catch(redirectError){$('#login-help').textContent=errorMsg(redirectError)}
    }else $('#login-help').textContent=errorMsg(e);
   }finally{b.disabled=false}
  });
  await authMod.getRedirectResult(auth).catch(e=>{$('#login-help').textContent=errorMsg(e)});
  authMod.onAuthStateChanged(auth,u=>{void handleAuthState(u).catch(e=>{console.error(e);toast('Não foi possível carregar a conta. Tente entrar novamente.')})});
  $('#login-btn').disabled=false;
 }catch(err){
  console.error(err);$('#login-screen').classList.remove('is-hidden');$('#app-shell').classList.add('is-hidden');
  $('#login-help').textContent=navigator.onLine?'Não foi possível carregar o portal. Recarregue para tentar novamente.':'Conecte-se à internet para entrar e consultar seus dados.';
  $('#login-btn').disabled=false;$('#login-btn').textContent='Recarregar portal';$('#login-btn').onclick=()=>location.reload();setConnection('Sem conexão');
 }finally{
  setTimeout(()=>$('#splash')?.classList.add('fade'),100);setTimeout(()=>$('#splash')?.remove(),450);
 }
}
function errorMsg(e){
 if(e.code==='auth/unauthorized-domain')return 'Este endereço precisa ser autorizado no Firebase pelo administrador.';
 if(e.code==='auth/operation-not-allowed')return 'O login Google precisa ser habilitado pelo administrador.';
 if(e.code==='auth/popup-closed-by-user'||e.code==='auth/cancelled-popup-request')return 'Login cancelado. Toque em Entrar com Google para tentar novamente.';
 if(e.code==='auth/network-request-failed')return 'Confira sua conexão com a internet e tente novamente.';
 return 'Não foi possível entrar com Google. Tente novamente.';
}
start();
