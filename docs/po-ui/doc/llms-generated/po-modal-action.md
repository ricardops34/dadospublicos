# PoModalAction

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-modal-action

Interface que define os botões de ação do componente `po-modal`.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `action` | `Function` | não | Função que será executada ao clicar sobre o botão. |
| `danger` | `boolean` | sim | Define a propriedade `p-danger` do botão. |
| `disabled` | `boolean` | sim | Desabilita o botão impossibilitando que sua ação seja executada. |
| `icon` | `string | TemplateRef<void>` | sim | Ícone exibido ao lado esquerdo do label do botão. |
| `label` | `string` | não | Rótulo do botão. |
| `loading` | `boolean` | sim | Habilita um estado de carregamento ao botão, desabilitando-o e exibindo um ícone de carregamento à esquerda de seu rótulo. |
