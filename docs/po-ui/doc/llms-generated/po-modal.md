# PoModalComponent

**Seletor:** `po-modal`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-modal

O componente `po-modal` é utilizado para incluir conteúdos rápidos e informativos.

No cabeçalho do componente é possível definir um título e como também permite ocultar o ícone de fechamento da modal.

Em seu corpo é possível definir um conteúdo informativo, podendo utilizar componentes como por exemplo `po-chart`,
`po-table` e os demais componentes do PO.

No rodapé encontram-se os botões de ação primária e secundária, no qual permitem definir uma ação e um rótulo, bem como
definir um estado de carregando e / ou desabilitado e / ou definir o botão com o tipo *danger*. Também é possível utilizar
o componente [`PoModalFooter`](/documentation/po-modal-footer).

> É possível fechar a modal através da tecla *ESC*, quando a propriedade `p-hide-close` não estiver habilitada.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------------|-------------------------------------------------------|-------------------------------------------------------------------------------------|
| **Default Values** | | |
| `--border-radius` | Contém o valor do raio dos cantos do elemento | `var(--border-radius-md)` |
| `--border-width` | Contém o valor da largura dos cantos do elemento | `var(--border-width-sm)` |
| `--border-color` | Cor da borda | `var(--color-neutral-light-20)` |
| `--background` | Cor de background | `var(--color-neutral-light-00)` |
| `--shadow` | Contém o valor da sombra do elemento | `var(--shadow-md)` |
| `--color-overlay` | Cor da camada visual temporária | `var(--color-neutral-dark-80)` |
| `--opacity-overlay` | Opacidade da camada visual temporária | `0.7` |
| `--color-divider` | Cor das divisões do modal | `var(--color-neutral-light-20)` |
| `--padding-header` | Padding do header do modal | `var(--spacing-sm) var(--spacing-md)` |
| `--padding-body` | Padding do corpo do modal | `var(--spacing-md) var(--spacing-2xl) var(--spacing-2xl) var(--spacing-md) ` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `componentsSize` | `'p-components-size'` | `string` | sim | `medium` | Define o tamanho dos componentes de formulário no modal: |
| `hideClose` | `'p-hide-close'` | `boolean` | sim | `false` | Oculta o ícone de fechar do cabeçalho da modal. |
| `icon` | `'p-icon'` | `string | TemplateRef<void>` | sim | - | Ícone exibido ao lado esquerdo do label do titúlo da modal. |
| `primaryAction` | `'p-primary-action'` | `PoModalAction` | sim | - | Deve ser definido um objeto que implementa a interface `PoModalAction` contendo a label e a função da primeira ação. |
| `secondaryAction` | `'p-secondary-action'` | `PoModalAction` | sim | - | Deve ser definido um objeto que implementa a interface `PoModalAction` contendo a label e a função da segunda ação. |
| `size` | `'p-size'` | `string` | não | - | Define o tamanho da modal. |
| `title` | `'p-title'` | `string` | não | - | Título da modal. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `closeModal` | `'p-close'` | `EventEmitter` | Evento disparado ao fechar o modal. |

## Métodos

### `close()`

Função para fechar a modal.

### `open()`

Função para abrir a modal.
