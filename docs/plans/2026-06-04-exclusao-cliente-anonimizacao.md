# Exclusao de Cliente com Anonimizacao Agendada Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Restaurar a opcao de exclusao na area do cliente e no admin, separar fluxo de exclusao definitiva para clientes sem plano pago do fluxo de anonimização agendada para clientes com plano pago, adicionar a opcao de desistir da exclusao antes do prazo e revisar caracteres especiais quebrados nas telas de CRUD.

**Architecture:** O frontend volta a expor a acao de exclusao em `Minha Conta` e, quando o cliente estiver em onboarding, tambem dentro do fluxo de primeiro acesso ou por liberacao controlada da rota. O backend passa a decidir o fluxo com base no estado da assinatura e persiste estados de exclusao agendada e cancelamento em campos do cliente, preservando anonimização definitiva apenas no worker/cron ou na exclusao imediata de clientes sem plano pago. O admin deixa de usar exclusao cega e reaproveita a mesma regra de negocio do cliente, com UX administrativa propria sobre os componentes ativos de clientes.

**Tech Stack:** Angular 21, PO-UI 21, NestJS 11, TypeORM 0.3, PostgreSQL 16, testes Node `node:test`.

---

## Regra de negocio validada

1. Cliente sem plano pago:
   - Pode excluir definitivamente.
   - Deve receber aviso claro e confirmacao explicita no frontend.
   - O backend anonimiza imediatamente e encerra acessos.

2. Cliente com plano pago:
   - Nao exclui imediatamente.
   - O sistema agenda a anonimização.
   - O cliente pode desistir da exclusao antes do prazo.
   - A execucao final ocorre por cron/job no prazo agendado.

3. Onboarding:
   - A opcao de exclusao nao pode ficar invisivel para cliente bloqueado no wizard.
   - A acao precisa existir em local acessivel mesmo quando `onboardingPendente = true`.

4. Admin:
   - Deve seguir a mesma regra do cliente.
   - Nao pode mais executar anonimização imediata para cliente com plano pago.
   - Deve conseguir agendar exclusao, visualizar exclusao agendada e desistir da exclusao antes do prazo.

5. Caracteres especiais nas telas:
   - Revisar textos quebrados por encoding nas telas ativas de CRUD.
   - Garantir que rotulos como `Pessoa Física` e `Pessoa Jurídica` aparecam corretamente.
   - Revisar especialmente CRUD de clientes e telas relacionadas que exibem tipo de pessoa.

6. Ajustes esperados:
   - Reaproveitar `agendarExclusaoEm`.
   - Adicionar estado/campos auxiliares so se forem realmente necessarios.
   - Nao reutilizar componentes legados mortos para restaurar a UX.

---

### Task 1: Mapear e fixar o contrato unificado da exclusao para cliente e admin

**Files:**
- Modify: `backend/src/modules/clientes/dto/create-cliente.dto.ts`
- Modify: `backend/src/modules/clientes/clientes.controller.ts`
- Modify: `backend/src/modules/clientes/clientes.service.ts`
- Test: `backend/test/clientes.service.spec.ts`

**Step 1: Write the failing tests**

Cobrir estes cenarios:
- `agendarExclusao('agora')` para cliente sem plano pago chama anonimização imediata.
- `agendarExclusao('agora')` para cliente com plano pago nao anonimiza imediatamente; grava estado agendado.
- `agendarExclusaoAdmin()` aplica a mesma decisao de fluxo usada no portal do cliente.
- `cancelarExclusao()` limpa o agendamento quando ainda dentro do prazo.
- `cancelarExclusaoAdmin()` tambem limpa o agendamento quando permitido.
- cron processa apenas clientes com prazo vencido.

**Step 2: Run test to verify it fails**

Run: `node -r ts-node/register/transpile-only --test .\test\clientes.service.spec.ts`
Expected: FAIL por ausencia dos novos cenarios.

**Step 3: Define the API contract**

Adicionar ou ajustar endpoints:
- `POST /clientes/me/agendar-exclusao`
- `POST /clientes/me/cancelar-exclusao`
- `POST /clientes/:id/agendar-exclusao`
- `POST /clientes/:id/cancelar-exclusao`

