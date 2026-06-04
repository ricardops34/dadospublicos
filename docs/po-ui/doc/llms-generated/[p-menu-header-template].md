# PoMenuHeaderTemplateDirective

**Seletor:** `[p-menu-header-template]`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/[p-menu-header-template]

Esta diretiva permite adicionar um conteúdo personalizado entre a logo e o campo de filtro do cabeçalho do
[`po-menu`](/documentation/po-menu).

Para personalizar o conteúdo do cabeçalho deve-se utilizar a diretiva `p-menu-header-template` dentro da *tag* do
[`po-menu`](/documentation/po-menu). Podendo ser utilizada de duas formas:

Com `ng-template`
```
...
<po-menu [p-menus]="menus">
  <ng-template p-menu-header-template>
    ...
  </ng-template>
</po-menu>
...
```

ou com *syntax sugar*
```
...
<po-menu [p-menus]="menus">
  <div *p-menu-header-template>
    ...
  </div>
</po-menu>
...
```

> Quando o menu estiver colapsado ou tela for _mobile_ o conteúdo personalizado não será exibido.
