# PoSyncConfig

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-sync-config

Interface para a definição das configurações do sincronismo.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `dataTransform` | `PoDataTransform` | sim | Classe usada para a trasformação dos dados nas requisições. |
| `period` | `number` | sim | Tempo em segundos do sicronismo periódico. |
| `type` | `PoNetworkType | Array<PoNetworkType>` | não | Tipos de conexões permitidas para o sincronismo. |
