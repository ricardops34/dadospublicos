# PoDropdownComponent

**Seletor:** `po-dropdown`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-dropdown

O componente `po-dropdown` pode ser utilizado como um agrupador de ações e / ou opções.

> Caso não haja configuração de rotas em sua aplicação, se faz necessário importar o `RouterModule`
no módulo principal para o correto funcionamento deste componente:

```
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    ...
    RouterModule.forRoot([]),
    PoModule
  ],
  declarations: [
    AppComponent
  ],
  exports: [],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
```
> Para maiores dúvidas referente à configuração de rotas, acesse em nosso portal /Guias /Começando
[/Configurando as rotas do po-menu](/guides/getting-started).

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|-------------------------------------------------------|--------------------------------------------------|
| **Default Values** | | |
| `--font-family` | Família tipográfica usada | `var(--font-family-theme)` |
| `--font-size` | Tamanho da fonte | `var(--font-size-default)` |
| `--font-weight` | Peso da fonte | `var(--font-weight-bold)` |
| `--line-height` | Tamanho da label | `var(--line-height-none)` |
| `--color` | Cor principal do dropdown | `var(--color-action-default)` |
| `--border-radius` | Contém o valor do raio dos cantos do elemento | `var(--border-radius-md)` |
| `--border-width` | Contém o valor da largura dos cantos do elemento | `var(--border-width-md)` |
| `--padding` | Preenchimento | `0 1em` |
| **Hover** | | |
| `--color-hover` | Cor principal no estado hover | `var(--color-brand-01-darkest)` |
| `--background-hover` | Cor de background no estado hover | `var(--color-brand-01-lighter)` |
| **Focused** | | |
| `--outline-color-focused` | Cor do outline do estado de focus | `var(--color-action-focus)` |
| **Pressed** | | |
| `--background-pressed` | Cor de background no estado de pressionado | `var(--color-brand-01-light)` |
| **Disabled** | | |
| `--color-disabled` | Cor principal no estado disabled | `var(--color-action-disabled)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `actions` | `'p-actions'` | `PoDropdownAction[]` | não | - | Lista de ações que serão exibidas no componente. |
| `disabled` | `'p-disabled'` | `boolean` | sim | `false` | Desabilita o campo. |
| `label` | `'p-label'` | `string` | não | - | Adiciona um rótulo ao `dropdown`. |
| `position` | `'p-position'` | `string` | sim | `bottom-left` | Define a posição preferencial de abertura do popup do dropdown em relação ao botão. |
| `size` | `'p-size'` | `string` | sim | `medium` | Define o tamanho do componente: |
