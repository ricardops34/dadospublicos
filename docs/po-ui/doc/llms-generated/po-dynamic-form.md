# PoDynamicFormComponent

**Seletor:** `po-dynamic-form`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-dynamic-form

Componente para criação de formulários dinâmicos a partir de uma lista de objetos.

Também é possível verificar se o formulário está válido e informar valores para a exibição de informações.

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `autoFocus` | `'p-auto-focus'` | `string` | sim | - | Nome da propriedade, atribuída ao `PoDynamicFormField.property`, que iniciará o campo com foco. |
| `componentsSize` | `'p-components-size'` | `string` | sim | `medium` | Define o tamanho dos componentes de formulário no template: |
| `fields` | `'p-fields'` | `Array<PoDynamicFormField>` | não | `[]` | Coleção de objetos que implementam a interface `PoDynamicFormField`, para definição dos campos que serão criados |
| `groupForm` | `'p-group-form'` | `boolean` | sim | - | Ao informar esta propriedade, o componente passará a utilizar o formulário pai para criar os `FormControl` |
| `load` | `'p-load'` | `string | Function` | sim | - | Função ou serviço que será executado na inicialização do componente. |
| `validate` | `'p-validate'` | `string | Function` | sim | - | Função ou serviço para validar as **mudanças do formulário**. |
| `validateFields` | `'p-validate-fields'` | `Array<string>` | sim | - | Lista que define os campos que irão disparar o validate do form. |
| `validateOnInput` | `'p-validate-on-input'` | `boolean` | sim | - | Ao informar esta propriedade, o componente passará a emitir o valor a cada caractere digitado. |
| `value` | `'p-value'` | `any` | não | - | Objeto que será utilizado como valor para exibir as informações, será recuperado e preenchido através do atributo *property* |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `formOutput` | `'p-form'` | `EventEmitter` | Na inicialização do componente será repassado o objeto de formulário utilizado no componente, |

## Métodos

### `focus(property: string)`

Função que atribui foco ao campo desejado.

Para utilizá-la é necessário capturar a instância do `dynamic form`, como por exemplo:

``` html
<po-dynamic-form #dynamicForm [p-fields]="fields"></po-dynamic-form>
```

``` javascript
import { PoDynamicFormComponent, PoDynamicFormField } from '@po-ui/ng-components';

...

@ViewChild('dynamicForm', { static: true }) dynamicForm: PoDynamicFormComponent;

fields: Array<PoDynamicFormField> = [
  { property: 'fieldOne' },
  { property: 'fieldTwo' }
];

fieldFocus() {
  this.dynamicForm.focus('fieldTwo');
}
```

### `showAdditionalHelp(property: string)`

Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}` ou em `p-additionalHelp`.
Para isso, será necessário configurar uma tecla de atalho utilizando o evento `keydown`.

```
import { PoDynamicModule } from '@po-ui/ng-components';
...
@ViewChild('dynamicForm', { static: true }) dynamicForm: PoDynamicFormComponent;

fields: Array<PoDynamicFormField> = [
 {
   property: 'name',
   ...
   help: 'Mensagem de ajuda.',
   helper: 'Mensagem de ajuda complementar com o componente po-helper implementado.',
   keydown: this.onKeyDown.bind(this, 'name')
 },
]

onKeyDown(property: string, event: KeyboardEvent): void {
 if (event.code === 'F9') {
   this.dynamicForm.showAdditionalHelp(property);
 }
}
```
