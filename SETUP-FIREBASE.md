# Configuração do Firebase — Portal Educacional independente

## Projetos distintos
- Portal Educacional: Firebase `apptcc3j`, nó isolado `portalEducacionalV1` no Realtime Database.
- Maximus INIC: aplicativo separado, com repositório e Firebase próprios. Nenhuma edição deste projeto é aplicada ao Maximus INIC.

## Etapas de ativação
1. Em https://console.firebase.google.com/project/apptcc3j, ative **Authentication → Sign-in method → Google**.
2. Em **Authorized domains**, autorize `perabru.github.io`; em ambiente local teste `localhost`.
3. Em **Realtime Database → Rules**, **faça backup das regras atuais e MESCLAGEM** do nó `portalEducacionalV1` do arquivo `firebase.rules.json` dentro de `rules`. Não substitua as regras existentes de outros aplicativos.
4. Faça login em `brunomichel00@gmail.com`, abra Administração, aprova matrículas de alunos por instituição, turma e matérias.
5. O aluno escolhe `UNIVAP` (7 disciplinas, sem TCC) ou `Maximus` (TCA/TCC) antes da matrícula; o catálogo e as disciplinas escolhidas são filtrados pela instituição. Alterar instituição após aprovação exige nova aprovação.
6. Entregas e notas permanecem no Firebase do Portal Educacional, e o professor controla a publicação de notas.

## Gemini (serviço separado)
O botão **Corrigir com Gemini** fica no painel do administrador. Lê uma amostra do código público do GitHub, formula sugestão de nota e justificativa, que **deve ser revisada e aprovada pelo professor**.

Modelo padrão: `gemini-3.5-flash-lite`. Disponibilidade e cota gratuita variam; verifique a [documentação oficial](https://ai.google.dev/gemini-api/docs/models).

```bash
npm install -g firebase-tools
firebase login
cd portal-educacional
npm --prefix functions install
firebase functions:secrets:set GEMINI_API_KEY --project apptcc3j
# Digite sua chave apenas no prompt seguro, não em arquivos do GitHub.
firebase deploy --only functions:portal-educacional --project apptcc3j
```

**Aviso:** Cloud Functions pode exigir plano Blaze e faturamento ativo, mesmo que a API Gemini tenha cota gratuita. Não implante sem aceitar explicitamente a cobrança no Console.

A chave fornecida na conversa não é incluída no repositório. Para testar a conexão, use `GEMINI_API_KEY` via variável de ambiente e rode `node tests/testar-gemini.mjs` no seu computador. Isso **não implanta** a função.

## Segurança e limites
- Não cole sua chave Gemini em `app.js`, `index.html`, configurações do Pages ou arquivos versionados.
- Não salve chaves ou dados pessoais de alunos em repositórios GitHub públicos usados como entregas.
- A IA não executa código nem verifica toda a funcionalidade; notas oficiais exigem conferência docente.
- O portal é uma PWA, mas instalação automática em todos os celulares não é permitida; o usuário escolhe via navegador.
- Alunos acessam apenas entregas e notas da própria conta. As regras do database são independentes do site estático.
