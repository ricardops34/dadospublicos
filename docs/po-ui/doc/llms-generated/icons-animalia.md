# Guia de Ícones — PO-UI v21+ (Animalia Icons)

> **Versão de referência:** `@po-ui/ng-components` **v21.15.0**  
> **Data:** 2026-05-22  
> **Contexto:** Projeto `rcgcrm` — frontend Angular 21

---

## ⚠️ Mudança crítica: `po-icon-*` foi descontinuado

O PO-UI **v21 abandonou completamente** a biblioteca de ícones `po-icon-*` (ex: `po-icon-home`, `po-icon-user`).  
A nova biblioteca é a **Animalia Icons**, com prefixo `an an-*`.

| Versão PO-UI | Prefixo | Exemplo |
|---|---|---|
| Até v17 | `po-icon-*` | `po-icon-home` |
| **v21+** ✅ | `an an-*` | `an an-house` |

> Ícones `po-icon-*` simplesmente **não renderizam** — não há fallback nem erro visível.

---

## Como usar

### Em TypeScript (PoMenuItem, PoTableAction, PoToolbarAction, etc.)
```typescript
// ✅ Correto — Animalia Icons
{ label: 'Home', icon: 'an an-house' }
{ label: 'Usuários', icon: 'an an-user' }
{ label: 'Sair', icon: 'an an-sign-out' }

// ❌ Errado — po-icon-* não existe mais no v21
{ label: 'Home', icon: 'po-icon-home' }
```

### No banco de dados (`system_module.icon` / `system_program.icon`)
```sql
-- ✅ Correto
UPDATE system_module SET icon = 'an an-gear-six' WHERE name = 'Administração';

-- ❌ Errado
UPDATE system_module SET icon = 'po-icon-settings' WHERE name = 'Administração';
```

### No HTML (po-button, po-page-action, etc.)
```html
<!-- ✅ Correto -->
<po-button p-icon="an an-plus" p-label="Novo"></po-button>
<po-button p-icon="an an-trash" p-kind="danger" p-label="Excluir"></po-button>

<!-- ❌ Errado -->
<po-button p-icon="po-icon-plus" p-label="Novo"></po-button>
```

### Variante Filled (ícones preenchidos)
```typescript
// Use o prefixo 'an-fill' ao invés de 'an' para versão preenchida
{ icon: 'an-fill an-funnel' }      // funil preenchido
{ icon: 'an-fill an-sort-ascending' }
```

---

## Regra de uso no po-menu

> **Documentação oficial:** O `po-menu` suporta ícones **apenas no 1º nível** (módulos/grupos).  
> O menu pode ser **colapsado** somente se **todos** os itens de 1º nível tiverem `icon` E `shortLabel`.

```typescript
// ✅ Correto — permite colapsar o menu
this.dynamicMenus = [{
  label: 'CRM',
  shortLabel: 'CRM',        // obrigatório para colapso
  icon: 'an an-users',      // obrigatório para colapso
  subItems: [...]
}];
```

---

## Tabela de conversão — po-icon-* → an an-*

### Ícones usados no rcgcrm