Definir resposta minima:
- `mensagem`
- `agendarExclusaoEm`
- `tipoFluxo: 'exclusao-imediata' | 'anonimizacao-agendada'`

**Step 4: Implement the minimal controller changes**

Em `clientes.controller.ts`:
- manter `agendar-exclusao`
- criar `cancelar-exclusao`
- substituir o uso semantico do `DELETE /clientes/:id` como exclusao administrativa cega
- criar endpoints admin explicitos para agendar/cancelar exclusao

**Step 5: Run tests again**

Run: `node -r ts-node/register/transpile-only --test .\test\clientes.service.spec.ts`
Expected: ainda FAIL ate a regra de service ser implementada.

---

### Task 2: Implementar a regra de fluxo por tipo de cliente e reaproveitar no admin

**Files:**
- Modify: `backend/src/modules/clientes/clientes.service.ts`
- Modify: `backend/src/entities/cliente.entity.ts`
- Test: `backend/test/clientes.service.spec.ts`

**Step 1: Persist the minimum state needed**

Revisar se `agendarExclusaoEm` basta.

Se nao bastar, adicionar apenas um destes campos:
- `exclusaoSolicitadaEm`
- `exclusaoTipo` com valores `imediata` ou `agendada`

Evitar modelagem excessiva.

**Step 2: Implement business rules**

No `ClientesService`:
- Criar helper `temPlanoPagoAtivo(cliente)` que considere assinatura `ativa` e plano pago.
- Se `temPlanoPagoAtivo = false`, `agendarExclusao('agora')` chama `excluirConta()` na hora.
- Se `temPlanoPagoAtivo = true`, `agendarExclusao(...)` grava `agendarExclusaoEm` e nao anonimiza imediatamente.
- `cancelarExclusao()` limpa o agendamento e preserva a conta.
- `agendarExclusaoAdmin(id, dto)` e `cancelarExclusaoAdmin(id)` devem delegar para a mesma regra central, mudando apenas permissao/contexto.

**Step 3: Preserve immediate anonymization only where allowed**

`excluirConta()` continua sendo o metodo de anonimização final, mas nao deve mais ser chamado no fluxo pago imediatamente.

**Step 4: Run tests**

Run: `node -r ts-node/register/transpile-only --test .\test\clientes.service.spec.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add backend/src/entities/cliente.entity.ts backend/src/modules/clientes/clientes.controller.ts backend/src/modules/clientes/clientes.service.ts backend/src/modules/clientes/dto/create-cliente.dto.ts backend/test/clientes.service.spec.ts
git commit -m "feat: split customer deletion into immediate and scheduled flows"
```

---

### Task 3: Corrigir o processamento agendado e a visibilidade no perfil do cliente

**Files:**
- Modify: `backend/src/modules/clientes/clientes.service.ts`
- Modify: `frontend/src/app/pages/portal/cliente/cliente.service.ts`
- Modify: `frontend/src/app/pages/portal/cliente/minha-conta/minha-conta.component.ts`
- Modify: `frontend/src/app/pages/portal/cliente/minha-conta/minha-conta.component.html`
- Test: `backend/test/clientes.service.spec.ts`

**Step 1: Return the scheduled state to the frontend**

Garantir que `meuPerfil()` devolva:
- `agendarExclusaoEm`
- eventual `exclusaoTipo`

**Step 2: Fix cron semantics**

Em `processarExclusoesAgendadas()`:
- processar apenas quem tem `agendarExclusaoEm <= agora`
- nao depender de fluxo antigo de desativacao imediata

**Step 3: Restore the danger zone UX**

Na `Minha Conta`:
- mostrar botao de exclusao quando nao houver agendamento
- mostrar estado agendado quando houver agendamento
- mostrar botao `Desistir da exclusao` quando houver agendamento

**Step 4: Support both UX branches**

Fluxo sem plano pago:
- modal com texto forte de irreversibilidade
- confirmacao explicita

Fluxo com plano pago:
- modal com data prevista
- informacao de que a conta podera ser preservada se o cliente desistir antes do prazo

**Step 5: Verify**

Run:
- `node -r ts-node/register/transpile-only --test .\test\clientes.service.spec.ts`
- `npm run build`

Expected:
- backend tests PASS
- backend build PASS

