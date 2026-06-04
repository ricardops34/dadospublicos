# PoStorageConfig

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-storage-config

Interface para as configurações da base de dados local do `PoStorageService`.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `driverOrder` | `Array<string>` | sim | Ordem de preferência dos *drivers* para gravação dos dados. |
| `name` | `string` | sim | Nome da base de dados. |
| `storeName` | `string` | sim | Nome da coleção onde os dados serão armazenados. Deve ser alfanumérico e conter "_"(underscores). |
