# PoStepComponent

**Seletor:** `po-step`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-step

O componente `po-step` é utilizado para envolver e renderizar o conteúdo de um passo (*step*) do `po-stepper`, por exemplo:

```
<po-stepper>

   <po-step p-label="Endereço">

       <!-- Conteúdo referente ao endereço -->

   </po-step>

   <po-step p-label="Pagamento">

       <!-- Conteúdo referente ao pagamento -->

   </po-step>

 </po-stepper>
```

A renderização do conteúdo envolvido na tela e o controle dos status são feitos automaticamente. No qual, o primeiro
`po-step` encontrado será colocado como ativo, o próximo fica com o status *default* e os demais ficam
desabilitados (*disabled*).

Ao clicar no `po-step` que está com o status *default*, o que está ativo ficará com o
status de concluído (*done*) e o próximo que estava desabilitado ficará com o status *default* e o restante permanecerá
com o status desabilitado.

> Ao utilizar o `po-step`, o componente `po-stepper` funcionará de forma sequencial, ou seja, não será possível
pular para outro `po-step` que esteja com o status igual a desabilitado (*disabled*).

Acesse a [documentação do `po-stepper`](/documentation/po-stepper) para ter mais informações sobre o seu funcionamento
e exemplos de uso.

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `canActiveNextStep` | `'p-can-active-next-step'` | `((currentStep) => boolean) | ((currentStep) => Observable<boolean>)` | sim | - | Função chamada quando o próximo *step* for clicado ou quando o método `PoStepperComponent.next()` for chamado. |
| `iconDefault` | `'p-icon-default'` | `string | TemplateRef<void>` | sim | - | Define o ícone padrão do step em seu status *default*. |
| `label` | `'p-label'` | `string` | não | - | Título que será exibido descrevendo o passo (*step*). |
