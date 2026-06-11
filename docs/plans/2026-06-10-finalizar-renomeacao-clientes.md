# Finalizar Renomeação Cliente/Conta Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Concluir a renomeação de `conta/contas` para `cliente/clientes` no código, frontend, documentação e scripts auxiliares, removendo inconsistências remanescentes sem quebrar compatibilidade de migração.

**Architecture:** A abordagem mantém compatibilidade transitória apenas onde o banco ou JWT antigos ainda podem existir, mas padroniza o código novo para `clienteId`/`clientes`. Primeiro corrigimos backend e testes de contrato, depois ajustamos frontend e por fim limpamos docs/scripts operacionais.

**Tech Stack:** NestJS 11, TypeORM 0.3, Angular 21, PO-UI 21, PostgreSQL 16, Node.js test runner, Docker Compose.

---

### Task 1: Corrigir contrato de autenticação e autorização no backend

**Files:**
- Modify: `backend/src/modules/portal/recurso.guard.ts`
- Modify: `backend/src/modules/portal/portal.service.ts`
- Test: `backend/test/portal.recurso.guard.spec.ts`
- Test: `backend/test/portal.service.spec.ts`

**Step 1: Write the failing tests**

Criar testes cobrindo:
- `PortalService.login` retorna `clienteId` no payload e preserva `contaId` apenas como alias legado.
- `RecursoGuard` busca assinatura pelo `clienteId` do JWT, e não pelo `sub` do usuário.
- `RecursoGuard` continua liberando admin sem consultar assinatura.

Exemplo de cenários:

```ts
it('usa clienteId do JWT para buscar assinatura ativa', async () => {
  const req = { usuario: { sub: 'usuario-1', clienteId: 'cliente-1', perfil: 'cliente' } };
  // mock repository findOne with clienteId = cliente-1
});
```

**Step 2: Run tests to verify they fail**

Run: `cd backend; node -r ts-node/register/transpile-only --test .\\test\\portal*.spec.ts`

Expected: FAIL mostrando ausência dos testes ou comportamento atual incorreto no guard.

**Step 3: Write minimal implementation**

- Em `backend/src/modules/portal/recurso.guard.ts`, usar `usuario.clienteId ?? usuario.contaId ?? null`.
- Falhar com mensagem clara se usuário cliente não tiver `clienteId`.
- Em `backend/src/modules/portal/portal.service.ts`, manter emissão de `clienteId` e `contaId`, mas deixar comentários e nomenclatura coerentes com o estado final.

**Step 4: Run tests to verify they pass**

Run: `cd backend; node -r ts-node/register/transpile-only --test .\\test\\portal*.spec.ts`

Expected: PASS.

**Step 5: Commit**

```bash
git add backend/src/modules/portal/recurso.guard.ts backend/src/modules/portal/portal.service.ts backend/test/portal.recurso.guard.spec.ts backend/test/portal.service.spec.ts
git commit -m "fix: align portal guards with cliente rename"
```

---

### Task 2: Padronizar backend restante para `clienteId`

**Files:**
- Modify: `backend/src/modules/usuarios/usuarios.controller.ts`
- Modify: `backend/src/modules/faturas/faturas.controller.ts`
- Modify: `backend/src/modules/consumo/consumo.controller.ts`
- Modify: `backend/src/modules/portal/portal.service.ts`
- Modify: `backend/src/modules/usuarios/usuario.guard.ts`
- Test: `backend/test/clientes.service.spec.ts`

**Step 1: Write the failing tests**

Adicionar ou ajustar testes cobrindo:
- endpoints do portal e cliente preferem `clienteId` ao ler JWT;
- compatibilidade com `contaId` legado continua funcionando;
- `usuario.guard` não confunde `x_cliente_id` com id de usuário se houver inconsistência de nomenclatura/documentação.

**Step 2: Run tests to verify they fail**

Run: `cd backend; node -r ts-node/register/transpile-only --test .\\test\\clientes.service.spec.ts .\\test\\planos.service.spec.ts`

Expected: FAIL ou lacunas de cobertura indicando necessidade de ajuste.

