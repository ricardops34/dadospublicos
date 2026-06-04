# PoPageDynamicTableActions

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-dynamic-table-actions

Interface para as ações do componente po-page-dynamic-table.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `beforeDetail` | `string | ((id?: string, resource?: any) => PoPageDynamicTableBeforeDetail)` | sim | Método/URL que deve ser chamado antes da ação de ir para o detalhe |
| `beforeDuplicate` | `string | ((key: string, resource: any) => PoPageDynamicTableBeforeDuplicate)` | sim | Rota ou método que será chamado antes de duplicar um recurso (duplicate). O método recebe os parâmetros `key` e também um objeto com as propriedades marcadas com `duplicate: true`. |
| `beforeEdit` | `string | ((id: any, resource: any) => PoPageDynamicTableBeforeEdit)` | sim | Rota ou método que será chamado antes de editar um recurso (edit). |
| `beforeNew` | `string | (() => PoPageDynamicTableBeforeNew)` | sim | Método/URL que deve ser chamado antes da ação de inclusão |
| `beforeRemove` | `string | ((id?: string, resource?: any) => PoPageDynamicTableBeforeRemove)` | sim | Método/URL que deve ser chamado antes da ação de exclusão |
| `beforeRemoveAll` | `string | ((resources?: Array<any>) => PoPageDynamicTableBeforeRemoveAll)` | sim | Método/URL que deve ser chamado antes de executar o evento de exclusão em lote (removeAll). |
| `detail` | `string | ((id: string, resource: any) => void)` | sim | Rota ou função para exibição do recurso em detalhe, caso seja preenchida irá habilitar a ação de visualização na tabela. |
| `duplicate` | `string | ((resource: any) => void)` | sim | Rota ou função para duplicação do recurso, caso seja preenchida irá habilitar a ação de duplicação na tabela. |
| `edit` | `string | ((id: string, resource: any) => {
    [key: string]: any;
})` | sim | Rota ou função para edição do recurso, caso seja preenchida irá habilitar a ação de edição na tabela. |
| `new` | `string | Function` | sim | Rota ou função para criar um novo recurso, caso seja preenchida sera exibido uma ação no topo da página. |
| `remove` | `boolean | ((id: string, resource: any) => boolean)` | sim | Habilita a ação de exclusão na tabela. |
| `removeAll` | `boolean | ((resources: Array<any>) => Array<any>)` | sim | Habilita a ação de exclusão em lote na página. |
