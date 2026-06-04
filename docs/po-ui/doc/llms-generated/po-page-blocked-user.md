# PoPageBlockedUserComponent

**Seletor:** `po-page-blocked-user`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-blocked-user

O componente `po-page-blocked-user` é utilizado como template para tela de bloqueio de usuário.
É possível definir entre três tipos de telas para alertar o usuário sobre um eventual bloqueio de login.

Cada modelo de bloqueio possui uma imagem e texto adequados à situação.
Os textos das telas são pré-definidos e imutáveis, porém,
é possível estipular parâmetros como dias, horas e tentativas de acesso esgotadas.

Por fim, há propriedades para adição de telefone e/ou email para contato e também a definição para a url de retorno.

Para que as imagens sejam exibidas corretamente, é necessário incluir o caminho delas ao projeto. Para isso, edite
o *assets* no arquivo **angular.json** da aplicação na seguinte ordem:
```
  "assets": [
    "src/assets",
    "src/favicon.ico",
    {
      "glob": "**\/*",
      "input": "node_modules/@po-ui/style/images",
      "output": "assets/images"
    }
  ]
```

_______________

#### Praticidade
O `po-page-blocked-user`, assim como suas propriedades, pode também ser transmitido diretamente pelas configuraçãos de rota e,
desta maneira, dispensa-se qualquer menção e/ou importação no restante da aplicação. O exemplo abaixo exemplifica
a forma dinâmica com a qual o template pode ser gerado se navegasse para uma rota denominada como `/access-denied`:

```
  import { PoPageBlockedUserComponent, PoPageBlockedUserReason } from '@po-ui/ng-templates';

  ...
  const routes: Routes = [
    {
      path: 'access-denied', component: PoPageBlockedUserComponent, data: {
        contactEmail: 'dev.po@po-ui.com',
        contactPhone: '0800 1234 000',
        reason: PoPageBlockedUserReason.ExpiredPassword,
        urlBack: '/home'
      }
    }
    ...
  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
```

> É essencial que siga a nomenclatura dos atributos exemplificados acima para sua efetiva funcionalidade.

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `componentsSize` | `'p-components-size'` | `string` | sim | `medium` | Define o tamanho dos componentes de formulário no template: |
| `contactEmail` | `'p-contact-email'` | `string` | sim | - | Valor para o email de contato que deve ser exibido. A ação está de acordo com o protocolo MAILTO e é possível definir |
| `contactPhone` | `'p-contact-phone'` | `string` | sim | - | Valor para o telefone de contato que deve ser exibido. A ação está de acordo com o protocolo TEL. |
| `logo` | `'p-logo'` | `string` | sim | - | Caminho para a logomarca localizada na parte superior, caso não seja definida ou seja inválida assume a logo padrão do PO UI. |
| `params` | `'p-params'` | `PoPageBlockedUserReasonParams` | sim | - | Designação de valores usados para a customização da mensagem de bloqueio. |
| `reason` | `'p-reason'` | `PoPageBlockedUserReason` | sim | `PoPageBlockedUserReason.None` | Definição de motivo de bloqueio de usuário. As informações modificam conforme o motivo selecionado. |
| `secondaryLogo` | `'p-secondary-logo'` | `string` | sim | - | Caminho para a logomarca localizada no rodapé. |
| `urlBack` | `'p-url-back'` | `string` | sim | `/` | URL para a ação de retorno da página. |