**Step 3: Write minimal implementation**

- Padronizar comentários, nomes de variáveis locais e fallbacks.
- Onde já existe `req['usuario'].clienteId ?? req['usuario'].contaId`, manter a ordem e remover ambiguidade textual.
- Revisar `backend/src/modules/usuarios/usuario.guard.ts` para confirmar se o header e os nomes internos refletem “cliente” e não “usuário” de forma enganosa.

**Step 4: Run tests to verify they pass**

Run: `cd backend; node -r ts-node/register/transpile-only --test .\\test\\*.spec.ts`

Expected: PASS nos testes backend existentes e novos.

**Step 5: Commit**

```bash
git add backend/src/modules/usuarios/usuarios.controller.ts backend/src/modules/faturas/faturas.controller.ts backend/src/modules/consumo/consumo.controller.ts backend/src/modules/portal/portal.service.ts backend/src/modules/usuarios/usuario.guard.ts backend/test/clientes.service.spec.ts
git commit -m "refactor: standardize backend clienteId naming"
```

---

### Task 3: Padronizar frontend para `clienteId` e `cliente`

**Files:**
- Modify: `frontend/src/app/services/auth.service.ts`
- Modify: `frontend/src/app/pages/portal/cliente/usuario.service.ts`
- Modify: `frontend/src/app/guards/cliente-recurso.guard.ts`
- Modify: `frontend/src/app/guards/cliente-onboarding.guard.ts`
- Modify: `frontend/src/app/pages/portal/portal.module.ts`
- Test: `frontend/src/app/app.spec.ts`

**Step 1: Write the failing tests**

Adicionar cenários cobrindo:
- `AuthService` lê `clienteId` primeiro e usa `contaId` só como fallback.
- Tipagem do JWT inclui `clienteId`.
- Modelos de perfil expõem `cliente` como nome preferencial, com compatibilidade temporária se necessário.

Exemplo:

```ts
it('prefere clienteId no payload JWT', () => {
  // mock token payload with clienteId and contaId
});
```

**Step 2: Run tests to verify they fail**

Run: `cd frontend; npm test -- --runInBand`

Expected: FAIL nos testes novos ou ausência de cobertura.

**Step 3: Write minimal implementation**

- Em `frontend/src/app/services/auth.service.ts`, expandir `JwtPayload` para incluir `clienteId`.
- Criar método `getClienteId()` e manter `getContaId()` apenas como alias/deprecated wrapper, se ainda usado.
- Em `frontend/src/app/pages/portal/cliente/usuario.service.ts`, renomear `conta` para `cliente` no contrato principal; se o backend ainda devolver `conta`, mapear para `cliente` localmente.
- Revisar guards e rotas para evitar redirects legados desnecessários.

**Step 4: Run tests to verify they pass**

Run: `cd frontend; npm test -- --runInBand`

Expected: PASS.

**Step 5: Build frontend to verify compile**

Run: `cd frontend; npm run build`

Expected: build concluído sem erros de tipagem.

**Step 6: Commit**

```bash
git add frontend/src/app/services/auth.service.ts frontend/src/app/pages/portal/cliente/usuario.service.ts frontend/src/app/guards/cliente-recurso.guard.ts frontend/src/app/guards/cliente-onboarding.guard.ts frontend/src/app/pages/portal/portal.module.ts frontend/src/app/app.spec.ts
git commit -m "refactor: align frontend with cliente naming"
```

---

### Task 4: Revisar scripts operacionais e seeds pós-rename

**Files:**
- Modify: `backend/seed.js`
- Modify: `historico/backend-scripts/seed-menu.sql`
- Modify: `scripts/seed-vps.sh`
- Modify: `scripts/seed-swarm.sh`
- Modify: `historico/sql/2026-06-10_rename-clientes.sql`

**Step 1: Write the failing validation checklist**

Criar checklist manual no PR/commit cobrindo:
- menus usam ids `...0020` para `Perfis` e `...0023` para `Usuários`;
- scripts shell não tratam `assinaturas.cliente_id` como se fosse usuário após o rename final;
- script SQL final documenta claramente o estado esperado pós-migração.

