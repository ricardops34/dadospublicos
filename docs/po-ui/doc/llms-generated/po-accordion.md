# PoAccordionComponent

**Seletor:** `po-accordion`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-accordion

Componente utilizado para agrupar visualmente uma lista de conteúdos, mostrando-os individualmente
ao clicar no título de cada item.

Para utilizá-lo, é necessário envolver cada item no componente [`po-accordion-item`](/documentation/po-accordion-item),
como no exemplo abaixo:

```
<po-accordion #accordion [p-show-manager-accordion]="true">
  <po-accordion-item p-label="PO Accordion 1">
     Accordion 1
  </po-accordion-item>

  <po-accordion-item p-label="PO Accordion 2">
     Accordion 2
  </po-accordion-item>
</po-accordion>
```

e no typescript pode-se utilizar o `@ViewChild`:

```
 @ViewChild(PoAccordionComponent, { static: true }) accordion: PoAccordionComponent;

 ngAfterContentInit() {
   // ou utilizar o método collapseAllItems();
   this.accordion.expandAllItems();
 }
```

O componente já faz o controle de abertura e fechamento dos itens automaticamente.

Caso houver a necessidade de abrir algum dos `po-accordion-item` via Typescript
acesse a [documentação do PoAccordionItem](/documentation/po-accordion-item).

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|-------------------------------------------------------|---------------------------------------------------|
| **Default Values** | | |
| `--font-family` | Família tipográfica usada | `var(--font-family-theme)` |
| `--font-size` | Tamanho da fonte | `var(--font-size-default)` |
| `--color` | Cor principal do accordion | `var(--color-action-default)` |
| `--background-color` | Cor de background | `var(--color-neutral-light-00)` |
| `--font-weight` | Peso da fonte | `var(--font-weight-bold)` |
| **Hover** | | |
| `--color-hover` | Cor principal no estado hover | `var(--color-action-hover)` |
| `--background-hover` | Cor de background no estado hover | `var(--color-brand-01-lightest)` |
| **Focused** | | |
| `--color-focused` | Cor principal no estado de focus | `var(--color-action-focus)` |
| `--outline-color-focused` | Cor do outline do estado de focus | `var(--color-action-focus)` |
| **Disabled** | | |
| `--color-disabled` | Cor principal no estado disabled | `var(--color-neutral-mid-60)` |
| `--background-disabled` | Cor de background no estado disabled | `var(--color-neutral-light-10)` |
| **po-accordion-manager** | | |
| `--background-color` | Cor de background | `var(--color-neutral-mid-60)` |
| `--color` | Cor principal do accordion manager | `var(--color-neutral-light-10)` |
| `--font-family` | Família tipográfica usada | `var(--color-neutral-light-10)` |
| `--font-size` | Tamanho da fonte | `var(--color-neutral-light-10)` |
| `--font-weight` | Peso da fonte | `var(--color-neutral-light-10)` |
| **Pressed** | | |
| `--background-pressed` | Cor de background no estado de pressionado | `var(--color-brand-01-lighter)` |
| `--color-pressed` | Cor principal no estado de pressionado | `var(--color-action-pressed)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `allowExpandItems` | `'p-allow-expand-all-items'` | `boolean` | sim | `false` | Permite expandir mais de um `<po-accordion-item></po-accordion-item>` ao mesmo tempo. |
| `literals` | `'p-literals'` | `PoAccordionLiterals` | sim | - | Objeto com as literais usadas no `po-accordion`. |
| `showManagerAccordion` | `'p-show-manager-accordion'` | `boolean` | sim | `false` | Exibe o Gerenciador de Accordion. |
| `size` | `'p-size'` | `string` | sim | `medium` | Define o tamanho do componente: |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `collapseAllEvent` | `'p-collapse-all'` | `EventEmitter` | Evento disparado ao retrair o gerenciador de accordion, seja manualmente ou programaticamente. |
| `expandAllEvent` | `'p-expand-all'` | `EventEmitter` | Evento disparado ao expandir o gerenciador de accordion, seja manualmente ou programaticamente. |

## Métodos

### `collapseAllItems()`

Método para colapsar todos os itens.
Só pode ser utilizado quando a propriedade `p-show-manager-accordion` estiver como `true`.

### `expandAllItems()`

Método para expandir todos os itens.
Só pode ser utilizado quando a propriedade `p-show-manager-accordion` estiver como `true`.
