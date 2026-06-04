# PoPopupComponent

**Seletor:** `po-popup`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-popup

O componente `po-popup` é um container pequeno recomendado para ações de navegação:
Ele abre sobreposto aos outros componentes.

Suporta subníveis (submenus) quando as ações possuem a propriedade `subItems`,
habilitando navegação hierárquica automaticamente.

É possível escolher as posições do `po-popup` em relação ao componente alvo, para isto veja a propriedade `p-position`.

Também é possível informar um _template_ _header_ para o `po-popup`, que será exibido acima das ações.
Para funcionar corretamente é preciso adicionar a propriedade `p-popup-header-template` no elemento que servirá de template, por exemplo:

```
<po-popup [p-target]="target">
  <div p-popup-header-template>
    <div>
      Dev PO
    </div>
    <div>
      dev.po@po-ui.com.br
    </div>
  </div>
</po-popup >
```

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
| **Default Values** | | |
| `--border-radius` | Contém o valor do raio dos cantos do elemento | `var(--border-radius-md)` |
| `--border-width` | Contém o valor da largura dos cantos do elemento | `var(--border-width-sm)` |
| `--border-color` | Cor da borda | `var(--color-neutral-light-20)` |
| `--background` | Cor do background | `var(--color-neutral-light-00)` |
| `--shadow` | Contém o valor da sombra do elemento | `var(--shadow-md)` |
| **po-popup po-item-list** | | |
| `--font-family` | Família tipográfica usada | `var(--font-family-theme)` |
| `--font-size` | Tamanho da fonte | `var(--font-size-default)` |
| `--line-height` | Tamanho da label | `var(--line-height-md)` |
| **Action** | | |
| `--font-weight` | Peso da fonte | `var(--font-weight-bold)` |
| `--color` | Cor principal do popup | `var(--color-action-default)` |
| **Hover** | | |
| `--color-hover` | Cor principal no estado hover | `var(--color-brand-01-darkest)` |
| `--background-hover` | Cor de background no estado hover | `var(--color-brand-01-lighter)` |
| **Focused** | | |
| `--outline-color-focused` | Cor do outline do estado de focus | `var(--color-action-focus)` |
| **Pressed** | | |
| `--background-pressed` | Cor de background no estado de pressionado | `var(--color-brand-01-light)` |
| **Disabled** | | |
| `--color-disabled` | Cor principal no estado disabled | `var(--color-action-disabled)` |
| **Selected** | | |
| `--font-weight-selected` | Peso da fonte no estado selecionado | `var(--font-weight-bold)` |
| `--background-selected` | Cor de background no estado selecionado | `var(--color-brand-01-lightest)` |
| **Option e check** | | |
| `--color-option` | Cor principa no estado Option/check | `var(--color-neutral-dark-90)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `actions` | `'p-actions'` | `PoPopupAction[]` | não | - | Lista de ações que serão exibidas no componente. |
| `customPositions` | `'p-custom-positions'` | `string[]` | sim | - | Define as posições e a sequência que o `po-popup` poderá rotacionar. A sequência será definida pela ordem passada |
| `hideArrow` | `'p-hide-arrow'` | `boolean` | sim | `false` | Oculta a seta do componente *popup*. |
| `position` | `'p-position'` | `string` | sim | `bottom-left` | Define a posição inicial que o `po-popup` abrirá em relação ao componente alvo. Sugere-se que seja |
| `size` | `'p-size'` | `string` | sim | `medium` | Define o tamanho dos componentes de formulário no template: |
| `target` | `'p-target'` | `any` | não | - | Para utilizar o `po-popup` deve-se colocar uma variável local no componente que disparará o evento |

## Métodos

### `close()`

Fecha o componente *popup*.

> Por padrão, este comportamento é acionado somente ao clicar fora do componente ou em determinada ação / url.

### `open()`

Abre o componente *popup*.

> É possível informar um parâmetro que será utilizado na execução da ação do item e na função de desabilitar.

### `toggle()`

Responsável por abrir e fechar o *popup*.

Quando disparado abrirá o *popup* e caso o mesmo já estiver aberto e possuir o mesmo `target` irá fecha-lo.

É possível informar um parâmetro que será utilizado na execução da ação do item e na função de desabilitar.
