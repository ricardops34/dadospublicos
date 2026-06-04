# PoCalendarRangePreset

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-calendar-range-preset

Interface para definir um preset de intervalo de datas no calendário.

Cada preset possui um rótulo identificador e uma função que calcula
dinamicamente o intervalo de datas com base na data atual.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `dateRange` | `(today: Date) => {
    start: Date;
    end: Date;
}` | não | Função que calcula dinamicamente o intervalo de datas relativo à data informada. |
| `label` | `string` | não | Identificador/rótulo de exibição do preset. |
