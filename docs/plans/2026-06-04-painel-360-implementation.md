# Painel 360 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Implementar o V1 do Painel 360 no portal com controle por recurso, lotes de consulta por CSV, resultados paginados, download e GeoJSON para mapa.

**Architecture:** O backend ganha um módulo isolado `painel-360` com persistência de lotes e itens processados, protegido por JWT do portal e um guard de recurso por `slug`. O frontend ganha páginas lazy para admin e cliente, um serviço compartilhado, menu condicionado por perfil/recurso e um componente de mapa isolado para Leaflet.

**Tech Stack:** NestJS 11, TypeORM 0.3, PostgreSQL 16, Angular 21, PO-UI 21, Leaflet 1.9

---

### Task 1: Foundation

**Files:**
- Create: `backend/src/modules/portal/recurso.decorator.ts`
- Create: `backend/src/modules/portal/recurso.guard.ts`
- Modify: `backend/src/modules/clientes/clientes.service.ts`
- Modify: `backend/src/modules/assinaturas/assinaturas.service.ts`
- Test: `backend` build verification

**Step 1: Write the failing test**

Use build-driven verification for now because the backend has no existing automated test harness.

**Step 2: Run test to verify it fails**

Run: `npm run build` em `backend/`
Expected: FAIL após introduzir imports inexistentes.

**Step 3: Write minimal implementation**

Implementar o decorator/guard de recurso e expor os recursos do plano ativo no payload do portal.

**Step 4: Run test to verify it passes**

Run: `npm run build` em `backend/`
Expected: PASS

### Task 2: Backend Painel 360

**Files:**
- Create: `backend/src/entities/painel-360-lote.entity.ts`
- Create: `backend/src/entities/painel-360-item.entity.ts`
- Create: `backend/src/modules/painel-360/painel-360.module.ts`
- Create: `backend/src/modules/painel-360/painel-360.controller.ts`
- Create: `backend/src/modules/painel-360/painel-360.service.ts`
- Modify: `backend/src/app.module.ts`
- Test: `backend` build verification

**Step 1: Write the failing test**

Use build-driven verification for the new module and endpoint contracts.

**Step 2: Run test to verify it fails**

Run: `npm run build` em `backend/`
Expected: FAIL enquanto módulo e entidades não existirem.

**Step 3: Write minimal implementation**

Implementar V1 com upload CSV, criação de lote, processamento assíncrono simples, resultados, download CSV e GeoJSON.

**Step 4: Run test to verify it passes**

Run: `npm run build` em `backend/`
Expected: PASS

### Task 3: Frontend Portal

**Files:**
- Create: `frontend/src/app/guards/cliente-recurso.guard.ts`
- Create: `frontend/src/app/pages/portal/painel-360/painel-360.service.ts`
- Create: `frontend/src/app/pages/portal/painel-360/painel-360.types.ts`
- Create: `frontend/src/app/pages/portal/admin/painel-360-admin/*`
- Create: `frontend/src/app/pages/portal/cliente/painel-360/*`
- Create: `frontend/src/app/pages/portal/painel-360/mapa/*`
- Modify: `frontend/src/app/pages/portal/portal.module.ts`
- Modify: `frontend/src/app/pages/portal/portal-shell.component.ts`
- Modify: `frontend/src/app/pages/portal/admin/admin.service.ts`
- Modify: `frontend/src/app/pages/portal/cliente/cliente.service.ts`
- Modify: `frontend/package.json`
- Test: `frontend` build verification

**Step 1: Write the failing test**

Use build-driven verification because the existing Angular test coverage is not representative and the frontend build is already partially broken by unrelated files.

**Step 2: Run test to verify it fails**

Run: `npm run build` em `frontend/`
Expected: FAIL por componentes/rotas/dependências ausentes.

**Step 3: Write minimal implementation**

Adicionar páginas do portal, serviço HTTP, upload via PO-UI, tabela de lotes/resultados e componente de mapa isolado.

**Step 4: Run test to verify it passes**

Run: `npm run build` em `frontend/`
Expected: PASS ou, se continuar bloqueado por erro pré-existente fora do escopo, registrar o bloqueio com evidência.
