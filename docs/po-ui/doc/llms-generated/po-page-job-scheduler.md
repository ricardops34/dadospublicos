# PoPageJobSchedulerComponent

**Seletor:** `po-page-job-scheduler`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-page-job-scheduler

O `po-page-job-scheduler` é uma página para criação e atualização de agendamentos da execução de processos (Job Scheduler),
como por exemplo: a geração da folha de pagamento dos funcionários.

Para utilizar esta página, basta informar o serviço (endpoint) para consumo,
sem a necessidade de criar componentes e tratamentos dos dados.

Veja mais sobre os padrões utilizados nas requisições no [Guia de implementação de APIs](guides/api).

#### Tokens customizáveis

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|---------------------|---------------------------------------------|---------------------------------------|
| **Header** | | |
| `--padding` | Espaçamento do header | `var(--spacing-xs) var(--spacing-md)` |
| `--gap` | Espaçamento entre os breadcrumbs e o título | `var(--spacing-md)` |
| `--gap-actions` | Espaçamento entre as ações | `var(--spacing-xs)` |
| `--font-family` | Família tipográfica do título | `var(--font-family-theme)` |
| **Content** | | |
| `--padding-content` | Espaçamento do conteúdo | `var(--spacing-xs) var(--spacing-sm)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `beforeSendAction` | `'p-before-send'` | `unknown` | sim | - | Função chamada após realizar a confirmação da execução no PoPageJobScheduler. |
| `breadcrumb` | `'p-breadcrumb'` | `PoBreadcrumb` | sim | - | Objeto com as propriedades do breadcrumb. |
| `componentsSize` | `'p-components-size'` | `string` | sim | `medium` | Define o tamanho dos componentes de formulário no template: |
| `parameters` | `'p-parameters'` | `Array<PoDynamicFormField>` | não | - | Parâmetros que serão utilizados para criação e edição dos agendamentos. |
| `serviceApi` | `'p-service-api'` | `string` | não | - | Endpoint usado pelo componente para busca dos processos e parâmetros que serão utilizados para criação e edição dos agendamentos. |
| `stepExecutionLast` | `'p-step-execution-last'` | `boolean` | sim | - | Define se o step `Agendamento` deve ser exibido como o último na sequência de steps |
| `stepperDefaultOrientation` | `'p-orientation'` | `PoStepperOrientation` | sim | - | Define a orientação de exibição do `po-stepper`. |
| `title` | `'p-title'` | `string` | não | - | Título da página. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `error` | `'p-error'` | `EventEmitter` | Evento disparado ao ocorrer um erro impossibilitando a conclusão do agendamento. |
| `success` | `'p-success'` | `EventEmitter` | Evento disparado ao concluir o processo de agendamento com sucesso. |