| Contexto | `po-icon-*` (descontinuado) | `an an-*` (v21+) |
|---|---|---|
| Início / Home | `po-icon-home` | `an an-house` |
| Usuário | `po-icon-user` | `an an-user` |
| Usuários | `po-icon-users` | `an an-users` |
| Novo Usuário | `po-icon-user-add` | `an an-user-plus` |
| Perfil | `po-icon-user` | `an an-user-circle` |
| Configurações | `po-icon-settings` | `an an-gear-six` |
| Sair / Logout | `po-icon-exit` | `an an-sign-out` |
| Calendário | `po-icon-calendar` | `an an-calendar-blank` |
| Calendário c/ pontos | `po-icon-calendar` | `an an-calendar-dots` |
| Olho / Visualizar | `po-icon-eye` | `an an-eye` |
| Gráfico / Meta | `po-icon-chart-bar` | `an an-chart-bar` |
| Aperto de mão | `po-icon-handshake` | `an an-handshake` |
| Financeiro / $  | `po-icon-finance` | `an an-currency-dollar-simple` |
| Documento | `po-icon-document` | `an an-file-text` |
| Caixa / Embalagem | `po-icon-box` | `an an-package` |
| Recibo | _(sem equivalente)_ | `an an-receipt` |
| Lista | `po-icon-list` | `an an-list-dashes` |
| Carrinho | `po-icon-cart` | `an an-shopping-cart` |
| Etiqueta / Tag | `po-icon-list` | `an an-tag` |
| Info | `po-icon-info` | `an an-info` |
| Empresa | `po-icon-company` | `an an-buildings` |
| Sidebar / Menu | `po-icon-vendas` | `an an-sidebar-simple` |
| Terminal / Código | `po-icon-xml` | `an an-terminal-window` |
| Mais / Adicionar | `po-icon-plus` | `an an-plus` |
| Editar | `po-icon-edit` | `an an-pencil-simple` |
| Excluir | `po-icon-delete` | `an an-trash` |
| Pesquisar | `po-icon-search` | `an an-magnifying-glass` |
| Filtro | `po-icon-filter` | `an an-funnel` |
| Atualizar | `po-icon-refresh` | `an an-arrow-clockwise` |
| Notificação | `po-icon-notification` | `an an-bell` |
| E-mail | `po-icon-mail` | `an an-envelope-simple` |
| Telefone | `po-icon-phone` | `an an-phone` |
| Link | `po-icon-link` | `an an-link` |
| Estrela | `po-icon-star` | `an an-star` |
| Cadeado | `po-icon-lock` | `an an-lock` |
| Ajuda | `po-icon-help` | `an an-question` |
| Aviso | `po-icon-warning` | `an an-warning-circle` |
| Ok / Check | `po-icon-ok` | `an an-check` |
| Fechar / X | `po-icon-close` | `an an-x` |
| Mundo / Globe | `po-icon-world` | `an an-globe-simple` |
| Upload | `po-icon-upload` | `an an-cloud-arrow-up` |
| Foto | `po-icon-picture` | `an an-image` |
| Jornal | `po-icon-newspaper` | `an an-newspaper` |
| Paleta | `po-icon-pallet` | `an an-paint-brush` |
| Grid / Apps | `po-icon-grid` | `an an-grid-four` |
| Chat / Mensagens | `po-icon-chat` | `an an-chat-circle` |
| Parâmetros | _(sem equivalente)_ | `an an-sliders-horizontal` |
| Localização | _(sem equivalente)_ | `an an-map-pin` |
| Cartão | _(sem equivalente)_ | `an an-credit-card` |

---

## Catálogo completo — ícones disponíveis no PO-UI v21.15.0

Extraídos diretamente do `AnimaliaIconDictionary` do pacote instalado.

### Navegação e Setas
| Classe CSS | Descrição |
|---|---|
| `an an-arrow-left` | Seta esquerda |
| `an an-arrow-right` | Seta direita (via caret) |
| `an an-arrow-up` | Seta acima |
| `an an-arrow-down` | Seta abaixo |
| `an an-arrow-arc-left` | Seta arc esquerda |
| `an an-arrow-clockwise` | Atualizar / Refresh |
| `an an-arrows-down-up` | Ordenar |
| `an an-caret-left` | Caret esquerda |
| `an an-caret-right` | Caret direita |
| `an an-caret-up` | Caret acima |
| `an an-caret-down` | Caret abaixo |
| `an an-caret-circle-left` | Menu fechar |
| `an an-caret-circle-right` | Menu abrir |
| `an an-caret-double-right` | Última página |
| `an an-corners-out` | Expandir |
| `an an-sign-out` | Sair / Logout |

### Usuários e Pessoas
| Classe CSS | Descrição |
|---|---|
| `an an-user` | Usuário |
| `an an-users` | Usuários / Grupo |
| `an an-user-plus` | Adicionar usuário |
| `an an-user-circle` | Perfil circular |

### Calendário e Tempo
| Classe CSS | Descrição |
|---|---|
| `an an-calendar-blank` | Calendário |
| `an an-calendar-dots` | Calendário com eventos |
| `an an-clock` | Relógio |

### Dados e Documentos
| Classe CSS | Descrição |
|---|---|
| `an an-file-text` | Arquivo / Documento |
| `an an-newspaper` | Jornal / Notícia |
| `an an-list` | Lista simples |
| `an an-list-dashes` | Lista com traços |
| `an an-list-bullets` | Lista com pontos |
| `an an-copy` | Copiar |
| `an an-link` | Link |
| `an an-download` | Download |
| `an an-cloud-arrow-up` | Upload para nuvem |

