# PoUserGuideOptions

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-user-guide-options

Interface que descreve as opções globais de configuração do tour guiado executado pelo `PoUserGuideService`.

Os valores informados são aplicados a toda a execução do tour e podem ser sobrescritos pontualmente
em cada `PoUserGuideStep` através das propriedades específicas de *labels* (`nextLabel`, `previousLabel`,
`doneLabel`) — neste caso, o valor declarado no passo prevalece sobre o valor declarado nas opções globais.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `allowClose` | `boolean` | sim | Permite que o usuário encerre o tour clicando fora do popover ou utilizando o botão "Fechar" (X). |
| `allowScroll` | `boolean` | sim | Quando `true`, mantém a rolagem da página totalmente livre durante o tour. |
| `closeLabel` | `string` | sim | Label* padrão do botão "Fechar" (X) exibido no canto do popover do tour. |
| `doneLabel` | `string` | sim | Label* padrão do botão "Finalizar" aplicado ao último passo do tour. |
| `keyboardControl` | `boolean` | sim | Habilita/desabilita o controle do tour por teclado (valor padrão: `true`). |
| `literals` | `PoUserGuideLiterals` | sim | Objeto com as literais usadas no `po-user-guide`. |
| `nextLabel` | `string` | sim | Label* padrão do botão "Próximo" aplicado a todos os passos do tour. |
| `onStepChange` | `(event: PoUserGuideStepChangeEvent) => void` | sim | Função de *callback* invocada a cada mudança de passo durante a execução do tour. |
| `overlayOpacity` | `number` | sim | Define a opacidade do *overlay* que escurece a página ao redor do elemento destacado. |
| `popoverClass` | `string` | sim | Classe CSS adicional aplicada ao elemento raiz do popover do tour. |
| `previousLabel` | `string` | sim | Label* padrão do botão "Anterior" aplicado a todos os passos do tour. |
| `progressTemplate` | `string` | sim | Template do texto de progresso exibido no popover quando `showProgress` está habilitado. |
| `showProgress` | `boolean` | sim | Exibe o indicador textual de progresso do tour no popover (por exemplo, `1 de 5`). |
