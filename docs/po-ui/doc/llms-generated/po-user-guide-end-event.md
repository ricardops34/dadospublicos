# PoUserGuideEndEvent

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-user-guide-end-event

Interface que descreve o evento emitido pelo `PoUserGuideService` no encerramento da execução de um tour guiado.

É publicado no `Observable` `PoUserGuideService.tourEndInterface que descreve o evento emitido pelo `PoUserGuideService` no encerramento da execução de um tour guiado.

É publicado no `Observable`  exatamente uma vez por execução, sempre após a
emissão do último `PoUserGuideStepChangeEvent` em `PoUserGuideService.stepChangeInterface que descreve o evento emitido pelo `PoUserGuideService` no encerramento da execução de um tour guiado.

É publicado no `Observable` `PoUserGuideService.tourEndInterface que descreve o evento emitido pelo `PoUserGuideService` no encerramento da execução de um tour guiado.

É publicado no `Observable`  exatamente uma vez por execução, sempre após a
emissão do último `PoUserGuideStepChangeEvent` em  e após a limpeza do estado
interno do serviço.

As aplicações consumidoras podem assinar `tourEndInterface que descreve o evento emitido pelo `PoUserGuideService` no encerramento da execução de um tour guiado.

É publicado no `Observable` `PoUserGuideService.tourEndInterface que descreve o evento emitido pelo `PoUserGuideService` no encerramento da execução de um tour guiado.

É publicado no `Observable`  exatamente uma vez por execução, sempre após a
emissão do último `PoUserGuideStepChangeEvent` em `PoUserGuideService.stepChangeInterface que descreve o evento emitido pelo `PoUserGuideService` no encerramento da execução de um tour guiado.

É publicado no `Observable` `PoUserGuideService.tourEndInterface que descreve o evento emitido pelo `PoUserGuideService` no encerramento da execução de um tour guiado.

É publicado no `Observable`  exatamente uma vez por execução, sempre após a
emissão do último `PoUserGuideStepChangeEvent` em  e após a limpeza do estado
interno do serviço.

As aplicações consumidoras podem assinar  para registrar telemetria de conclusão ou de
abandono do tour, executar limpezas de UI ou disparar lógica de negócio dependente do encerramento
da jornada do usuário.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `lastIndex` | `number` | não | Índice, com base zero, do último passo ativo antes do encerramento do tour. |
| `reason` | `'completed' | 'closed'` | não | Motivo do encerramento do tour. |
| `totalSteps` | `number` | não | Total de passos configurados no tour, equivalente ao tamanho do array passado a `PoUserGuideService.setSteps`. |
