# PoCodeEditorComponent

**Seletor:** `po-code-editor`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-code-editor

O `po-code-editor` é um componente para edição de código fonte baseado no Monaco Editor da Microsoft.

Sendo assim, algumas configurações presentes no Monaco podem ser utilizadas aqui, como a escolha da linguagem
(utilizando o highlight syntax específico), escolha do tema e opção de diff, além de ser muito similar ao Visual
Studio Code, com autocomplete e fechamento automático de brackets.

Este componente pode ser usado em qualquer situação que necessite de adição de códigos, como por exemplo, criar
receitas utilizando Terraform para gerenciar topologias.
É importante ressaltar que este não é um componente para edição de textos comuns.

O [(ngModel)] deve ser usado para manipular o conteúdo do po-code-editor, ou seja, tanto para incluir um conteúdo quanto
para recuperar o conteúdo do po-code-editor, utiliza-se uma variável passada por [(ngModel)].

#### Adicionando o pacote @po-ui/ng-code-editor

Para instalar o pacote `po-code-editor` em sua aplicação execute:

```shell
`ng add @po-ui/ng-code-editor`
```

O comando `ng add` do `Angular CLI`:
- inclui o `po-code-editor` no seu projeto;
- adiciona o módulo `PoCodeEditorModule`:;

```
// app.module.ts
...
import { PoModule } from '@po-ui/ng-components';
import { PoCodeEditorModule } from '@po-ui/ng-code-editor';
...
@NgModule({
  imports: [
    ...
    PoModule,
    PoCodeEditorModule
  ],
  ...
})
export class AppModule { }
```

- adiciona o tema PO UI e também o *asset* do Monaco no arquivo `angular.json`, conforme abaixo:

...
"assets": [
{ "glob": "&#42;&#42;/&#42;", "input": "node_modules/monaco-editor/min", "output": "/assets/monaco/" }
],
"styles": [
"./node_modules/@po-ui/style/css/po-theme-default.min.css"
]
...

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `height` | `'p-height'` | `string` | sim | - | Define a altura do componente em pixels do po-code-editor. |
| `language` | `'p-language'` | `string` | sim | `plainText` | Linguagem na qual será apresentado o código fonte. |
| `readonly` | `'p-readonly'` | `boolean` | sim | `false` | Indica se o editor será aberto em modo de leitura. |
| `showDiff` | `'p-show-diff'` | `boolean` | sim | `false` | Indica se o editor será aberto em modo de comparação. |
| `suggestions` | `'p-suggestions'` | `Array<PoCodeEditorRegisterableSuggestion>` | sim | - | Lista de sugestões usadas pelo autocomplete dentro do editor. |
| `theme` | `'p-theme'` | `string` | sim | `vs` | Define um tema para o editor. |
