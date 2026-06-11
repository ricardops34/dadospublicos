# PoUserGuideStep

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-user-guide-step

Interface que descreve um passo individual do tour guiado executado pelo `PoUserGuideService`.

Cada passo representa uma parada do tour, com um elemento opcional a ser destacado na página,
conteúdo textual ou em HTML, configurações de posicionamento do popover, *labels* específicos
dos botões de navegação e *hooks* de ciclo de vida do passo.

> A propriedade `content` é a única obrigatória e corresponde ao corpo do popover apresentado ao usuário.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `align` | `PoUserGuideAlignment` | sim | Alinhamento do popover ao longo do eixo da posição configurada em `position`. |
| `content` | `string` | não | Conteúdo principal do passo, exibido no corpo do popover. Aceita texto puro ou HTML. |
| `doneLabel` | `string` | sim | Sobrescreve o *label* do botão "Finalizar" exclusivamente para este passo. |
| `element` | `string | HTMLElement` | sim | Elemento da página que o passo deve destacar. |
| `nextLabel` | `string` | sim | Sobrescreve o *label* do botão "Próximo" exclusivamente para este passo. |
| `onBeforeHighlight` | `(step: PoUserGuideStep, index: number) => void` | sim | Hook* executado imediatamente antes de o passo ser destacado na página, sincronamente à transição. |
| `onDeselected` | `(step: PoUserGuideStep, index: number) => void` | sim | Hook* executado quando o passo deixa de estar ativo, seja por avanço, retrocesso ou encerramento do tour. |
| `onHighlighted` | `(step: PoUserGuideStep, index: number) => void` | sim | Hook* executado imediatamente após o passo ser destacado na página. |
| `position` | `PoUserGuidePosition` | sim | Posição preferida do popover em relação ao elemento destacado. |
| `previousLabel` | `string` | sim | Sobrescreve o *label* do botão "Anterior" exclusivamente para este passo. |
| `showButtons` | `Array<'next' | 'previous' | 'close'>` | sim | Lista que filtra quais botões de navegação devem ser exibidos no popover deste passo. |
| `title` | `string` | sim | Título exibido no cabeçalho do popover do passo. |
