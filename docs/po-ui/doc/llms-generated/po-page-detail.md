# PoPageDetailComponent

**Seletor:** `po-page-detail`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-detail

O componente **po-page-detail** é utilizado como container principal para a tela de
detalhamento de um registro, tendo a possibilidade de usar as ações de "Voltar", "Editar" e "Remover".

#### Tokens customizáveis

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|---------------------|---------------------------------------------|---------------------------------------|
| **Header** | | |
| `--padding` | Espaçamento do header | `var(--spacing-xs) var(--spacing-md)` |
| `--gap` | Espaçamento entre os breadcrumbs e o título | `var(--spacing-md)` |
| `--gap-actions` | Espaçamento entre as ações | `var(--spacing-xs)` |
| `--font-family` | Família tipográfica do título | `var(--font-family-theme)` |
| **Content** | | |
| `--padding-content` | Espaçamento do conteúdo | `var(--spacing-xs) var(--spacing-sm)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `breadcrumb` | `'p-breadcrumb'` | `PoBreadcrumb` | não | - | Objeto com propriedades do breadcrumb. |
| `componentsSize` | `'p-components-size'` | `string` | sim | `medium` | Define o tamanho dos componentes de formulário no template: |
| `literals` | `'p-literals'` | `PoPageDetailLiterals` | sim | - | Objeto com as literais usadas no `po-page-detail`. |
| `subtitle` | `'p-subtitle'` | `string` | sim | - | Subtitulo do Header da página |
| `title` | `'p-title'` | `string` | não | - | Título da página. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `back` | `'p-back'` | `EventEmitter` | Evento que será disparado ao clicar no botão de "Voltar". |
| `edit` | `'p-edit'` | `EventEmitter` | Evento que será disparado ao clicar no botão de "Editar". |
| `remove` | `'p-remove'` | `EventEmitter` | Evento que será disparado ao clicar no botão de "Remover". |
