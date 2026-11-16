# Publicar em um NOVO repositório GitHub

**Repositório a criar:** `perabru/portal-educacional` (não use `maximus-inic`).

## Opção com GitHub CLI (Windows, macOS, Linux)
1. Instale Git e [GitHub CLI](https://cli.github.com/).
2. Entre na conta: `gh auth login` e autentique a conta proprietária `perabru`.
3. Extraia o ZIP, abra o terminal **dentro da pasta `portal-educacional`** e execute:

```bash
git init -b main
git add .
git commit -m "Portal Educacional independente - UNIVAP e Maximus"
gh repo create perabru/portal-educacional --public --source=. --remote=origin --push
```

4. No novo repositório, abra **Settings → Pages → Build and deployment → Source: GitHub Actions** e habilite o deploy.
5. Acompanhe a aba **Actions**: o endereço esperado, após a publicação bem-sucedida, será `https://perabru.github.io/portal-educacional/`. **Não é endereço confirmado como ativo até que o fluxo seja concluído.**

**Não apague a pasta antiga no `maximus-inic` até confirmar que o novo Pages está ativo; ela pertence ao histórico antigo e não é a origem do novo portal.**

## Dados e IA
- O novo portal utiliza `portalEducacionalV1` no Realtime Database do projeto `apptcc3j`.
- O Maximus INIC usa outro Firebase e **não é alterado por esta publicação**.
- As regras em `firebase.rules.json` devem ser mescladas dentro do projeto `apptcc3j`, sem sobrescrever outras regras.
- O GitHub Pages publica **apenas a interface e os materiais**; Cloud Functions Gemini requer implantação separada (consulte `SETUP-FIREBASE.md`).
- Configure **Authentication → Authorized domains → `perabru.github.io`** no projeto do portal.
