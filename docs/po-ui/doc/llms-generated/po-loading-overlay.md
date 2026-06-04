# PoLoadingOverlayComponent

**Seletor:** `po-loading-overlay`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-loading-overlay

Este componente mostra ao usuário uma imagem de _loading_ e bloqueia a página inteira ou o container escolhido,
enquanto aguarda a resposta de alguma requisição.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

Obs: Só é possível realizar alterações ao adicionar a classe `.po-loading`

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|-------------------------------------------------------|---------------------------------------------------|
| **Default Values** | | |
| `--font-family` | Família tipográfica usada | `var(--font-family-theme)` |
| `--font-weight` | Peso da fonte | `var(--font-weight-normal)` |
| `--text-color` | Cor do texto | `var(--color-neutral-dark-70)` |
| `--border-radius` | Contém o valor do raio dos cantos do elemento | `var(--border-radius-md)` |
| `--border-width` | Contém o valor da largura dos cantos do elemento | `var(--border-width-sm)` |
| `--border-color` | Cor da borda | `var(--color-neutral-light-20)` |
| `--background` | Cor de background | `var(--color-neutral-light-00)` |
| `--shadow` | Contém o valor da sombra do elemento | `var(--shadow-md)` |
| **po-loading-icon** | | |
| `--color` | Cor principal do spinner | `var(--color-action-default)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `screenLock` | `'p-screen-lock'` | `boolean` | sim | `false` | Define se o *overlay* será aplicado a um *container* ou à página inteira. |
| `size` | `'p-size'` | `string` | sim | `lg` | Define o tamanho do componente com base no tamanho do ícone de *loading*. |
| `text` | `'p-text'` | `string` | sim | `Carregando` | Texto a ser exibido no componente. |