### Negócios e Finanças
| Classe CSS | Descrição |
|---|---|
| `an an-currency-dollar-simple` | Dinheiro / Financeiro |
| `an an-receipt` | Recibo |
| `an an-credit-card` | Cartão de crédito |
| `an an-handshake` | Negociação |
| `an an-shopping-cart` | Carrinho / Compra |
| `an an-package` | Pacote / Caixa |
| `an an-tractor` | Agronegócio |
| `an an-gas-pump` | Combustível |

### Interface e Sistema
| Classe CSS | Descrição |
|---|---|
| `an an-gear-six` | Configurações |
| `an an-sliders-horizontal` | Parâmetros |
| `an an-sidebar` | Sidebar |
| `an an-sidebar-simple` | Sidebar simples / Módulos |
| `an an-terminal-window` | Terminal / Código |
| `an an-grid-four` | Grade / Apps |
| `an an-dots-three` | Mais opções |
| `an an-dots-three-vertical` | Mais opções (vertical) |
| `an an-dots-six-vertical` | Arrastar |
| `an an-push-pin` | Fixar |
| `an an-push-pin-slash` | Desafixar |

### Ações CRUD
| Classe CSS | Descrição |
|---|---|
| `an an-plus` | Adicionar |
| `an an-minus` | Remover |
| `an an-pencil-simple` | Editar |
| `an an-pencil-simple-line` | Editar (outline) |
| `an an-trash` | Excluir |
| `an an-magnifying-glass` | Pesquisar |
| `an an-funnel` | Filtrar |
| `an an-funnel-simple` | Filtrar simples |
| `an an-funnel-x` | Limpar filtro |
| `an an-x` | Fechar |
| `an an-x-circle` | Limpar / Fechar |
| `an an-check` | Ok / Confirmado |
| `an an-check-circle` | Ok (circular) |
| `an an-check-fat` | Ok (negrito) |

### Status e Feedback
| Classe CSS | Descrição |
|---|---|
| `an an-info` | Informação |
| `an an-question` | Ajuda |
| `an an-warning-circle` | Aviso |
| `an an-exclamation-mark` | Exclamação |
| `an an-prohibit` | Proibido |
| `an an-bell` | Notificação |
| `an an-eye` | Visualizar |
| `an an-eye-closed` | Ocultar |
| `an an-lock` | Bloqueado |
| `an an-star` | Favorito |

### Comunicação
| Classe CSS | Descrição |
|---|---|
| `an an-envelope-simple` | E-mail |
| `an an-phone` | Telefone |
| `an an-chat-circle` | Chat / Mensagens |

### Localização
| Classe CSS | Descrição |
|---|---|
| `an an-map-pin` | Localização |
| `an an-globe-simple` | Mundo / Global |
| `an an-buildings` | Empresa / Unidades |
| `an an-house` | Início / Home |

### Mídia
| Classe CSS | Descrição |
|---|---|
| `an an-image` | Imagem / Foto |
| `an an-image-broken` | Imagem quebrada |

### Texto
| Classe CSS | Descrição |
|---|---|
| `an an-text-align-left` | Alinhar à esquerda |
| `an an-text-align-center` | Centralizar |
| `an an-text-align-right` | Alinhar à direita |
| `an an-text-align-justify` | Justificar |
| `an an-text-b` | Negrito |
| `an an-text-italic` | Itálico |
| `an an-text-underline` | Sublinhado |

### Sorting
| Classe CSS | Descrição |
|---|---|
| `an an-sort-ascending` | Ordenar crescente |
| `an an-sort-descending` | Ordenar decrescente |

---

## Script SQL para corrigir banco de dados

Quando novos ícones forem adicionados ou alterados, use o padrão:

```sql
-- Módulo
UPDATE system_module SET icon = 'an an-gear-six' WHERE name = 'Administração';

-- Programa
UPDATE system_program SET icon = 'an an-user' WHERE controller = 'SystemUserList';
```

Arquivo de referência com todos os UPDATEs do projeto:
- `backend/src/database/seeds/fix-icons-animalia.sql`

---

## Links úteis

- **Animalia Icons (fonte):** https://animalia-lib.com/
- **PO-UI Icons (lista visual):** https://po-ui.io/icons
- **PO-UI PoMenuItem:** https://po-ui.io/documentation/po-menu-item
- **PO-UI PoMenu:** https://po-ui.io/documentation/po-menu

---

## Histórico de alterações

| Data | Versão PO-UI | Alteração |
|---|---|---|
| 2026-05-22 | 21.15.0 | Migração completa `po-icon-*` → `an an-*` em app.component.ts, menu-seed.sql e fix-icons-animalia.sql |
