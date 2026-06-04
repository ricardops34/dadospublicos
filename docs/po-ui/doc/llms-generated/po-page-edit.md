# PoPageEditComponent

**Seletor:** `po-page-edit`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-edit

O componente **po-page-edit** é utilizado como container principal para tela de edição ou adição de um
registro, tendo a possibilidade de usar as ações de "Salvar", "Salvar e Novo" e "Cancelar".

Os botões "Salvar" e "Salvar e Novo" podem ser habilitados/desabilitados utilizando a propriedade `p-disable-submit`.
Esta propriedade pode ser utilizada para desabilitar os botões caso exista um formulário inválido na página ou alguma
regra de negócio não tenha sido atendida.

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
| `breadcrumb` | `'p-breadcrumb'` | `PoBreadcrumb` | sim | - | Objeto com propriedades do breadcrumb. |
| `componentsSize` | `'p-components-size'` | `string` | sim | `medium` | Define o tamanho dos componentes de formulário no template: |
| `disableSubmit` | `'p-disable-submit'` | `boolean` | sim | - | Desabilita botões de submissão (save e saveNew) |
| `literals` | `'p-literals'` | `PoPageEditLiterals` | sim | - | Objeto com as literais usadas no `po-page-edit`. |
| `subtitle` | `'p-subtitle'` | `string` | sim | - | Subtitulo do Header da página |
| `title` | `'p-title'` | `string` | não | - | Título da página. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `cancel` | `'p-cancel'` | `EventEmitter` | Evento que será disparado ao clicar no botão de "Cancelar". |
| `save` | `'p-save'` | `EventEmitter` | Evento que será disparado ao clicar no botão de "Salvar". |
| `saveNew` | `'p-save-new'` | `EventEmitter` | Evento que será disparado ao clicar no botão de "Salvar e Novo". |
