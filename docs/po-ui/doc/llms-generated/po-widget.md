# PoWidgetComponent

**Seletor:** `po-widget`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-widget

O componente `po-widget` é recomendado para exibição de *dashboards*, podendo ser utilizado
para incluir vários tipos de conteúdo como: gráficos, tabelas, grids e imagens.

Além da exibição de conteúdos, este componente possibilita adicionar ações e um link
para ajuda, como também possibilita ser utilizado com ou sem sombra.

Para controlar sua largura, é possível utilizar o [Grid System](/guides/grid-system) para um maior
controle de seu redimensionamento, assim possibilitando o tratamento para diferentes resoluções.

#### Boas práticas

Utilize um tamanho mínimo de largura de aproximadamente `18.75rem` no componente.

#### Acessibilidade tratada no componente

Algumas diretrizes de acessibilidade já são tratadas no componente, internamente, e não podem ser alteradas. São elas:
- Utiliza medidas relativas, para se adequar às preferências e necessidades de quem for utilizar o sistema.
- Desenvolvido com uso de controles padrões HTML, o que permite a identificação na interface por tecnologias assistivas. (WCAG [4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value))
- O foco é visível e possui uma espessura superior a 2 pixels CSS, não ficando escondido por outros elementos da tela. (WCAG [2.4.12: Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance-enhanced))
- Quando selecionável, prevê interação por teclado, podendo ser selecionado através da tecla space (WCAG [2.4.1 - Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard))

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------------|------------------------------------------------------------------|-----------------------------------------------------------------------------|
| **Default Values** | | |
| `--font-family` | Família tipográfica usada | `var(--font-family-theme) ` |
| `--font-size` | Tamanho da fonte | `var(--font-size-sm)` |
| `--font-weight` | Peso da fonte | `var(--font-weight-bold)` |
| `--font-color` | Cor da fonte | `var(--color-neutral-dark-95)` |
| `--padding` - `@deprecated 21.x.x` | Preenchimento do componente | `1rem` |
| `--padding-header` | Preenchimento do header | `var(--spacing-sm) var(--spacing-sm) var(--spacing-xs) var(--spacing-sm)` |
| `--padding-body` | Preenchimento do body | `var(--spacing-xs) var(--spacing-sm) var(--spacing-xs) var(--spacing-sm)` |
| `--padding-avatar` | Preenchimento do avatar | `var(--spacing-sm) 0 var(--spacing-xs) var(--spacing-sm)` |
| `--padding-footer` | Preenchimento do footer | `var(--spacing-xs) var(--spacing-sm) var(--spacing-sm) var(--spacing-sm)` |
| `--border-radius` | Contém o valor do raio dos cantos do elemento | `var(--border-radius-md)` |
| `--border-width` | Contém o valor da largura dos cantos do elemento | `var(--border-width-sm)` |
| `--border-color` | Cor da borda | `var(--color-neutral-light-20)` |
| `--background` | Cor de background | `var(--color-neutral-light-00)` |
| `--shadow` | Contém o valor da sombra do elemento | `var(--shadow-md)` |
| **Hover** | | |
| `--border-color-hover` | Cor da borda no estado hover | `var(--color-action-hover)` |
| **Focused** | | |
| `--color-focused` | Cor principal no estado de focus | `var(--color-action-default)` |
| `--outline-color-focused` | Cor do outline do estado de focus | `var(--color-action-focus)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `actions` | `'p-actions'` | `Array<PoPopupAction>` | sim | - | Lista de ações exibidas no header do componente. |
| `avatar` | `p-avatar` | `PoWidgetAvatar` | sim | - | Define o avatar a ser exibido à esquerda no Widget. |
| `background` | `'p-background'` | `string` | sim | - | Define uma imagem de fundo. |
| `dangerPrimaryAction` | `'p-danger-primary-action'` | `false` | sim | `false` | Caso verdadeiro o botão da ação `p-primary-label` ativará o modo `danger`. |
| `dangerSecondaryAction` | `'p-danger-secondary-action'` | `false` | sim | `false` | Caso verdadeiro o botão da ação `p-secondary-label` ativará o modo `danger`. |
| `disabled` | `'p-disabled'` | `boolean` | sim | `false` | Desabilita o componente. |
| `height` | `'p-height'` | `number` | sim | - | Define a altura do componente. |
| `help` | `'p-help'` | `string` | sim | - | Link de ajuda incluído no menu de ações do header. |
| `kindPrimaryAction` | `'p-kind-primary-action'` | `string` | sim | `tertiary` | Define o estilo do botão da ação `p-primary-label`, conforme o enum `PoButtonKind`. |
| `kindSecondaryAction` | `'p-kind-secondary-action'` | `string` | sim | `tertiary` | Define o estilo do botão da ação `p-secondary-label`, conforme o enum `PoButtonKind`. |
| `noShadow` | `'p-no-shadow'` | `boolean` | sim | `true` | Desabilita a sombra do componente quando o mesmo for clicável. |
| `primary` | `'p-primary'` | `boolean` | sim | `false` | Opção para que o `po-widget` fique em destaque. |
| `primaryLabel` | `'p-primary-label'` | `string` | sim | - | Define o label e exibe a ação primária no footer do componente. |
| `secondaryLabel` | `'p-secondary-label'` | `string` | sim | - | Define o label e exibe a ação secundária no footer do componente. |
| `size` | `'p-size'` | `string` | sim | `medium` | Define o tamanho dos botões do componente: |
| `tagIcon` | `'p-tag-icon'` | `string | TemplateRef<void>` | sim | - | Define o ícone exibido ao lado do label da `p-tag`. |
| `tagLabel` | `'p-tag'` | `string` | sim | - | Label da tag exibida no header. |
| `tagPosition` | `p-tag-position` | `string` | sim | `right` | Define o posicionamento da `po-tag` no cabeçalho do Widget: |
| `tagType` | `'p-tag-type'` | `PoTagType | string` | sim | `success` | Define o tipo da `p-tag`, conforme o enum **PoTagType**. |
| `title` | `'p-title'` | `string` | sim | - | Título do componente. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `click` | `'p-click'` | `EventEmitter` | Evento disparado quando o usuário clicar no componente. |
| `onDisabled` | `'p-on-disabled'` | `EventEmitter` | Evento disparado quando a propriedade `p-disabled` for alterada. |
| `primaryAction` | `'p-primary-action'` | `EventEmitter` | Evento disparado ao clicar na ação `p-primary-label`. |
| `secondaryAction` | `'p-secondary-action'` | `EventEmitter` | Evento disparado ao clicar na ação `p-secondary-label`. |
| `setting` | `'p-setting'` | `EventEmitter` | Evento disparado ao clicar em **Configurações** incluído no menu de ações do header. |
| `titleAction` | `'p-title-action'` | `EventEmitter` | Evento disparado ao clicar no título definido em `p-title`. |
