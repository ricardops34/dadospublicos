# PoStepperComponent

**Seletor:** `po-stepper`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-stepper

O `po-stepper` permite que um processo seja dividido em passos para que o usuário o realize
mais facilmente.

Existem duas formas de utilização:

1 - Usando o componente [**po-step**](/documentation/po-step) para renderizar e descrever os passos.

2 - Através da propriedade `p-steps` para descrever os passos do processo, sendo responsabilidade do desenvolvedor o controle
de renderização do que será exibido a cada *step* ativo.

Através de suas propriedades, é possível definir se sua orientação será horizontal ou vertical,
além da possibilidade de aumentar o tamanho dos *steps*.

Também é possível navegar entre os *steps* através do teclado utilizando a tecla *tab* e, para ativar o *step* em foco basta
pressionar a tecla *enter*. Além disso, é possível ativar a exibição de ícones no lugar de números nos *steps* através da
propriedade [`p-step-icons`](/documentation/po-stepper#stepIconsProperty).

#### Utilizando os métodos do componente:

Para acessar os métodos do componente é necessário ter a referência do mesmo.

Por exemplo, utilizando um [**ViewChild**](https://angular.io/api/core/ViewChild):

```
@ViewChild(PoStepperComponent) poStepperComponent: PoStepperComponent;
```

E para acessar o método:

```
poStepperComponent.next();
```

#### Boas práticas

- Evite `labels` extensos que quebram o layout do `po-stepper`, use `labels` diretos, curtos e intuitivos.
- Utilize apenas um `po-stepper` por página.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|------------------------------------------|-------------------------------------------------------|---------------------------------------------------|
| **Label** | | |
| `--font-family` | Família tipográfica usada | `var(--font-family-theme)` |
| `--font-size` | Tamanho da fonte | `var(--font-size-default)` |
| `--font-weight` | Peso da fonte | `var(--font-weight-normal)` |
| **Step - Done** | | |
| `--text-color` | Cor do texto no step concluído | `var(--color-neutral-dark-70)` |
| `--color-icon-done` | Cor do ícone no step concluído | `var(--color-neutral-dark-70)` |
| `--background-done` | Cor de fundo no step concluído | `var(--color-neutral-light-00)` |
| **Line - Done** | | |
| `--color-line-done` | Cor da linha no step concluído | `var(--color-neutral-mid-40)` |
| **Step - Current** | | |
| `--color-icon-current` | Cor do ícone no step atual | `var(--color-neutral-light-00)` |
| `--background-current` | Cor de fundo no step atual | `var(--color-action-default)` |
| `--font-weight-current` | Peso da fonte no step atual | `var(--font-weight-bold)` |
| **Step - Next** | | |
| `--font-size-circle` | Tamanho da fonte no círculo do próximo step | `var(--font-size-sm)` |
| `--color-next` | Cor do ícone no próximo step | `var(--color-action-disabled)` |
| `--text-color-next` | Cor do texto no próximo step | `var(--color-neutral-light-30)` |
| **Focused** | | |
| `--outline-color-focused` | Cor do outline do estado de focus | `var(--color-action-focus)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `alignCenter` | `'p-align-center'` | `boolean` | sim | `true` | Define o alinhamento dos *steps* e *labels* no *stepper*, dependendo da orientação. |
| `disabledClick` | `'p-disable-click'` | `boolean` | sim | `false` | Desabilita o clique nos steps. |
| `iconActive` | `'p-step-icon-active'` | `string | TemplateRef<void>` | sim | `po-icon-edit` | Permite definir o ícone do step no status ativo. |
| `iconDone` | `'p-step-icon-done'` | `string | TemplateRef<void>` | sim | `po-icon-ok` | Permite definir o ícone do step no status concluído. |
| `orientation` | `'p-orientation'` | `PoStepperOrientation` | sim | `PoStepperOrientation.Horizontal` | Define a orientação de exibição do `po-stepper`. |
| `sequential` | `'p-sequential'` | `boolean` | sim | `true` | Define se o `po-stepper` será sequencial ou aleatório. |
| `step` | `'p-step'` | `number` | sim | `1` | Controla o passo atual do `po-stepper`. |
| `stepIcons` | `'p-step-icons'` | `boolean` | sim | `false` | Habilita a exibição de ícone ao invés de número no centro do círculo dos *steps*. |
| `stepSize` | `'p-step-size'` | `number` | sim | `24` | Define o tamanho dos *steps* em *pixels*, possibilitando um maior destaque. |
| `steps` | `'p-steps'` | `Array<PoStepperItem>` | sim | - | Lista dos itens do stepper. Se o valor estiver indefinido ou inválido, será inicializado como um array vazio. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `onChangeStep` | `'p-change-step'` | `EventEmitter` | Ação que será executada quando o usuário mudar o passo do `po-stepper`. |

## Métodos

### `active(index: number)`

Altera o status do *step* para ativo.

> Este método é valido apenas para as implementações que utilizam o componente [**po-step**](/documentation/po-step).

### `first()`

Ativa o primeiro *step*.

> Este método é valido apenas para as implementações que utilizam o componente [**po-step**](/documentation/po-step).

### `next()`

Ativa o próximo *step*.

> Este método é valido apenas para as implementações que utilizam o componente [**po-step**](/documentation/po-step).

### `previous()`

Ativa o *step* anterior.

> Este método é valido apenas para as implementações que utilizam o componente [**po-step**](/documentation/po-step).
