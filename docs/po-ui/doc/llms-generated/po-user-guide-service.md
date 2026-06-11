# PoUserGuideService

**Tipo:** Serviço
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-user-guide-service

Serviço responsável por criar e controlar tours guiados na interface da aplicação.

O `PoUserGuideService` permite apresentar uma sequência de passos visuais para orientar
o usuário durante o uso de uma tela, funcionalidade ou fluxo específico do sistema.
Ele pode ser utilizado, por exemplo, para apresentar uma nova funcionalidade, guiar um
primeiro acesso ou destacar pontos importantes da interface.

O serviço centraliza a configuração do guia do usuário, incluindo:

- os passos que serão exibidos;
- as opções gerais de comportamento;
- o controle do passo ativo;
- os eventos emitidos durante o ciclo de vida do tour.

A partir dele, a aplicação pode iniciar, acompanhar e reagir à execução do tour por meio
dos eventos públicos `tourStartServiço responsável por criar e controlar tours guiados na interface da aplicação.

O `PoUserGuideService` permite apresentar uma sequência de passos visuais para orientar
o usuário durante o uso de uma tela, funcionalidade ou fluxo específico do sistema.
Ele pode ser utilizado, por exemplo, para apresentar uma nova funcionalidade, guiar um
primeiro acesso ou destacar pontos importantes da interface.

O serviço centraliza a configuração do guia do usuário, incluindo:

- os passos que serão exibidos;
- as opções gerais de comportamento;
- o controle do passo ativo;
- os eventos emitidos durante o ciclo de vida do tour.

A partir dele, a aplicação pode iniciar, acompanhar e reagir à execução do tour por meio
dos eventos públicos , `stepChangeServiço responsável por criar e controlar tours guiados na interface da aplicação.

O `PoUserGuideService` permite apresentar uma sequência de passos visuais para orientar
o usuário durante o uso de uma tela, funcionalidade ou fluxo específico do sistema.
Ele pode ser utilizado, por exemplo, para apresentar uma nova funcionalidade, guiar um
primeiro acesso ou destacar pontos importantes da interface.

O serviço centraliza a configuração do guia do usuário, incluindo:

- os passos que serão exibidos;
- as opções gerais de comportamento;
- o controle do passo ativo;
- os eventos emitidos durante o ciclo de vida do tour.

A partir dele, a aplicação pode iniciar, acompanhar e reagir à execução do tour por meio
dos eventos públicos `tourStartServiço responsável por criar e controlar tours guiados na interface da aplicação.

O `PoUserGuideService` permite apresentar uma sequência de passos visuais para orientar
o usuário durante o uso de uma tela, funcionalidade ou fluxo específico do sistema.
Ele pode ser utilizado, por exemplo, para apresentar uma nova funcionalidade, guiar um
primeiro acesso ou destacar pontos importantes da interface.

O serviço centraliza a configuração do guia do usuário, incluindo:

- os passos que serão exibidos;
- as opções gerais de comportamento;
- o controle do passo ativo;
- os eventos emitidos durante o ciclo de vida do tour.

A partir dele, a aplicação pode iniciar, acompanhar e reagir à execução do tour por meio
dos eventos públicos ,  e `tourEndServiço responsável por criar e controlar tours guiados na interface da aplicação.

O `PoUserGuideService` permite apresentar uma sequência de passos visuais para orientar
o usuário durante o uso de uma tela, funcionalidade ou fluxo específico do sistema.
Ele pode ser utilizado, por exemplo, para apresentar uma nova funcionalidade, guiar um
primeiro acesso ou destacar pontos importantes da interface.

O serviço centraliza a configuração do guia do usuário, incluindo:

- os passos que serão exibidos;
- as opções gerais de comportamento;
- o controle do passo ativo;
- os eventos emitidos durante o ciclo de vida do tour.

A partir dele, a aplicação pode iniciar, acompanhar e reagir à execução do tour por meio
dos eventos públicos `tourStartServiço responsável por criar e controlar tours guiados na interface da aplicação.

O `PoUserGuideService` permite apresentar uma sequência de passos visuais para orientar
o usuário durante o uso de uma tela, funcionalidade ou fluxo específico do sistema.
Ele pode ser utilizado, por exemplo, para apresentar uma nova funcionalidade, guiar um
primeiro acesso ou destacar pontos importantes da interface.

O serviço centraliza a configuração do guia do usuário, incluindo:

- os passos que serão exibidos;
- as opções gerais de comportamento;
- o controle do passo ativo;
- os eventos emitidos durante o ciclo de vida do tour.

A partir dele, a aplicação pode iniciar, acompanhar e reagir à execução do tour por meio
dos eventos públicos , `stepChangeServiço responsável por criar e controlar tours guiados na interface da aplicação.

