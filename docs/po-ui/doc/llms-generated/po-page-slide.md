# PoPageSlideComponent

**Seletor:** `po-page-slide`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-slide

O componente `po-page-slide` é utilizado para incluir conteúdos secundários
adicionando controles e navegações adicionais, mas mantendo o usuário na
página principal.

Este componente é ativado a partir do método `#open()` e pode ser encerrado
através do botão que encontra-se no cabeçalho do mesmo ou através do método
`#close()`.

> Para o correto funcionamento do componente `po-page-slide`, deve ser
> importado o módulo `BrowserAnimationsModule` no módulo principal da sua
> aplicação.

Módulo da aplicação:
```
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PoModule } from '@po-ui/ng-components';
...

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ...
    PoModule
  ],
  declarations: [
    AppComponent,
    ...
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Em aplicações Standalone, utilize a seguinte configuração para o bootstrap:

```
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(BrowserAnimationsModule)]
}).catch(err => console.error(err));
```

Caso utilize componentes de field dentro do page-slide, recomenda-se o uso do [Grid System](https://po-ui.io/guides/grid-system).

No rodapé é possível utilizar o componente [`PoPageSlideFooter`](/documentation/po-page-slide-footer) para customização do template.
#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|------------------------------------------|-------------------------------------------------------------------|-------------------------------------------------------------------------------|
| `--font-family` | Família tipográfica usada | `var(--font-family-theme)` |
| `--font-weight` | Peso da fonte | `var(--font-weight-bold)` |
| `--padding-header` | Espaçamento do header | `var(--spacing-md)` |
| `--padding-body` | Espaçamento do conteúdo | `var(--line-height-none)` |
| `--padding-footer` | Espaçamento do footer | `var(--spacing-sm) var(--spacing-md) var(--spacing-xl) var(--spacing-md)` |
| **Default Values** | | |
| `--color-overlay` | Cor do overlay | `var(--color-neutral-dark-80)` |
| `--opacity-overlay` | Cor da opacidade do overlay | `0.7` |
| `--background-color` | Cor de background | `var(--color-neutral-light-00)` |
| `--border-color` | Cor da borda | `var(--color-neutral-light-20)` |
| `--color-title` | Cor do titulo do header | `var(--color-neutral-dark-95)` |
| `--border-radius` | Radius da borda | `var(--border-radius-md) 0 0 var(--border-radius-md)` |
| `--transition-duration` | Duração da transição | `var(--duration-extra-fast)` |
| `--transition-timing` | Duração da transição com o tipo de transição | `var(--duration-extra-slow) var(--timing-standart)` |
| `--page-slide-width-sm` | Tamanho da largura do componente no tamanho `small` | `40%` |
| `--page-slide-width-md` | Tamanho da largura do componente no tamanho `medium` | `50%` |
| `--page-slide-width-lg` | Tamanho da largura do componente no tamanho `large` | `60%` |
| `--page-slide-width-xl` | Tamanho da largura do componente no tamanho `extra large` | `70%` |
| `--page-slide-min-width-auto` | Tamanho da largura mínima do componente no tamanho `auto` | `40%` |
| `--page-slide-max-width-auto` | Tamanho da largura máxima do componente no tamanho `auto` | `90%` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `clickOut` | `'p-click-out'` | `boolean` | sim | `false` | Define se permite o encerramento da página ao clicar fora da mesma. |
| `componentsSize` | `'p-components-size'` | `string` | sim | `medium` | Define o tamanho dos componentes de formulário no template: |
| `flexibleWidth` | `'p-flexible-width'` | `boolean` | sim | `false` | Permite a expansão dinâmica da largura do `po-page-slide` quando `p-size` for `auto` (automático). |
| `hideClose` | `'p-hide-close'` | `boolean` | sim | `false` | Oculta o botão de encerramento da página. |
| `size` | `'p-size'` | `string` | sim | `md` | Define o tamanho da página. |
| `subtitle` | `'p-subtitle'` | `string` | sim | - | Subtítulo da página. |
| `title` | `'p-title'` | `string` | não | - | Título da página. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `closePageSlide` | `'p-close'` | `EventEmitter` | Evento executado ao fechar o page slide. |

## Métodos

### `open()`

Ativa a visualização da página.

Para utilizá-la é necessário ter a instância do componente no DOM, podendo
ser utilizado o `ViewChild` da seguinte forma:

```typescript
import { PoPageSlideComponent } from '@po/ng-components';

...

@ViewChild(PoPageSlideComponent, { static: true }) pageSlide: PoPageSlideComponent;

public openPage() {
  this.pageSlide.open();
}
```

### `close()`

Encerra a visualização da página.

Para utilizá-la é necessário ter a instância do componente no DOM, podendo
ser utilizado o `ViewChild` da seguinte forma:

```typescript
import { PoPageSlideComponent } from '@po-ui/ng-components';

...

@ViewChild(PoPageSlideComponent, { static: true }) pageSlide: PoPageSlideComponent;

public closePage() {
  this.pageSlide.close();
}
```
