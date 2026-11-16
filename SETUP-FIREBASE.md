# Firebase — Portal Educacional

O portal usa o projeto **`apptcc3j`**, o Realtime Database **`apptcc3j-default-rtdb`** e o caminho **`portalEducacionalV1`**. O Firebase do Maximus INIC é separado.

## Login e matrículas

1. No [Firebase Console](https://console.firebase.google.com/project/apptcc3j), habilite **Authentication → Sign-in method → Google**.
2. Em **Authentication → Settings → Authorized domains**, autorize `perabru.github.io`. Para desenvolvimento, autorize `localhost`.
3. Em **Realtime Database → Regras**, copie as regras atuais para backup. Dentro de `rules`, substitua **somente** o nó `portalEducacionalV1` pelo nó correspondente de [firebase.rules.json](firebase.rules.json). Preserve os demais nós do banco e publique.
4. O aluno entra com Google, informa escola, nome, ano, turma e disciplinas e salva o cadastro. O acesso é liberado automaticamente para sua seleção.
5. Cadastros antigos pendentes são ativados automaticamente ao entrar quando as disciplinas correspondem à escola, ao ano e à turma informados. Se os dados antigos forem incompatíveis, o aluno os corrige no formulário. Não há aprovação manual de matrícula.
6. A conta **`brunomichel00@gmail.com`** administra alunos, disciplinas, atividades e avaliações. Remover um aluno suspende o acesso; ele não pode reativar a própria matrícula.

As disciplinas são filtradas pela escola, pelo ano e, quando houver restrição, pela turma. O administrador define a escola e o ano da disciplina; o mapa opcional `turmas` usa o formato `{ "2IA": true, "2IB": true }`, vazio ou ausente para todas as turmas do ano. Para mais de um ano, use `1º e 2º anos` ou `Todos os anos`. Alterações de matrícula válidas são aplicadas imediatamente. Notas continuam exclusivas da própria conta e somente o professor pode publicá-las; a revisão docente da correção com Gemini permanece.

### Corrigir “Permission denied”

As regras precisam autorizar **`portalEducacionalV1/usuarios/UID`**. Regras apenas em `usuarios/UID`, ou regras do Firestore, não autorizam este caminho do Realtime Database.

O próprio aluno com e-mail verificado pode ler, criar e atualizar seu cadastro ativo. As regras validam a instituição, o ano e as disciplinas do catálogo; uma conta removida não pode se reativar. Somente o administrador pode publicar notas. Não habilite leitura ou escrita pública na raiz para contornar um erro de acesso.

**Publicar os arquivos no GitHub Pages não publica regras no Firebase.** O arquivo `firebase.json` declara o database para uso do Firebase CLI, mas o comando `firebase deploy --only database` substitui o conjunto completo de regras: use-o somente com um arquivo que já contenha a mesclagem das regras atuais do servidor. Para uma aplicação compartilhando o projeto, prefira a alteração pontual pelo Console descrita acima.

## Correção com Gemini

O código da função **`corrigirEntregaGemini`** está em `functions/index.js`. O painel administrador pede a análise, recebe uma sugestão de nota com justificativa e permite revisão do professor antes de publicar. A função não publica notas automaticamente.

Modelo: **`gemini-3.5-flash-lite`**, confirmado na [documentação oficial](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite). A disponibilidade e a cota da API dependem da conta. Hospedar a função no Firebase pode exigir faturamento ativo; o Pages não hospeda essa função.

```bash
npm install -g firebase-tools
firebase login
npm --prefix functions install
firebase functions:secrets:set GEMINI_API_KEY --project apptcc3j
# Informe a chave da Gemini Developer API no prompt seguro.
firebase deploy --only functions:portal-educacional --project apptcc3j
```

Nunca inclua a chave em arquivos versionados, no HTML/JavaScript público ou nos argumentos do shell. O Secret Manager fornece a chave somente à função. Após a implantação, entre como administrador, abra uma entrega pública no GitHub e clique em **Corrigir com Gemini**. A sugestão deve aparecer sem publicar a nota; revise-a e salve a avaliação quando estiver correta.

Links de GitHub Pages no formato `https://usuario.github.io/repositorio/` são convertidos para o repositório público correspondente. Páginas com domínio próprio não identificam esse repositório e precisam do link GitHub direto.

A análise registra o commit e os arquivos consultados, respeita a nota máxima registrada na entrega e ignora pastas de dependências e arquivos de credenciais. Ela lê uma amostra, não executa o código do aluno. Solicitações simultâneas e repetições imediatas da mesma entrega são limitadas.

Para testar apenas a credencial, configure `GEMINI_API_KEY` no ambiente e execute `node tests/testar-gemini.mjs`. Esse comando não implanta a função.

## Verificação local

```bash
node --check app.js
node --check management.js
node --check functions/index.js
node tests/testar-backend.cjs
```

`tests/testar-backend.cjs` verifica autorização, limites, erros dos serviços e persistência de sugestões com serviços controlados. Não usa credenciais nem publica notas.

`tests/testar-regras.cjs` usa o **Firebase Database Emulator** na porta 9000 e o projeto fictício `demo-portal-educacional`. Instale `firebase-tools`, `firebase` e `@firebase/rules-unit-testing` no ambiente de desenvolvimento, inicie o emulador com as regras locais e execute o teste. Ele verifica cadastro ativo automático, migração de cadastros antigos, filtros de escola/ano/turma, entregas, disciplinas novas, isolamento de notas e suspensão de acesso, sem acessar produção.

## PWA

No Android, use a opção de instalação oferecida pelo navegador. No iPhone/iPad, abra no Safari e use **Compartilhar → Adicionar à Tela de Início**. A instalação precisa ser aceita em cada aparelho. O botão **Sair** encerra a sessão e permite trocar de conta.

Os materiais publicados no GitHub Pages são públicos. Cadastros, entregas e notas permanecem no Firebase protegido pelas regras de acesso.