O `PoUserGuideService` permite apresentar uma sequência de passos visuais para orientar
o usuário durante o uso de uma tela, funcionalidade ou fluxo específico do sistema.
Ele pode ser utilizado, por exemplo, para apresentar uma nova funcionalidade, guiar um
primeiro acesso ou destacar pontos importantes da interface.

O serviço centraliza a configuração do guia do usuário, incluindo:

- os passos que serão exibidos;
- as opções gerais de comportamento;
- o controle do passo ativo;
- os eventos emitidos durante o ciclo de vida do tour.

A partir dele, a aplicação pode iniciar, acompanhar e reagir à execução do tour por meio
dos eventos públicos `tourStartServiço responsável por criar e controlar tours guiados na interface da aplicação.

O `PoUserGuideService` permite apresentar uma sequência de passos visuais para orientar
o usuário durante o uso de uma tela, funcionalidade ou fluxo específico do sistema.
Ele pode ser utilizado, por exemplo, para apresentar uma nova funcionalidade, guiar um
primeiro acesso ou destacar pontos importantes da interface.

O serviço centraliza a configuração do guia do usuário, incluindo:

- os passos que serão exibidos;
- as opções gerais de comportamento;
- o controle do passo ativo;
- os eventos emitidos durante o ciclo de vida do tour.

A partir dele, a aplicação pode iniciar, acompanhar e reagir à execução do tour por meio
dos eventos públicos ,  e .

Como o serviço é disponibilizado com `providedIn: 'root'`, não é necessário declará-lo em
`providers` nem importá-lo manualmente em módulos específicos.
Ele pode ser injetado diretamente em qualquer componente, serviço ou diretiva da aplicação.

#### Uso típico

O fluxo recomendado de utilização do serviço, que pode ser encadeado fluentemente, configura os
passos do tour, ajusta opções globais e dispara a execução em uma única expressão:

```typescript
import { Component } from '@angular/core';
import { PoUserGuideService } from '@po-ui/ng-components';

@Component({ selector: 'app-onboarding', templateUrl: './onboarding.component.html' })
export class OnboardingComponent {
  constructor(private PoUserGuide: PoUserGuideService) {}

