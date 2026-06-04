# PoMenuPanelComponent

**Seletor:** `po-menu-panel`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-menu-panel

Este é um componente de menu lateral composto apenas por ícones e com um nível, utilizado para navegação
em páginas internas, externas da aplicação ou aciona uma ação.

O componente `po-menu-panel` recebe uma lista de objetos do tipo `MenuPanelItem` com as informações dos
itens de menu como textos, links para redirecionamento, ações e ícones. Para o menu funcionar corretamente é necessário importar o `RouterModule` e `Routes` do módulo principal de
sua aplicação:

```
import { RouterModule, Routes } from '@angular/router';

...

@NgModule({
  imports: [
    RouterModule,
    Routes,
    ...
    PoModule,
    ...
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Além disso é necessário criar um módulo configurando as rotas da aplicação.

```
import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { HelloWorldComponent } from './hello-world/hello-world.component';

const routes: Routes = [
  {path: 'hello-world', component: HelloWorldComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `logo` | `'p-logo'` | `string` | sim | - | Caminho para a logomarca localizada na parte superior do menu. |
| `logoAlt` | `'p-logo-alt'` | `string` | sim | `Logomarca início` | Define o texto alternativo para a logomarca. |
| `menus` | `'p-menus'` | `PoMenuPanelItem[]` | não | - | Lista dos itens do `po-menu-panel`. Se o valor estiver indefinido ou inválido, será inicializado como um array vazio. |
