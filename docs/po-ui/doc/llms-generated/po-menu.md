# PoMenuComponent

**Seletor:** `po-menu`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-menu

Este é um componente de menu lateral que é utilizado para navegação nas páginas de uma aplicação.

O componente po-menu recebe uma lista de objetos do tipo `MenuItem` com as informações dos itens de menu como
textos, links para redirecionamento, ações, até 4 níveis de menu e ícones para o primeiro nível de menu.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
| **Default Values** | | |
| `--border-radius` | Contém o valor do raio dos cantos do elemento | `var(--border-radius-md)` |
| `--border-color` | Cor da borda | `var(--color-neutral-light-20)` |
| `--background-color` | Cor de background | `Var(----color-neutral-light-05)` |
| **Menu Footer** | | |
| `--color` | Cor principla do menu footer | `var(--color-action-default)` |
| `--font-size` | Tamanho da fonte | `var(--font-size-default)` |
| `--line-height` | Tamanho da label | `var(--line-height-md)` |
| `--outline-color-focused` | Cor do outline do estado de focus | `var(--color-action-focus)` |
| `--font-weight-lvl0` | Peso da fonte | `var(--font-weight-bold)` |
| **po-menu-item** | | |
| `--font-family` | Família tipográfica usada | `var(--font-family-theme)` |
| `--font-size` | Tamanho da fonte | `var(--font-size-default)` |
| `--line-height` | Tamanho da label | `var(--line-height-md)` |
| `--border-radius` | Contém o valor do raio dos cantos do elemento | `var(--border-radius-md)` |
| `--color` | Cor principal do item | `var(--color-action-default)` |
| `--background-color` | Cor do background | `transparent` |
| **Hover** | | |
| `--color-hover` | Cor principal no estado hover | `var(--color-brand-01-darkest)` |
| `--background-color-hover` | Cor de background no estado hover | `var(--color-brand-01-lighter)` |
| **Focused** | | |
| `--outline-color-focused` | Cor do outline do estado de focus | `var(--color-action-focus)` |
| **Pressed** | | |
| `--background-color-pressed` | Cor de background no estado de pressionado | `var(--color-brand-01-light)` |
| **Actived** | | |
| `--background-color-actived` | Cor de background no estado actived | `var(--color-brand-01-darkest)` |
| `--color-actived` | Cor principal no estado actived | `var(--color-brand-01-lighter)` |
| **Font** | | |
| `--font-weight-lvl0` | Peso da fonte bold | `var(--font-weight-bold)` |
| `--font-weight-lvl1` | Peso da fonte | `var(--font-weight-normal)` |

Aparece completo em telas com largura maior que 1200px, caso contrário o menu é escondido e chamado por meio de um botão.

O menu também pode ser colapsado. Essa opção é habilitada quando todos os itens de primeiro nível possuírem ícones e textos curtos.
Se colapsado, somente os itens de primeiro nível serão exibidos e, caso o item selecionado possua sub-níveis,
então o menu alternará novamente para o estado aberto.

Existe a possibilidade de customizar a logomarca, que é exibida na parte superior do componente.

E para adicionar um conteúdo personalizado entre a logomarca e o campo de filtro,
basta adicionar este conteúdo com a diretiva [**p-menu-header-template**](/documentation/po-menu-header-template).

Caso utilizar o filtro de menus, é possível realizar buscas em serviço, apenas informando a URL do serviço ou a instância de
um serviço customizado implementando a interface `PoMenuFilter`.

Para o menu funcionar corretamente é necessário importar o `RouterModule` e `Routes` do módulo principal de
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
| `automaticToggle` | `'p-automatic-toggle'` | `boolean` | sim | `false` | Expande e Colapsa (retrai) o menu automaticamente. |
| `collapsed` | `'p-collapsed'` | `boolean` | sim | `false` | Colapsa (retrai) o menu e caso receba o valor `false` expande o menu. |
| `componentsSize` | `'p-components-size'` | `string` | sim | `medium` | Define o tamanho dos componentes de formulário no menu: |
| `filter` | `'p-filter'` | `boolean` | sim | `false` | Habilita um campo para pesquisa no menu. |
| `logo` | `'p-logo'` | `string` | sim | - | Caminho para a logomarca, que será exibida quando o componente estiver expandido, localizada na parte superior. |
| `logoAlt` | `'p-logo-alt'` | `string` | sim | `Logomarca início` | Define o texto alternativo para a logomarca. |
| `logoLink` | `'p-logo-link'` | `boolean | string` | sim | `true` | Define o link para a rota ao clicar no logo do menu. |
| `menus` | `'p-menus'` | `PoMenuItem[]` | não | - | Lista dos itens do menu. Se o valor estiver indefinido ou inválido, será inicializado como um array vazio. |
| `params` | `'p-params'` | `any` | sim | - | Deve ser informado um objeto que deseja-se utilizar na requisição de filtro dos itens de menu. |
| `searchTreeItems` | `'p-search-tree-items'` | `boolean` | sim | `false` | Quando ativado, a pesquisa também retornará itens agrupadores além dos itens que contêm uma ação e/ou link definidos. |
| `service` | `'p-service'` | `string | PoMenuFilter` | sim | - | Nesta propriedade deve ser informada a URL do serviço em que será utilizado para realizar o filtro de itens do |
| `shortLogo` | `'p-short-logo'` | `string` | sim | - | Caminho para a logomarca, que será exibida quando o componente estiver colapsado, localizada na parte superior. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `toggleChange` | `p-toggle` | `EventEmitter` | Evento emitido toda vez que o estado do menu muda, enviando `true` quando expandido e `false` quando colapsado. |

## Métodos

### `collapse()`

Método para colapsar (retrair) o menu.

### `expand()`

Método para expandir (aumentar) o menu.

### `toggle()`

Método que colapsa e expande o menu alternadamente.

> Os métodos apenas vão colapsar/expandir o menu se:
- Todos os itens de menu tiverem valor nas propriedades `icon` e `shortLabel`.