**Step 2: Search for remaining legacy references**

Run: `rg -n "\\bconta_id\\b|\\bcontas\\b|assinaturas\\.cliente_id|/portal/usuarios-admin|000000000020|000000000023" backend scripts -S`

Expected: lista pequena e consciente das referências ainda necessárias.

**Step 3: Write minimal implementation**

- Manter referências históricas apenas onde forem parte de migração ou compatibilidade deliberada.
- Ajustar comentários e consultas shell que assumam semântica antiga para `assinaturas.cliente_id`.
- Garantir que `backend/seed.js` e `historico/backend-scripts/seed-menu.sql` continuem alinhados ao schema final.

**Step 4: Re-run search to verify cleanup**

Run: `rg -n "\\bconta_id\\b|\\bcontas\\b|assinaturas\\.cliente_id" backend scripts -S`

Expected: apenas ocorrências intencionais em migração/backward compatibility.

**Step 5: Commit**

```bash
git add backend/seed.js historico/backend-scripts/seed-menu.sql scripts/seed-vps.sh scripts/seed-swarm.sh historico/sql/2026-06-10_rename-clientes.sql
git commit -m "chore: align seeds and ops scripts with cliente rename"
```

---

### Task 5: Atualizar documentação e guias operacionais

**Files:**
- Modify: `README.md`
- Modify: `docs/arquitetura.md`
- Modify: `docs/modulos.md`
- Modify: `docs/regra-cliente-usuario.md`
- Modify: `docs/database.md`

**Step 1: Write the documentation diff checklist**

Checklist:
- remover estrutura antiga de diretórios no README;
- trocar descrições “conta” → “cliente” onde o estado final já mudou;
- documentar compatibilidade temporária `contaId` apenas onde ela ainda existir;
- alinhar módulo “clientes” vs `usuarios`/`Cliente`.

**Step 2: Review current docs against implementation**

Run: `rg -n "\\bconta\\b|\\bcontas\\b|contaId|ClienteApi|módulo clientes|modulo clientes" README.md docs -S`

Expected: mapa de pontos a atualizar.

**Step 3: Write minimal documentation updates**

- Atualizar exemplos, diagramas e nomenclatura.
- Não apagar contexto histórico de migração quando isso ainda ajudar operação.

**Step 4: Re-run doc search**

Run: `rg -n "\\bconta\\b|\\bcontas\\b|contaId|ClienteApi" README.md docs -S`

Expected: apenas referências históricas ou explicitamente documentadas.

**Step 5: Commit**

```bash
git add README.md docs/arquitetura.md docs/modulos.md docs/regra-cliente-usuario.md docs/database.md
git commit -m "docs: update docs for cliente rename"
```

---

### Task 6: Verificação final da renomeação

**Files:**
- Verify: `backend/src/app.module.ts`
- Verify: `frontend/src/app/services/auth.service.ts`
- Verify: `historico/sql/2026-06-10_rename-clientes.sql`
- Verify: `backend/test/*.spec.ts`

**Step 1: Run backend test suite**

Run: `cd backend; node -r ts-node/register/transpile-only --test .\\test\\*.spec.ts`

Expected: PASS.

**Step 2: Run frontend build**

Run: `cd frontend; npm run build`

Expected: PASS.

**Step 3: Run targeted grep for stragglers**

Run: `rg -n "\\bcontaId\\b|\\bconta_id\\b|\\bcontas\\b|\\bconta\\b" backend/src frontend/src scripts README.md docs -S`

Expected: apenas ocorrências permitidas em migração, SQL histórico ou fallback explícito.

**Step 4: Sanity-check migration order docs**

Run: `Get-Content historico/sql/2026-06-10_ajustes-completos.sql -TotalCount 40; Get-Content historico/sql/2026-06-10_dados-negocio-conta.sql -TotalCount 30; Get-Content historico/sql/2026-06-10_rename-clientes.sql -TotalCount 40`

Expected: ordem e pré-requisitos coerentes.

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: finalize cliente rename verification"
```
