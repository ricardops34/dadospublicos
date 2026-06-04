# PoContainerComponent

**Seletor:** `po-container`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-container

O `po-container` é um componente que visa facilitar o agrupamento de conteúdos.
Por padrão o mesmo exibe uma borda, um efeito de sombra ao seu redor e um espaçamento em sua parte interna, os quais
podem ser desabilitados. Ao remover sua borda a sombra também será removida. Além disso, sua altura acompanha a
quantidade do conteúdo, porém pode ser fixada. Para controlar sua largura, utilize o [Grid System](/guides/grid-system),
assim possibilitando o tratamento para diferentes resoluções.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|------------------------------------------------|--------------------------------------------------------|--------------------------------------------------|
| **Default Values - CONTENT** | | |
| `--padding` | Preenchimento | `var(--spacing-sm)` |
| `--border-radius` | Contém o valor do raio dos cantos do elemento | `var(--border-radius-md)` |
| `--border-width` | Contém o valor da largura dos cantos do elemento | `var(--border-width-sm)` |
| `--border-color` | Cor da borda | `var(--color-neutral-light-20)` |
| `--background` | Cor de background | `var(--color-neutral-light-00)` |
| **Default Values - TITLE** | | |
| `--font-family` | Font aplicado ao titulo | `var(--font-family-theme)` |
| `--line-weight` | Espessura da Fonte a ser aplicada do titulo | `var(--font-weight-semibold)` |
| `--line-height` | tamanho da linha do titulo | `var(--line-height-md)` |
| `--text-color` | Cor do Texto do titulo | `var(--color-neutral-dark-90)` |
| `--font-size` | Tamanho da fonte do titulo | `1.125rem` |
| `--letter-spacing` | distancia entre letras do titulo | `0.017rem` |
| `--margin` | Margin entre o titulo e o conteudo | `0 0 var(--spacing-xs)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `height` | `'p-height'` | `number` | sim | - | Define a altura do `po-container`. |
| `noBorder` | `'p-no-border'` | `boolean` | sim | `false` | Desabilita a borda e a sombra em torno do `po-container`. |
| `noPadding` | `'p-no-padding'` | `boolean` | sim | `false` | Desabilita o espaçamento interno do `po-container`. |
| `title` | `'p-title'` | `string` | sim | - | Título do Container. |
