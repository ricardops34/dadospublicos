# PoPopoverBaseComponent

**Seletor:** `po-popover-base`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-popover-base

O componente `po-popover` é um container pequeno recomendado para incluir vários tipos de conteúdo como:
gráficos, textos, imagens e inputs. Ele abre sobreposto aos outros componentes.

Para mostrar apenas pequenos textos recomenda-se o uso da diretiva
[**po-tooltip**](https://po-ui.io/documentation/po-tooltip?view=doc).

Para conteúdos maiores recomenda-se o uso do [**po-modal**](https://po-ui.io/documentation/po-modal?view=doc).

Ele contém um título e também é possível escolher as posições do popover em relação ao componente pai,
as posições permitidas são: `right`, `right-top`, `right-bottom`, `top`, `top-left`, `top-right`,
`left`, `left-top`, `left-bottom`, `bottom`, `bottom-left` e `bottom-right`.

Também é possível escolher entre os dois eventos que podem abrir o *popover*.
Os eventos permitidos são: `click` e `hover`.

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `appendBox` | `'p-append-in-body'` | `boolean` | sim | `false` | Define que o popover será inserido no body da página em vez do elemento definido em `p-target`. Essa opção pode |
| `customClasses` | `p-custom-classes` | `string` | sim | - | Permite a inclusão de classes CSS customizadas ao componente. |
| `hideArrow` | `'p-hide-arrow'` | `boolean` | sim | `false` | Desabilita a seta do componente *popover*. |
| `position` | `'p-position'` | `string` | sim | right | Define a posição que o po-popover abrirá em relação ao componente alvo. Sugere-se que seja |
| `target` | `'p-target'` | `ElementRef | HTMLElement` | não | - | ElementRef do componente de origem responsável por abrir o popover. |
| `title` | `'p-title'` | `string` | sim | - | Título do popover. |
| `trigger` | `'p-trigger'` | `string` | sim | click | Define o evento que abrirá o po-popover. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `closePopover` | `'p-close'` | `EventEmitter` | Evento disparado ao fechar o popover. |
| `openPopover` | `'p-open'` | `EventEmitter` | Evento disparado ao abrir o popover. |
