# PoPageLoginCustomField

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-login-custom-field

Interface com a definição do Custom Field, podendo ser utilizado para informar um campo customizado no componente `po-page-login`.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `errorPattern` | `string` | sim | Mensagem que será exibida quando a expressão regular informada na propriedade `pattern` não for válida. |
| `fieldValue` | `string` | sim | Deve ser informado o nome da propriedade do objeto que será utilizado para a conversão dos itens apresentados na |
| `options` | `Array<PoSelectOption>` | sim | Lista de opções de um `po-select`. |
| `pattern` | `string` | sim | Expressão regular para validar o campo customizado, caso a expressão não seja atendida a literal informada na |
| `placeholder` | `string` | sim | Mensagem que será exibida enquanto o campo customizado não estiver preenchido. |
| `property` | `string` | não | Nome da propriedade que será utilizado no campo customizado. |
| `url` | `string` | sim | Nesta propriedade deve ser informada a URL do serviço em que será realizado o filtro para carregamento da |
| `value` | `string | number` | sim | Valor do campo customizado. |
