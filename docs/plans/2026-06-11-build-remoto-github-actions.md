# Build remoto com GitHub Actions Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Publicar as imagens Docker de backend e frontend no Docker Hub via GitHub Actions, com um novo `build-push.ps1` para disparo remoto seguro.

**Architecture:** O repositório passa a ter um workflow manual em `GitHub Actions` que faz checkout do ref solicitado, autentica no Docker Hub e publica duas imagens. O script local não faz mais `docker build`; ele apenas valida o estado do `git`, exige commits já enviados ao GitHub e dispara o workflow com `gh`.

**Tech Stack:** GitHub Actions, Docker Buildx, Docker Hub, PowerShell, GitHub CLI

---

### Task 1: Criar workflow remoto

**Files:**
- Create: `.github/workflows/docker-build-push.yml`

**Step 1: Definir gatilhos**

- Adicionar `workflow_dispatch` com inputs `image_tag` e `no_cache`
- Adicionar `push.tags` para releases versionadas

**Step 2: Configurar autenticação**

- Usar `docker/login-action`
- Ler `DOCKERHUB_USERNAME` e `DOCKERHUB_TOKEN` de `GitHub Secrets`

**Step 3: Publicar backend**

- Contexto `./backend`
- Dockerfile `backend/Dockerfile`
- Imagem `bjsoftware/rfb-api`

**Step 4: Publicar frontend**

- Contexto `./frontend`
- Dockerfile `frontend/Dockerfile.prod`
- Imagem `bjsoftware/rfb-frontend`

### Task 2: Substituir o script local

**Files:**
- Modify: `build-push.ps1`

**Step 1: Validar pré-requisitos**

- Verificar `gh` instalado
- Verificar `gh auth status`
- Verificar `origin` configurado

**Step 2: Validar estado do código**

- Bloquear árvore suja
- Bloquear commits locais sem push
- Identificar branch/ref a ser usada no workflow

**Step 3: Disparar o workflow**

- Executar `gh workflow run docker-build-push.yml`
- Passar `image_tag` e `no_cache`
- Mostrar URL da execução quando disponível

### Task 3: Documentar setup e uso

**Files:**
- Create: `docs/github-actions-build-push.md`

**Step 1: Documentar secrets**

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

**Step 2: Documentar uso local**

- Como autenticar no `gh`
- Como rodar `.\build-push.ps1`
- Como usar a UI do GitHub como fallback
