# PoContextMenuComponent

**Seletor:** `po-context-menu`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-context-menu

O componente `po-context-menu` é uma barra lateral de contexto (sidebar) para navegação interna entre contextos.
Inspirado visualmente no `po-menu`, porém independente e focado em navegação contextual.

No caso de uso do componente `po-page-default` em conjunto, ambos devem estar no mesmo nível
e inseridos em uma div com a classe **po-context-menu-wrapper**.
Esta classe é responsável por fazer os cálculos necessários para o alinhamento dos componentes.

O uso simultâneo dos componentes `po-menu` e `po-context-menu` não é recomendado.
Porém, se os mesmos forem necessários na mesma interface, certifique-se de que não permaneçam expandidos
simultaneamente para não comprometer a usabilidade.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|--------------------------------------------------------------|-------------------------------------------------|
| **Default Values** | | |
| `--font-family` | Família tipográfica usada | `var(--font-family-theme)` |
| `--font-size` | Tamanho da fonte dos itens | `var(--font-size-default)` |
| `--font-size-context-title` | Tamanho da fonte do título de contexto | `var(--font-size-sm)` |
| `--font-size-title` | Tamanho da fonte do título principal | `var(--font-size-lg)` |
| `--line-height` | Altura da linha | `var(--line-height-md)` |
| `--border-radius` | Raio dos cantos dos itens | `var(--border-radius-md)` |
| `--border-color` | Cor da borda lateral direita do componente | `var(--color-neutral-light-20)` |
| `--background-color` | Cor de fundo do componente | `var(--color-neutral-light-05)` |
| `--color` | Cor do texto dos itens | `var(--color-action-default)` |
| `--color-context-title` | Cor do texto do título de contexto | `var(--color-neutral-mid-40)` |
| `--color-title` | Cor do texto do título principal | `var(--color-neutral-dark-80)` |
| `--font-weight` | Peso da fonte dos itens | `var(--font-weight-bold)` |
| `--font-weight-title` | Peso da fonte do título principal | `var(--font-weight-bold)` |
| `--outline-color-focused` | Cor do outline no estado de focus | `var(--color-action-focus)` |
| **Hover** | | |
| `--color-hover` | Cor do texto no estado hover | `var(--color-brand-01-darkest)` |
| `--background-color-hover` | Cor de fundo no estado hover | `var(--color-brand-01-lighter)` |
| **Pressed** | | |
| `--background-color-pressed` | Cor de fundo no estado pressed | `var(--color-brand-01-light)` |
| **Active (Selected)** | | |
| `--background-color-actived` | Cor de fundo do item selecionado | `var(--color-brand-01-lightest)` |
| `--color-actived` | Cor do texto do item selecionado | `var(--color-action-pressed)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `contextTitle` | `p-context-title` | `string` | não | - | Título do contexto superior |
| `expanded` | `p-expanded` | `boolean` | não | `true` | Define se o menu está aberto ou fechado. |
| `items` | `p-items` | `Array<PoContextMenuItem>` | não | - | Lista de itens para renderização. |
| `title` | `p-title` | `string` | não | - | Título principal do menu |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `itemSelected` | `p-item-selected` | `EventEmitter` | Evento emitido ao selecionar um item. Emite o item selecionado. |
