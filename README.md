# Portal Educacional

Projeto **independente** para UNIVAP e Maximus, preparado para um repositório exclusivo `perabru/portal-educacional`.

## O que está separado
- **UNIVAP:** sete disciplinas dos planejamentos técnicos originais; **a UNIVAP não possui disciplina TCC neste portal**. Não utiliza o aplicativo Maximus INIC.
- **Maximus:** **TCA e TCC**, com trilhas de estudo e indicação para abrir/instalar **Maximus INIC apenas nas páginas dessas duas matérias**.
- Login Google e cadastro com **instituição, ano, turma e disciplinas**, sujeitos à aprovação do administrador.
- Administração `brunomichel00@gmail.com`, atividades, entregas GitHub, dashboard do aluno, notas e correção assistida por Gemini com revisão docente.
- PWA instalável pelo menu do navegador, **sem banner de instalação em todas as páginas**.
- Firebase RTDB separado em `portalEducacionalV1` (não altera o banco do Maximus INIC).

## Como publicar
Siga [PUBLICAR-GITHUB.md](PUBLICAR-GITHUB.md) para criar um novo repositório e ativar o GitHub Pages por GitHub Actions.

## Firebase e Gemini
Acesse [SETUP-FIREBASE.md](SETUP-FIREBASE.md). A chave do Gemini nunca deve ser enviada ao GitHub nem ao navegador. O botão Gemini exige Cloud Functions implantada com secret configurado.

## Testes
- `node --check app.js`, `node --check management.js` e `node --check functions/index.js`.
- `python -m http.server 8080` para testar a interface com login (depois de autorizar localhost no Firebase).
- `node tests/testar-gemini.mjs` com a variável de ambiente `GEMINI_API_KEY` configurada permite um teste real da credencial sem salvá-la no projeto.

## Privacidade
PDFs, JSON e arquivos hospedados no Pages são **públicos**. Notas, matrículas e sugestões de IA devem existir apenas no Firebase com regras de acesso adequadas. A IA emite **proposta**, nunca nota final automática sem revisão do professor.
