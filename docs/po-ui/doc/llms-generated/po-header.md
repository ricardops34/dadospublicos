# PoHeaderComponent

**Seletor:** `po-header`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-header

O componente `po-header` é um cabeçalho fixo que permite apresentar itens com ações, divididos em `p-brand`, `p-menu-items`, `p-actions-tools` e `p-header-user`.

- `p-brand`: Possibilita a inclusão de uma imagem e o titulo do header.
- `p-menu-items`: Possibilita a inclusão de uma lista de itens com ações ou links.
- `p-actions-tools`: Possibilita a inclusão de até 3 botões com ações.
- `p-header-user`: Possibilita a inclusão de uma imagem representando a marca e avatar.

O componente `po-header` pode ser usado de duas formas:

Com `po-menu` definido pelo usuário:
```
...
<po-header
  [p-brand]="brand"
  [p-menu-items]="items"
  [p-actions-tools]="actions"
  [p-header-user]="user"
></po-header>

<div class="po-wrapper">
  <po-menu [p-menus]="itemsMenu">
  </po-menu>

  <po-page-default>
      <router-outlet></router-outlet>
  </po-page-default>
</div>
...
```

Passando os itens diretamente para o `po-header` pela propriedade `p-menus`:
```
...
<po-header
  [p-brand]="brand"
  [p-menu-items]="items"
  [p-actions-tools]="actions"
  [p-header-user]="user"
  [p-menus]="itensMenu"
></po-header>

<div class="po-wrapper">
  <po-page-default>
      <router-outlet></router-outlet>
  </po-page-default>
</div>
...
```

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|------------------------------------------|------------------------------------------------------------|---------------------------------------------------|
| `--font-family` | Família tipográfica usada | `var(--font-family-theme)` |
| `--font-weight` | Peso da fonte | `var(--font-weight-bold)` |
| `--text-color` | Cor do texto | `var(--color-neutral-dark-70)` | | --- |
| `--outline-color-focused` | Cor do outline dos itens de sub-menu e customer | `var(--color-neutral-dark-95)` | | --- |
| `--object-fit-brand` | Valor do object-fit da imagem do logo | `contain` | | --- |
| `--object-fit-customer` | Valor do object-fit da imagem do logo na seção customer | `contain` | | --- |
| `--object-fit-customer-user` | Valor do object-fit da imagem do avatar | `cover` | | --- |
| **Header** | | |
| `--background-color` | Cor de background do header | `var(--color-neutral-light-05)` |
| `--border-radius-bottom-left` | Valor do radius do lado esquerdo do header | `var(--border-radius-md)` |
| `--border-radius-bottom-right` | Valor do radius do lado direito do header | `var(--border-radius-md)` |
| `--base shadow` | Cor da sombra do header | `0 1px 8px rgba(0, 0, 0, 0.1)` |
| `--stroke-color` | Cor da borda inferior do header | `var(--color-brand-01-base)` |
| **Sub-menu** | | |
| `--border-radius` | Valor do radius dos itens do sub-menu | `var(--border-radius-md);` |
| `--text-color-submenu` | Cor do texto dos itens do sub-menu | `var(--color-brand-01-base)` |
| `--icon-color` | Cor do ícone do sub-menu com itens | `var(--color-brand-01-base)` |
| `--border-color` | Cor da borda | `var(--color-transparent)` |
| `--shadow` | Contém o valor da sombra do elemento | `var(--shadow-none)` |
| `--font-family-submenu` | Fonte do texto dos itens de sub-menu | `var(--font-family-theme)` |
| `--font-weight-submenu` | Peso da fonte do texto dos itens de sub-menu | `var(--font-weight-bold)` |
| **Sub-menu - Hover** | | |
| `--background-hover` | Cor de background dos itens do sub-menu no estado hover | `var(--color-brand-01-lighter)` |
| `--icon-color-hover` | Cor do ícone dos itens de sub-menu no estado hover | `var(--color-brand-01-darkest)` |
| `--text-color-hover` | Cor do texto dos itens de sub-menu no estado hover | `var(--color-brand-01-darkest)` |
| **Sub-menu - pressed** | | |
| `--background-pressed` | Cor de background dos itens do sub-menu no estado pressed | `var(--color-brand-01-light)` |
| `--icon-color-pressed` | Cor do ícone dos itens de sub-menu no estado pressed | `var(--color-brand-01-darkest)` |
| `--text-color-pressed` | Cor do texto dos itens de sub-menu no estado pressed | `var(--color-brand-01-darkest)` |
| **Sub-menu - selected** | | |
| `--background-selected` | Cor de background dos itens do sub-menu no estado selected | `var(--color-brand-01-light)` |
| `--icon-color-selected` | Cor do ícone dos itens de sub-menu no estado selected | `var(--color-neutral-dark-95)` |
| `--text-color-selected` | Cor do texto dos itens de sub-menu no estado selected | `var(--color-brand-01-darkest)` |
| **Customer** | | |
| `--background-color-customer` | Cor do background da seção customer | `var(--color-neutral-light-00)` |
| `--border-color` | Cor da borda da seção customer | `var(--color-neutral-light-10)` |
| `--border-style` | Estilo da borda da seção customer | `solid` |
| `--border-width` | Largura da borda da seção customer | `var(--border-width-sm)` |
| **Customer - hover** | | |
| `--background-color-customer-hover` | Cor do background da seção customer no estado hover | `var(--color-brand-01-lighter)` |
| **Customer - pressed** | | |
| `--background-color-customer-pressed` | Cor do background da seção customer no estado pressed | `var(--color-brand-01-light)` |
| `--border-width-pressed` | Largura da borda da seção customer no estado pressed | `var(--border-width-md)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `actionsTools` | `'p-actions-tools'` | `Array<PoHeaderActionTool>` | sim | - | Propriedade para configurar a seção de tools do `po-header` |
| `amountMore` | `'p-amount-more'` | `number` | sim | - | Número de itens dentro do botão de overflow. Caso a largura do header não suportar a quantidade de itens passadas, um botão com itens será criado. |
| `brand` | `'p-brand'` | `PoHeaderBrand | string` | sim | - | Propriedade para configurar a seção de brand do `po-header` |
| `filterMenu` | `'p-filter-menu'` | `boolean` | sim | - | Habilita campo para filtrar itens no menu |
| `headerTemplate` | `'p-header-template'` | `TemplateRef<any>` | sim | - | Template customiado que será renderizado após os itens definidos na propriedade `p-menu-items` |
| `headerUser` | `'p-header-user'` | `PoHeaderUser` | sim | - | Propriedade para configurar a seção de headerUser do `po-header` |
| `hideButtonMenu` | `'p-hide-button-menu'` | `boolean` | sim | - | Esconde o botão de menu colapsado. |
| `literals` | `'p-literals'` | `PoHeaderLiterals` | sim | - | Objeto com a literal usada na propriedade `p-literals`. |
| `menuCollapse` | `'p-menus'` | `Array<PoMenuItem>` | sim | - | Lista dos itens do menu. Se o valor estiver indefinido ou inválido, será inicializado como um array vazio. |
| `menuItems` | `'p-menu-items'` | `Array<PoHeaderActions>` | sim | - | Propriedade para configurar a seção de menu do `po-header`. |
| `sizeInput` | `p-size` | `string` | sim | `medium` | Define o tamanho do componente: |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `colapsedMenuEvent` | `'p-colapsed-menu'` | `EventEmitter` | Evento emitido ao clicar no botão para colapsar ou expandir menu. |
