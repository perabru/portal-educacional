# Portal Educacional

Aulas por semana, materiais, listas práticas de até 2 pontos e projetos de 0 a 10. Aplicativo independente, publicado em https://perabru.github.io/portal-educacional/.

- Login Google; matrícula com ano, turma e disciplinas, aprovada pelo professor.
- Administração: `brunomichel00@gmail.com`, com e-mail verificado.
- Cadastro de disciplinas, edição de semanas, atividades, aprovação e suspensão de alunos.
- Painel de entregas com filtros, exportação CSV, notas e comentários do professor.
- Painel do aluno com listas, projetos e histórico de avaliações.
- Modos claro e escuro, instalação pelo navegador e botão **Sair** em todas as telas da conta.
- Banco Firebase `apptcc3j`, com dados isolados em `portalEducacionalV1`.

## Publicação

O GitHub Actions valida o código, executa os testes e publica a branch `main` no GitHub Pages. Somente arquivos do site e materiais são incluídos no conteúdo público. Regras, testes e funções permanecem no repositório.

## Firebase e Gemini

Consulte [SETUP-FIREBASE.md](SETUP-FIREBASE.md). A publicação do site não publica as regras nem o backend. Para ativar o banco, mescle apenas o nó `portalEducacionalV1` nas regras existentes, preservando outros aplicativos.

A função `corrigirEntregaGemini` exige implantação no Firebase e uma chave privada no Secret Manager. O professor confere a sugestão e publica a nota. Credenciais Gemini não são incluídas no navegador nem no repositório.

## Verificação

```sh
node tests/testar-app.mjs
node tests/testar-interface.mjs
node tests/testar-backend.cjs
node tests/test-pwa.mjs
```

As regras também possuem teste de integração em `tests/testar-regras.cjs`, executado apenas com Firebase Database Emulator. Os testes não usam dados reais dos alunos.

## Instalação e atualização

Em navegadores compatíveis, use **Instalar app**. No iPhone/iPad, abra no Safari e escolha **Compartilhar → Adicionar à Tela de Início**. A instalação depende da escolha de cada usuário.

Uma atualização disponível mostra **Atualizar**. Ao migrar de uma versão antiga, feche todas as telas do portal e abra novamente. O cache é limitado a este aplicativo; links para Maximus INIC abrem o aplicativo separado.
