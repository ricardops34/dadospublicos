# PoAccordionItemComponent

**Seletor:** `po-accordion-item`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-accordion-item

Componente utilizado para renderizar os itens do `po-accordion`.

O componente `po-accordion` já faz o controle de abertura e fechamento dos itens automaticamente,
mas caso houver a necessidade de abrir algum dos `po-accordion-item` via Typescript, pode ser feita da seguinte forma:

```
<po-accordion>
  <po-accordion-item p-label="PO Accordion 1" #item1>
     Accordion 1
  </po-accordion-item>

  <po-accordion-item p-label="PO Accordion 2">
     Accordion 2
  </po-accordion-item>
</po-accordion>
```

e no typescript pode-se utilizar o `@ViewChild`:

```
 @ViewChild(PoAccordionItemComponent, { static: true }) item1: PoAccordionItemComponent;

 ngAfterContentInit() {
   // ou utilizar o método collapse()
   this.item1.expand();
 }
```

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `disabledItem` | `'p-disabled'` | `boolean` | sim | `false` | Desabilita item. |
| `label` | `'p-label'` | `string` | não | - | Título do item. |
| `labelTag` | `'p-label-tag'` | `string` | sim | - | Label da Tag. |
| `typeTag` | `'p-type-tag'` | `PoTagType` | sim | `info` | Define o tipo da *tag* caso ela esteja sendo exibida. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `collapseEvent` | `'p-collapse'` | `EventEmitter` | Evento disparado ao retrair o item, seja manualmente ou programaticamente. |
| `expandEvent` | `'p-expand'` | `EventEmitter` | Evento disparado ao expandir o item, seja manualmente ou programaticamente. |

## Métodos

### `collapse()`

Método para colapsar o `po-accordion-item`.

### `expand()`

Método para expandir o `po-accordion-item`.
