# Build remoto com GitHub Actions

Este projeto publica as imagens Docker via `GitHub Actions`, sem depender de Docker local na máquina de desenvolvimento.

## Secrets obrigatórios no GitHub

Configurar em `Settings > Secrets and variables > Actions`:

- `DOCKERHUB_USERNAME`: usuário do Docker Hub
- `DOCKERHUB_TOKEN`: access token do Docker Hub com permissão de push

## Workflow criado

Arquivo: `.github/workflows/docker-build-push.yml`

Ele publica:

- `docker.io/bjsoftware/rfb-api:<tag>`
- `docker.io/bjsoftware/rfb-frontend:<tag>`

## Uso local com PowerShell

O script `build-push.ps1` não faz mais build local. Ele:

1. valida se a árvore `git` está limpa
2. valida se os commits já foram enviados ao GitHub
3. valida autenticação no `gh`
4. dispara o workflow remoto

### Pré-requisitos

- `git`
- `gh` instalado
- `gh auth login` executado com acesso ao repositório

### Exemplos

```powershell
.\build-push.ps1
.\build-push.ps1 -Tag latest
.\build-push.ps1 -Tag v1.2.0
.\build-push.ps1 -Tag latest -NoCache
.\build-push.ps1 -Tag homolog -Ref master
```

## Uso manual pelo GitHub

Se preferir, também é possível disparar pela interface:

1. abrir `Actions`
2. selecionar `Docker Build and Push`
3. clicar em `Run workflow`
4. informar a `branch` e a `tag`

## Observações

- O workflow também roda automaticamente em `push` de tags `v*`
- Se houver mudanças locais sem commit ou sem push, o `build-push.ps1` bloqueia a execução para evitar buildar código diferente do GitHub
