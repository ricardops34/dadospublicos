# PoStepperItem

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-stepper-item

Interface para definição dos *steps* do componente `po-stepper` quando utilizada a propriedade `p-steps`.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `iconActive` | `string | TemplateRef<void>` | sim | Define o ícone do *step* ativo. |
| `iconDefault` | `string | TemplateRef<void>` | sim | Define o ícone do *step* default. |
| `iconDone` | `string | TemplateRef<void>` | sim | Define o ícone do *step* concluído. |
| `id` | `string` | sim | Identificador único do step. |
| `label` | `string` | sim | Texto do item do stepper. |
| `status` | `PoStepperStatus` | sim | Define o estado de exibição do *step*. |
