# PoUserGuideStartEvent

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-user-guide-start-event

Interface que descreve o evento emitido pelo `PoUserGuideService` no início da execução de um tour guiado.

É publicado no `Observable` `PoUserGuideService.tourStartInterface que descreve o evento emitido pelo `PoUserGuideService` no início da execução de um tour guiado.

É publicado no `Observable`  exatamente uma vez por execução, imediatamente
após a configuração da instância do tour e antes da emissão do primeiro `PoUserGuideStepChangeEvent` em
`PoUserGuideService.stepChangeInterface que descreve o evento emitido pelo `PoUserGuideService` no início da execução de um tour guiado.

É publicado no `Observable` `PoUserGuideService.tourStartInterface que descreve o evento emitido pelo `PoUserGuideService` no início da execução de um tour guiado.

É publicado no `Observable`  exatamente uma vez por execução, imediatamente
após a configuração da instância do tour e antes da emissão do primeiro `PoUserGuideStepChangeEvent` em
.

As aplicações consumidoras podem assinar `tourStartInterface que descreve o evento emitido pelo `PoUserGuideService` no início da execução de um tour guiado.

É publicado no `Observable` `PoUserGuideService.tourStartInterface que descreve o evento emitido pelo `PoUserGuideService` no início da execução de um tour guiado.

É publicado no `Observable`  exatamente uma vez por execução, imediatamente
após a configuração da instância do tour e antes da emissão do primeiro `PoUserGuideStepChangeEvent` em
`PoUserGuideService.stepChangeInterface que descreve o evento emitido pelo `PoUserGuideService` no início da execução de um tour guiado.

É publicado no `Observable` `PoUserGuideService.tourStartInterface que descreve o evento emitido pelo `PoUserGuideService` no início da execução de um tour guiado.

É publicado no `Observable`  exatamente uma vez por execução, imediatamente
após a configuração da instância do tour e antes da emissão do primeiro `PoUserGuideStepChangeEvent` em
.

As aplicações consumidoras podem assinar  para registrar telemetria do início do tour,
exibir mensagens contextuais ou disparar lógica de negócio dependente do início da jornada do usuário.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `startIndex` | `number` | não | Índice do passo inicial do tour, com base zero. |
| `timestamp` | `number` | não | Marca de tempo, em milissegundos, do momento de emissão do evento, obtida a partir de `Date.now()`. |
| `totalSteps` | `number` | não | Total de passos configurados no tour, equivalente ao tamanho do array passado a `PoUserGuideService.setSteps`. |
