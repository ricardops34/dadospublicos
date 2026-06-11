# PoUserGuideStepChangeEvent

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-user-guide-step-change-event

Interface que descreve o evento emitido pelo `PoUserGuideService` a cada mudança de passo durante a execução do tour.

É publicado no `Observable` `PoUserGuideService.stepChangeInterface que descreve o evento emitido pelo `PoUserGuideService` a cada mudança de passo durante a execução do tour.

É publicado no `Observable`  toda vez que o passo ativo é alterado, seja por
interação do usuário (cliques nos botões "Próximo"/"Anterior" ou navegação por teclado) ou por chamada
programática aos métodos `next`, `previous`, `goTo` e `start` do `PoUserGuideService`.

As aplicações consumidoras podem assinar `stepChangeInterface que descreve o evento emitido pelo `PoUserGuideService` a cada mudança de passo durante a execução do tour.

É publicado no `Observable` `PoUserGuideService.stepChangeInterface que descreve o evento emitido pelo `PoUserGuideService` a cada mudança de passo durante a execução do tour.

É publicado no `Observable`  toda vez que o passo ativo é alterado, seja por
interação do usuário (cliques nos botões "Próximo"/"Anterior" ou navegação por teclado) ou por chamada
programática aos métodos `next`, `previous`, `goTo` e `start` do `PoUserGuideService`.

As aplicações consumidoras podem assinar  para reagir à navegação do usuário, atualizar a
UI conforme o passo ativo, registrar telemetria de progresso ou disparar lógica de negócio contextual.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `direction` | `'next' | 'previous' | 'goto' | 'start'` | não | Direção da transição que originou a mudança de passo. |
| `index` | `number` | não | Índice, com base zero, do passo ativo após a transição. |
| `step` | `PoUserGuideStep` | não | Passo do tour que se tornou ativo após a transição. |
| `totalSteps` | `number` | não | Total de passos configurados no tour, equivalente ao tamanho do array passado a `PoUserGuideService.setSteps`. |
