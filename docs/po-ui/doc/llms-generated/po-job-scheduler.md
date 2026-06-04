# PoJobScheduler

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-job-scheduler

Estrutura do *payload* enviado nas requisições para salvar e/ou atualizar as tarefas do *Job Scheduler*.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `daily` | `{
    hour: number;
    minute: number;
}` | sim | Define uma repetição diária. |
| `executionParameter` | `object` | sim | Objeto contendo os nomes das propriedades dos parâmetros e os valores preenchidos pelo usuário. |
| `firstExecution` | `string` | sim | Data da primeira execução. |
| `monthly` | `{
    day: number;
    hour: number;
    minute: number;
}` | sim | Define uma repetição mensal. |
| `processID` | `string` | não | Identificador do processo. |
| `recurrent` | `boolean` | sim | Permite uma execução recorrente. |
| `weekly` | `{
    daysOfWeek: Array<string>;
    hour: number;
    minute: number;
}` | sim | Define uma repetição semanal. |
