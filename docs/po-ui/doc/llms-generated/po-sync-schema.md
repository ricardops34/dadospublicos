# PoSyncSchema

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-sync-schema

Interface que irá mapear as informações dos recursos, principalmente sua origem e as informações que serão retornadas.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `createdAtField` | `string` | sim | Nome da propriedade que informa a data de criação do registro. |
| `deleteUrlApi` | `string` | sim | Endereço do endpoint para excluir registros. |
| `deletedAtField` | `string` | sim | Nome da propriedade que informa a data de deleção. |
| `deletedField` | `string` | não | Nome da propriedade que informa se o registro foi excluído. |
| `diffUrlApi` | `string` | não | Endereço do endpoint que proverá apenas dados alterados no servidor. |
| `fields` | `Array<string | PoSyncFieldOptions>` | não | Campos que serão retornados pela API. |
| `getUrlApi` | `string` | não | Endereço do endpoint que utiliza o método GET que proverá os dados. |
| `idField` | `string` | não | Nome da propriedade referente ao identificador único para os itens do *schema*. |
| `name` | `string` | não | Identifição para representar o *schema*. |
| `pageSize` | `number` | não | Quantidade de itens por página que será enviado pela API. |
| `patchUrlApi` | `string` | sim | Endereço do endpoint que utiliza o método PUT para atualizar registros. |
| `postUrlApi` | `string` | sim | Endereço do endpoint que utiliza o método POST para incluir os registros. |
| `updatedAtField` | `string` | sim | Nome da propriedade que informa a data de atualização do registro. |
