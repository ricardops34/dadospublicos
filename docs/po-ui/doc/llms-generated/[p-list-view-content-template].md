# PoListViewContentTemplateDirective

**Seletor:** `[p-list-view-content-template]`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/[p-list-view-content-template]

Esta diretiva permite que sejam apresentadas informações essenciais de cada item.

Deve-se utilizar como parâmetro a referência do item e/ou índice, sendo por padrão o item.
- Item: `item` determina o item da linha corrente.
- Índice: `index` determina o índice da linha corrente.

Esta diretiva pode ser usada de duas formas: explícita ou *syntax sugar*. Veja a seguir ambos, respectivamente:

```
...
<po-list-view
  p-property-title="name"
  [p-items]="[{id: 1, name: "Register", email: register@po-ui.com}]">

  <ng-template p-list-view-content-template let-item let-code="index">
    <div class="po-row">
      <po-info class="po-md-6" p-label="Code" [p-value]="code"></po-info>
      <po-info class="po-md-6" p-label="Email" [p-value]="item.email"></po-info>
    </div>
  </ng-template>

</po-list-view>

...
```

```
...
<po-list-view
   p-property-title="name"
   [p-items]="[{id: 1, name: "Register", email: register@po-ui.com}]">

   <div *p-list-view-content-template="let item, let i=index" class="po-row">
     <po-info class="po-md-12" p-label="Email" [p-value]="item.email"></po-info>
   </div>
</po-list-view>
...

```

A diretiva **p-list-view-content-template**, possibilita também alterar o título dos itens. Para isto,
é necessário atribuir a referência da função que faz a alteração, à propriedade `p-title`,
a mesma deve retornar um valor do tipo *string*. Veja o exemplo a seguir:

```
...
@Component({
   selector: 'app-root',
   template: `
     ...
     <po-list-view
       [p-items]="items">
       <ng-template p-list-view-content-template let-item [p-title]="customTitle">
         <div class="po-row">
           <po-info class="po-md-12" p-label="Customer" [p-value]="item.customer"></po-info>
         </div>
       </ng-template>
     ...
   `
})
export class AppComponent {
   public items = [{
     code: 1200,
     product: 'Rice',
     customer: 'Supermarket 1',
   }, {
     code: 1355,
     product: 'Bean',
     customer: 'Supermarket 2'
   }];

   customTitle(item) {
     return `${item.code} - ${item.product}`;
   }
}
```

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `title` | `'p-title'` | `(item) => string` | sim | - | Função que deve retornar um valor do tipo `string`, que será utilizado como o título de cada item da lista. |