---

### Task 4: Tornar a exclusao acessivel mesmo com onboarding pendente

**Files:**
- Modify: `frontend/src/app/pages/portal/portal-shell.component.ts`
- Modify: `frontend/src/app/guards/cliente-onboarding.guard.ts`
- Modify: `frontend/src/app/pages/portal/portal.module.ts`
- Modify: `frontend/src/app/pages/portal/cliente/primeiro-acesso/primeiro-acesso.component.ts`
- Possibly modify: `frontend/src/app/pages/portal/cliente/primeiro-acesso/primeiro-acesso.module.ts`

**Step 1: Choose the least invasive UX**

Recomendacao:
- manter o guard para areas normais
- permitir acesso a `minha-conta` mesmo com onboarding pendente

Alternativa:
- duplicar a acao de exclusao no wizard

Preferencia tecnica:
- liberar `Minha Conta` no guard e no menu de onboarding

**Step 2: Implement route/menu adjustment**

Em `portal-shell.component.ts`:
- adicionar `Minha Conta` ao menu de onboarding

Em `cliente-onboarding.guard.ts`:
- permitir excecao para rota `minha-conta`

Se o guard funcional ficar complexo, substituir por estrategia mais clara baseada em `state.url`.

**Step 3: Verify manually**

Casos:
- cliente novo enxerga `Minha Conta`
- cliente novo continua bloqueado de dashboard/recursos
- cliente novo consegue abrir exclusao

**Step 4: Build frontend**

Run: `npm run build`
Expected: PASS

**Step 5: Commit**

```bash
git add frontend/src/app/pages/portal/portal-shell.component.ts frontend/src/app/guards/cliente-onboarding.guard.ts frontend/src/app/pages/portal/portal.module.ts frontend/src/app/pages/portal/cliente/minha-conta/minha-conta.component.ts frontend/src/app/pages/portal/cliente/minha-conta/minha-conta.component.html frontend/src/app/pages/portal/cliente/cliente.service.ts frontend/src/app/pages/portal/cliente/primeiro-acesso/primeiro-acesso.component.ts
git commit -m "feat: restore customer deletion access during onboarding"
```

---

### Task 5: Adicionar endpoint e UX de desistir da exclusao

**Files:**
- Modify: `backend/src/modules/clientes/clientes.controller.ts`
- Modify: `backend/src/modules/clientes/clientes.service.ts`
- Modify: `frontend/src/app/pages/portal/cliente/cliente.service.ts`
- Modify: `frontend/src/app/pages/portal/cliente/minha-conta/minha-conta.component.ts`
- Modify: `frontend/src/app/pages/portal/cliente/minha-conta/minha-conta.component.html`
- Test: `backend/test/clientes.service.spec.ts`

**Step 1: Write failing test for cancellation**

Cobrir:
- cliente com exclusao agendada cancela com sucesso
- cliente sem agendamento recebe erro coerente
- cliente ja anonimizado nao pode cancelar

**Step 2: Implement backend cancellation**

Adicionar `cancelarExclusao(clienteId)`:
- validar existencia do cliente
- validar `agendarExclusaoEm`
- limpar campos de agendamento
- retornar mensagem clara

**Step 3: Implement frontend cancellation**

Na tela `Minha Conta`:
- quando `agendarExclusaoEm` existir, trocar parte da `Zona de perigo` por bloco de estado
- mostrar:
  - data da anonimização prevista
  - botao `Desistir da exclusao`

**Step 4: Verify**

Run:
- `node -r ts-node/register/transpile-only --test .\test\clientes.service.spec.ts`
- `npm run build`

Expected:
- backend tests PASS
- frontend build PASS

---

### Task 6: Implementar a mesma regra no fluxo admin de clientes

**Files:**
- Modify: `frontend/src/app/pages/portal/admin/admin.service.ts`
- Modify: `frontend/src/app/pages/portal/admin/clientes/clientes-list.component.ts`
- Modify: `frontend/src/app/pages/portal/admin/clientes/clientes-detail.component.ts`
- Possibly create/modify: componentes de acao/modal ativos no modulo de clientes
- Modify: `backend/src/modules/clientes/clientes.controller.ts`
- Modify: `backend/src/modules/clientes/clientes.service.ts`
- Test: `backend/test/clientes.service.spec.ts`

