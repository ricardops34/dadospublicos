# Ajustes e Padronização do Módulo de Clientes

**Goal:** Corrigir bugs críticos que impedem uso da área de clientes, adicionar funcionalidades (busca avançada, ações por linha, campo WhatsApp indicador, validação CPF) e padronizar campos/labels conforme requisitos do produto.

**Architecture:** Frontend Angular 21 + PO-UI 21 usa `po-page-dynamic-table` (lista), `po-page-dynamic-edit` (form), `po-page-default` (detalhe). Backend NestJS 11 expõe `/admin/clientes-poui` como ponto único de acesso admin. Campo `whatsapp` é boolean (indicador Sim/Não). TypeORM com `synchronize: true`.

**Tech Stack:** Angular 21, PO-UI 21 (Animalia Icons `an an-*`), NestJS 11, TypeORM 0.3, PostgreSQL 16.

**Status geral:** 🟡 EM DESENVOLVIMENTO

---

## Root Causes Identificados

| Bug | Causa real | Fix |
|-----|-----------|-----|
| Lista inicia vazia | `po-page-dynamic-table` faz `GET /admin/clientes-poui/metadata?type=list` → capturado por `@Get(':id')` → falha → PO-UI não carrega dados | Adicionar `@Get('metadata')` antes de `@Get(':id')` |
| Edit abre em branco | `onLoadData` retorna `{}` → PO-UI usa como model → todos os campos ficam vazios | Mudar `return {}` para `return item` |
| View pode ficar em branco | `findOne` já carrega relations ✓ | Verificado — OK |
| Delete sem tratamento de erro | Exceções do service causam 500 sem mensagem ao usuário | Adicionar try/catch com HttpException 422 |

---

## Task 1: Correção dos Bugs Críticos

**Status:** 🟢 CONCLUÍDO

**Files modificados:**
- `backend/src/modules/clientes/clientes-poui.controller.ts`
- `frontend/src/app/pages/portal/admin/clientes/clientes-form.component.ts`

**Mudanças:**
- Adicionado `@Get('metadata')` antes de `@Get(':id')` no controller
- `onLoadData` corrigido: `return item` (era `return {}`)
- `p-load` e método `onLoad` removidos (desnecessários)
- Estado inicial dos fields ajustado para tipo J (padrão do backend)
- `@Delete(':id')` com try/catch e HttpException 422

---

## Task 2: Campo WhatsApp (Indicador Sim/Não)

**Status:** 🟢 CONCLUÍDO

**Files modificados:**
- `backend/src/entities/cliente.entity.ts`
- `backend/src/modules/clientes/dto/create-cliente.dto.ts`
- `frontend/src/app/pages/portal/admin/clientes/clientes-form.component.ts`
- `frontend/src/app/pages/portal/admin/clientes/clientes-detail.component.ts`

**Mudanças:**
- `whatsapp: boolean | null` adicionado à entity (nullable, default null)
- `@IsBoolean() @IsOptional() whatsapp?: boolean` nos DTOs
- Campo type:'boolean' adicionado ao form após telefone
- Campo exibido no detalhe como Sim/Não/—

---

## Task 3: Reordenação de Campos e Labels

**Status:** 🟢 CONCLUÍDO

**Files modificados:**
- `frontend/src/app/pages/portal/admin/clientes/clientes-form.component.ts`
- `frontend/src/app/pages/portal/admin/clientes/clientes-detail.component.ts`

**Nova ordem:** tipoPessoa → cnpj/cpf → razaoSocial/dataNascimento → nome → email → telefone → whatsapp → senha → endereço

**Labels alterados:** Logradouro → Rua | UF → Estado

---

## Task 4: Ações Customizadas na Lista

**Status:** 🟢 CONCLUÍDO

**Files modificados:**
- `frontend/src/app/pages/portal/admin/clientes/clientes-list.component.ts`

**Ações adicionadas:**
- Ativar (visível quando suspenso)
- Bloquear (visível quando ativo)
- Validar E-mail (visível quando não verificado)
- Reenviar Senha (sempre visível)

**Coluna adicionada:** emailVerificado (Verificado/Pendente)

---

## Task 5: Busca Avançada

**Status:** 🟢 CONCLUÍDO

**Files modificados:**
- `frontend/src/app/pages/portal/admin/clientes/clientes-list.component.ts`
- `backend/src/modules/clientes/clientes.service.ts`

**Filtros adicionados:** nome, email, cpf, cnpj, tipoPessoa, emailVerificado

**Template:** `p-keep-filters`, `p-concat-filters`

---

## Task 6: Validação CPF com Dígitos Verificadores

**Status:** 🟢 CONCLUÍDO

**Files modificados:**
- `backend/src/modules/clientes/clientes-poui.controller.ts`
- `frontend/src/app/pages/portal/admin/clientes/clientes-form.component.ts`

**Endpoint:** `POST /admin/clientes-poui/validate-cpf`

**Validação:** algoritmo de dígitos verificadores + rejeição de sequências repetidas

---

## Verificação End-to-End

- [ ] Lista abre com dados automaticamente
- [ ] Editar cliente → campos preenchidos
- [ ] Visualizar cliente → detalhe completo
- [ ] Excluir cliente → linha some da tabela
- [ ] Ações: Bloquear/Ativar, Validar E-mail, Reenviar Senha
- [ ] Busca avançada com filtros combinados
- [ ] Formulário: tipoPessoa primeiro, campos de J visíveis por padrão
- [ ] CPF inválido → mensagem de erro no campo
- [ ] CEP → preenche apenas campos vazios
- [ ] WhatsApp Sim/Não → salva e exibe no detalhe
- [ ] Labels: Rua, Estado (não Logradouro, UF)