  startTour(): void {
    this.PoUserGuide
      .setSteps([
        { element: '#header', title: 'Bem-vindo!', content: 'Esta é a barra superior.' },
        { element: '<po-menu>', title: 'Menu', content: 'Acesse aqui as funcionalidades do sistema.' },
        { element: '#user-profile', title: 'Perfil', content: 'Configure suas preferências.' }
      ])
      .setOptions({ showProgress: true, allowClose: true })
      .start();
  }
}
```

#### Boas práticas para seleção de elementos

Ao configurar o elemento que será destacado em cada passo do tour, recomenda-se evitar
seletores baseados em classes internas, estruturas de HTML ou elementos muito genéricos,
como `.minha-classe`, `div`, `span` ou combinações dependentes da hierarquia da página.

Esses seletores podem ser sensíveis a mudanças de implementação, refatorações visuais ou
alterações nos nomes de classes, o que pode fazer com que o passo deixe de encontrar o
elemento esperado.

Quando o passo destacar um componente do PO-UI, prefira utilizar o próprio seletor do
componente, como: `po-button`, `po-input`, `po-combo` ou `po-table`, sempre que isso for
suficiente para identificar o elemento corretamente.

Quando houver mais de um componente igual na tela ou quando for necessário apontar para
um elemento específico, recomenda-se adicionar um `id` no elemento alvo ou encapsular a
área desejada em um elemento próprio da aplicação.

#### Aviso de segurança: HTML em `step.content`

O PO UI sanitiza o conteúdo HTML informado em `step.content` antes de exibi-lo no
popover* do tour, ajudando a prevenir vulnerabilidades de *Cross-Site Scripting* (XSS).

A mesma proteção é aplicada aos *labels* definidos em `PoUserGuideStep` e
`PoUserGuideOptions` quando construídos dinamicamente.

Ainda assim, recomenda-se validar conteúdos vindos de fontes não confiáveis, como entrada
do usuário, APIs externas ou *query strings*, preservando a segurança desde a origem dos dados.

#### Tokens customizáveis

É possível alterar a aparência do *popover* renderizado pelo `PoUserGuideService` através dos tokens
(CSS) consumidos pelo arquivo `po-user-guide.css` distribuído via `@po-ui/style`.

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|--------------------------------------------------|--------------------------------------------------------------------------|--------------------------------------------------------|
| **Overlay** | | |
| `--color-po-user-guide-overlay` | Cor do *overlay* que escurece a página durante o tour | `var(--color-neutral-dark-80)` |
| **Popover** | | |
| `--font-family` | Família tipográfica usada no *popover* | `var(--font-family-theme)` |
| `--color` | Cor padrão do texto do *popover* | `var(--color-neutral-dark-70)` |
| `--background-color` | Cor de fundo do *popover* | `var(--color-neutral-light-00)` |
| `--border-color` | Cor da borda do *popover* | `var(--color-neutral-light-20)` |
| `--border-width` | Espessura da borda do *popover* | `var(--border-width-sm)` |
| `--border-radius` | Raio dos cantos do *popover* | `var(--border-radius-md)` |
| `--shadow` | Sombra projetada pelo *popover* | `var(--shadow-lg)` |
| `--padding` | Espaçamento interno do *popover* | `var(--spacing-sm)` |
| `--max-width` | Largura máxima do *popover* | `360px` |
| `--arrow-color` | Cor da seta que aponta para o elemento destacado | `var(--color-neutral-light-00)` |
| **Título** | | |
| `--title-font-size` | Tamanho da fonte do título | `var(--font-size-default)` |
| `--title-font-weight` | Peso da fonte do título | `var(--font-weight-bold)` |
| `--title-line-height` | Altura de linha do título | `var(--line-height-sm)` |
| `--title-color` | Cor do texto do título | `var(--color-neutral-dark-95)` |
| `--title-margin-bottom` | Espaçamento inferior do título | `var(--spacing-xs)` |
| **Descrição** | | |
| `--description-font-size` | Tamanho da fonte da descrição | `var(--font-size-sm)` |
| `--description-font-weight` | Peso da fonte da descrição | `var(--font-weight-normal)` |
| `--description-line-height` | Altura de linha da descrição | `var(--line-height-md)` |
| `--description-color` | Cor do texto da descrição | `var(--color-neutral-dark-70)` |
| `--description-margin-bottom` | Espaçamento inferior da descrição | `var(--spacing-xs)` |
| **Progresso** | | |
| `--progress-font-size` | Tamanho da fonte do indicador de progresso | `var(--font-size-xs)` |
| `--progress-font-weight` | Peso da fonte do indicador de progresso | `var(--font-weight-normal)` |
| `--progress-line-height` | Altura de linha do indicador de progresso | `var(--line-height-sm)` |
| `--progress-color` | Cor do texto do indicador de progresso | `var(--color-neutral-mid-60)` |
| **Rodapé** | | |
| `--footer-margin-top` | Espaçamento superior do rodapé | `var(--spacing-xs)` |
| `--footer-gap` | Espaçamento entre os botões de navegação | `var(--spacing-xxs)` |
| `--footer-gap-tertiary` | Espaçamento adicional aplicado ao botão terciário | `var(--spacing-sm)` |
| **Botões - base** | | |
| `--button-font-weight` | Peso da fonte dos botões | `var(--font-weight-bold)` |
| `--button-font-size` | Tamanho da fonte dos botões | `var(--font-size-sm)` |
| `--button-line-height` | Altura de linha dos botões | `var(--line-height-none)` |
| `--button-border-width` | Espessura da borda dos botões | `var(--border-width-md)` |
| `--button-border-radius` | Raio dos cantos dos botões | `var(--border-radius-md)` |
| `--button-padding` | Espaçamento interno dos botões | `var(--spacing-xs) var(--spacing-sm)` |
| **Botão primário (`Próximo` / `Finalizar`)** | | |
| `--button-primary-text-color` | Cor do texto do botão primário | `var(--color-neutral-light-00)` |
| `--button-primary-color` | Cor de fundo do botão primário | `var(--color-action-default)` |
| `--button-primary-color-hover` | Cor de fundo do botão primário no estado *hover* | `var(--color-action-hover)` |
| `--button-primary-color-pressed` | Cor de fundo do botão primário no estado *pressed* | `var(--color-action-pressed)` |
| `--button-primary-border-color` | Cor da borda do botão primário | `var(--color-action-default)` |
| `--button-primary-shadow` | Sombra do botão primário | `var(--shadow-none)` |
| `--button-primary-text-color-disabled` | Cor do texto do botão primário desabilitado | `var(--color-neutral-dark-70)` |
| `--button-primary-color-disabled` | Cor de fundo do botão primário desabilitado | `var(--color-neutral-light-30)` |
| `--button-primary-border-color-disabled` | Cor da borda do botão primário desabilitado | `var(--color-transparent)` |
| **Botão terciário (`Anterior`)** | | |
| `--button-tertiary-color` | Cor do texto do botão terciário | `var(--color-action-default)` |
| `--button-tertiary-color-hover` | Cor do texto do botão terciário no estado *hover* | `var(--color-brand-01-darkest)` |
| `--button-tertiary-color-pressed` | Cor do texto do botão terciário no estado *pressed* | `var(--color-brand-01-darker)` |
| `--button-tertiary-background-color` | Cor de fundo do botão terciário | `var(--color-transparent)` |
| `--button-tertiary-background-hover` | Cor de fundo do botão terciário no estado *hover* | `var(--color-brand-01-lighter)` |
| `--button-tertiary-background-pressed` | Cor de fundo do botão terciário no estado *pressed* | `var(--color-brand-01-light)` |
| `--button-tertiary-border-color` | Cor da borda do botão terciário | `var(--color-transparent)` |
| `--button-tertiary-border-color-hover` | Cor da borda do botão terciário no estado *hover* | `var(--color-transparent)` |
| `--button-tertiary-border-color-pressed` | Cor da borda do botão terciário no estado *pressed* | `var(--color-transparent)` |
| `--button-tertiary-shadow` | Sombra do botão terciário | `var(--shadow-none)` |
| `--button-tertiary-color-disabled` | Cor do texto do botão terciário desabilitado | `var(--color-neutral-light-30)` |
| `--button-tertiary-background-disabled` | Cor de fundo do botão terciário desabilitado | `var(--color-transparent)` |
| `--button-tertiary-border-color-disabled` | Cor da borda do botão terciário desabilitado | `var(--color-transparent)` |
| **Botão fechar (`X`)** | | |
| `--button-close-color` | Cor do botão fechar | `var(--color-neutral-mid-60)` |
| `--button-close-color-hover` | Cor do botão fechar no estado *hover* | `var(--color-action-hover)` |
| `--button-close-color-pressed` | Cor do botão fechar no estado *pressed* | `var(--color-action-pressed)` |
| `--button-close-color-focused` | Cor do botão fechar no estado de foco visível | `var(--color-action-focus)` |
| `--button-close-background-color` | Cor de fundo do botão fechar | `var(--color-transparent)` |
| `--button-close-background-hover` | Cor de fundo do botão fechar no estado *hover* | `var(--color-neutral-light-10)` |
| `--button-close-background-pressed` | Cor de fundo do botão fechar no estado *pressed* | `var(--color-neutral-light-20)` |
| `--button-close-border-color` | Cor da borda do botão fechar | `var(--color-transparent)` |
| `--button-close-font-size` | Tamanho da fonte/ícone do botão fechar | `var(--font-size-md)` |
| `--button-close-padding` | Espaçamento interno do botão fechar | `var(--spacing-xxs) var(--spacing-xs)` |
| `--button-close-color-disabled` | Cor do botão fechar desabilitado | `var(--color-neutral-light-30)` |
| `--button-close-background-disabled` | Cor de fundo do botão fechar desabilitado | `var(--color-transparent)` |
| `--button-close-border-color-disabled` | Cor da borda do botão fechar desabilitado | `var(--color-transparent)` |
| **Foco visível** | | |
| `--outline-color-focused` | Cor do *outline* aplicado aos botões em foco visível | `var(--color-action-focus)` |
