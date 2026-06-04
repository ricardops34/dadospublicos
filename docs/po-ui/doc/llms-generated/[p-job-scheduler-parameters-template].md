# PoJobSchedulerParametersTemplateDirective

**Seletor:** `[p-job-scheduler-parameters-template]`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/[p-job-scheduler-parameters-template]

Esta diretiva permite personalizar o conteúdo da uma ou várias etapa(s) de parametrização do componente de PoPageJobScheduler.

Para repassar as alterações realizadas no componente customizado ao model do PoPageJobScheduler, deve
ser atualizado os valores através da propriedade p-execution-parameter. Dessa forma as alterações serão adicionadas ao
atributo executionParameter do objeto de envio a Api.
É possível também controlar a permissão de avançar, fazendo uso da propriedade p-disable-advance.

```
...
<po-page-job-scheduler [p-service-api]="serviceApi">
    <ng-template p-job-scheduler-parameters-template
     [p-execution-parameter]="executionParameter"
     [p-disable-advance]="disableAdvance"
     p-label-step="titleStep"
    >
      ...
    </ng-template>
    <ng-template p-job-scheduler-parameters-template
     [p-execution-parameter]="executionParameter"
     [p-disable-advance]="disableAdvance"
     p-label-step="titleStep"
    >
      ...
    </ng-template>
</po-page-job-scheduler>
...
```

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `disabledAdvance` | `'p-disable-advance'` | `boolean` | sim | false
 | Determina se deve desabilitar o botão de avançar para a próxima etapa |
| `executionParameter` | `'p-execution-parameter'` | `object` | sim | - | Objeto que deve conter as alterações feitas pelo componente de template que serão repassadas dentro do atributo |
| `title` | `'p-label-step'` | `string` | sim | - | Determina o label do step |