**Step 1: Map the active admin UI**

Confirmar em qual componente ativo a acao de exclusao deve aparecer:
- listagem
- detalhe
- ambos

Recomendacao:
- detalhe do cliente para a acao principal
- listagem apenas com atalho se ja houver padrao de acoes perigosas

**Step 2: Replace blind delete semantics**

Em `admin.service.ts`:
- parar de tratar exclusao como `DELETE` simples
- criar metodos para:
  - `agendarExclusaoCliente`
  - `cancelarExclusaoCliente`

**Step 3: Build admin UX parity**

Na tela ativa do admin:
- sem plano pago: mostrar confirmacao de exclusao definitiva
- com plano pago: mostrar agendamento e data prevista
- com exclusao agendada: mostrar estado e acao `Desistir da exclusao`

**Step 4: Verify**

Run:
- `node -r ts-node/register/transpile-only --test .\test\clientes.service.spec.ts`
- `npm run build` em `frontend`

Expected:
- backend tests PASS
- frontend build PASS

**Step 5: Commit**

```bash
git add frontend/src/app/pages/portal/admin/admin.service.ts frontend/src/app/pages/portal/admin/clientes backend/src/modules/clientes/clientes.controller.ts backend/src/modules/clientes/clientes.service.ts backend/test/clientes.service.spec.ts
git commit -m "feat: align admin deletion flow with customer rules"
```

---

### Task 7: Revisar textos, confirmacoes, caracteres especiais e riscos

**Files:**
- Modify: `frontend/src/app/pages/portal/cliente/minha-conta/minha-conta.component.html`
- Modify: `frontend/src/app/pages/portal/cliente/minha-conta/minha-conta.component.ts`
- Modify: `frontend/src/app/pages/portal/admin/clientes/clientes-form.component.ts`
- Modify: `frontend/src/app/pages/login/login.component.ts`
- Modify: outras telas ativas de CRUD que exibam tipo de pessoa
- Possibly modify: `docs/frontend.md`

**Step 1: Align copy for each flow**

Textos obrigatorios:
- sem plano pago: exclusao definitiva, irreversivel
- com plano pago: anonimização agendada, reversivel ate o prazo
- revisar labels com caracteres especiais:
  - `Pessoa Física`
  - `Pessoa Jurídica`
  - `Razão Social`
  - `Município`
  - outros labels quebrados no CRUD ativo

**Step 2: Add explicit confirmation**

Para exclusao definitiva, exigir confirmacao adicional no modal.

Opcoes simples:
- checkbox de ciencia
- digitacao curta de confirmacao

Recomendacao:
- checkbox de ciencia para evitar aumento desnecessario de friccao

**Step 3: Smoke test**

Casos:
- cliente sem plano pago exclui definitivamente
- cliente com plano pago agenda exclusao
- cliente com plano pago cancela exclusao
- cliente com exclusao vencida e processada nao consegue mais entrar
- labels `Física` e `Jurídica` aparecem corretamente nas telas ativas de CRUD
- revisar visualmente login/cadastro, wizard e CRUD admin de clientes

**Step 4: Final verification**

Run:
- `node -r ts-node/register/transpile-only --test .\test\clientes.service.spec.ts`
- `npm run build` em `backend`
- `npm run build` em `frontend`

Expected: tudo PASS

---

## Notes for implementation

- Nao reutilizar o HTML legado de `frontend/src/app/pages/portal/admin/clientes/clientes.component.html` para esta feature.
- O fluxo admin deve usar a mesma regra de negocio do cliente, mudando apenas permissao e contexto de interface.
- A validacao de saldo financeiro nao existe hoje. Se virar requisito real, ela precisa ser especificada separadamente:
  - saldo credor a devolver
  - faturas pendentes que bloqueiam desistir ou excluir
  - creditos de upgrade que nao devem ser tratados como saldo de conta
- A regra “cliente com plano pago” deve ser implementada por assinatura/plano real, nao apenas por `tem assinatura ativa`.
- A revisao de caracteres especiais deve focar componentes ativos; arquivos legados com encoding ruim so devem ser mexidos se voltarem a participar da aplicacao.
