# PoTooltipDirective

**Seletor:** `[p-tooltip]`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/[p-tooltip]

A diretiva po-tooltip deve ser utilizada para oferecer informações adicionais quando os usuários
passam o mouse ou realizam o foco sobre o elemento alvo ao qual ela está atribuída.

O conteúdo é formado por um pequeno texto que deve contribuir para uma tomada de decisão ou
orientação do usuário. A ativação dele pode estar em qualquer componente ou tag HTML.

Para textos maiores ou no caso de haver a necessidade de utilizar algum outro elemento como
conteúdo deve-se utilizar o [**po-popover**](https://po-ui.io/documentation/po-popover?view=doc).

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------------|------------------------------------------------------------------|--------------------------------------------------|
| **Default Values** | | |
| `--border-radius` | Contém o valor do raio dos cantos do elemento | `var(--border-radius-md)` |
| `--color` | Cor principal da tooltip | `var(--color-neutral-dark-80)` |
| `--font-family` | Família tipográfica usada | `var(--font-family-theme)` |
| `--text-color` | Cor do texto | `var(--color-neutral-light-00)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `appendInBody` | `'p-append-in-body'` | `boolean` | sim | `false` | Define que o po-tooltip será incluido no body e não dentro do elemento ao qual o tooltip foi especificado. |
| `hideArrow` | `'p-hide-arrow'` | `boolean` | sim | `false` | Controla a exibição da seta de indicação da tooltip. |
| `innerHtml` | `'p-inner-html'` | `boolean` | sim | `false` | Permite a renderização de conteúdo HTML dentro da tooltip. |
| `tooltip` | `'p-tooltip'` | `string` | não | - | Habilita e atribui um texto ao po-tooltip. |
| `tooltipPosition` | `'p-tooltip-position'` | `string` | sim | bottom | Define a posição que o po-tooltip abrirá em relação ao componente alvo. Sugere-se que seja |
