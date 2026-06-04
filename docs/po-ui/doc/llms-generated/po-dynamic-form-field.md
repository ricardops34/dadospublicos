# PoDynamicFormField

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-dynamic-form-field

Interface para definição das propriedades dos campos de entrada que serão criados dinamicamente.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `additionalHelp` | `Function` | sim | Evento disparado ao clicar no ícone de ajuda adicional. |
| `additionalHelpTooltip` | `string` | sim | Exibe um ícone de ajuda adicional, com o texto desta propriedade sendo passado para o popover do componente `po-helper`. |
| `advancedFilters` | `Array<PoLookupAdvancedFilter>` | sim | Lista de objetos dos campos que serão criados na busca avançada. |
| `appendBox` | `boolean` | sim | Define que o `listbox` e/ou popover (`p-helper` e/ou `p-error-limit`) serão incluídos no body da |
| `autoHeight` | `boolean` | sim | Define que a altura do componente será auto ajustável, possuindo uma altura minima porém a altura máxima será de acordo com o número de itens selecionados e a extensão dos mesmos, mantendo-os sempre visíveis. |
| `autoUpload` | `boolean` | sim | Define se o envio do arquivo será automático ao selecionar o mesmo. |
| `booleanFalse` | `string` | sim | Texto exibido quando o valor do componente for *false*. |
| `booleanTrue` | `string` | sim | Texto exibido quando o valor do componente for *true*. |
| `changeOnEnter` | `boolean` | sim | Indica que o evento `p-change` só será disparado ao clicar ou pressionar a tecla "Enter" sobre uma opção selecionada no `po-combo`. |
| `changeVisibleColumns` | `Function` | sim | Evento disparado ao fechar o popover do gerenciador de colunas após alterar as colunas visíveis. |
| `clean` | `boolean` | sim | Se verdadeiro, o campo receberá um botão para ser limpo. |
| `columnRestoreManager` | `Function` | sim | Evento disparado ao clicar no botão de restaurar padrão no gerenciador de colunas. |
| `columns` | `Array<PoLookupColumn> | number` | sim | Define as colunas para utilização da busca avançada. Usada somente em conjunto com a propriedade `searchService`, |
| `compactLabel` | `boolean` | sim | Define se o título do campo será exibido de forma compacta. |
| `container` | `string` | sim | Exibirá um container para todos os campos abaixo dessa propriedade. |
| `customAction` | `PoProgressAction` | sim | Define uma ação personalizada no componente `po-upload`, adicionando um botão no canto inferior direito |
| `customActionClick` | `(file: PoUploadFile) => void` | sim | Evento emitido ao clicar na ação personalizada configurada no `p-custom-action`. |
| `debounceTime` | `number` | sim | Esta propriedade define em quanto tempo (em milissegundos), aguarda para acionar o evento de filtro após cada pressionamento de tecla. Será utilizada apenas quando houver serviço (`p-filter-service`). |
| `decimalsLength` | `number` | sim | Quantidade máxima de casas decimais. |
| `directory` | `boolean` | sim | Permite a seleção de diretórios contendo um ou mais arquivos para envio. |
| `disabled` | `boolean` | sim | Desabilita o campo caso informar o valor *true*. |
| `disabledInitFilter` | `boolean` | sim | Desabilita o filtro inicial no serviço do `po-combo`, que é executado no primeiro clique no campo. |
| `disabledTabFilter` | `boolean` | sim | Se verdadeiro, desabilitará a busca de um item via TAB no `po-combo`. |
| `divider` | `string` | sim | Exibirá um divisor acima, utilizando o seu conteudo como título. |
| `dragDrop` | `boolean` | sim | Exibe a área onde é possível arrastar e selecionar os arquivos. Quando estiver definida, omite o botão para seleção de arquivos |
| `dragDropHeight` | `number` | sim | Define em *pixels* a altura da área onde podem ser arrastados os arquivos. A altura mínima aceita é `160px`. |
| `errorAsyncFunction` | `(value) => Observable<boolean>` | sim | Função executada para realizar a validação assíncrona personalizada. |
| `errorAsyncProperties` | `ErrorAsyncProperties` | sim | Realiza alguma validação customizada assíncrona no componente. |
| `errorLimit` | `boolean` | sim | Limita a exibição da mensagem de erro a duas linhas e exibe um tooltip com o texto completo. |
| `errorMessage` | `string` | sim | Mensagem que será apresentada quando o campo ficar inválido. |
| `fieldLabel` | `string` | sim | Nome da propriedade do objeto retornado que será utilizado como descrição do campo. |
| `fieldValue` | `string` | sim | Nome da propriedade do objeto retornado que será utilizado como valor do campo. |
| `filterMinlength` | `number` | sim | Valor mínimo de caracteres para realizar o filtro no serviço do `po-combo`. |
| `filterMode` | `PoMultiselectFilterMode` | sim | Define o modo de pesquisa utilizado no filtro da lista de seleção: `startsWith`, `contains` ou `endsWith`. |
| `forceBooleanComponentType` | `ForceBooleanComponentEnum` | sim | Valores aceitos: |
| `forceOptionsComponentType` | `ForceOptionComponentEnum` | sim | pode ser utilizada em conjunto com a propriedade `options` forçando o componente a renderizar um `po-select` ou `po-radio-group`. |
| `formField` | `string` | sim | Nome do campo de formulário que será enviado para o serviço informado na propriedade `url`. |
| `format` | `string | Array<string>` | sim | Formato de exibição no campo. |
| `formatModel` | `boolean` | sim | Indica se o `model` receberá o valor formatado pelas propriedades `p-label-on` e `p-label-off` ou |
| `gridColumns` | `number` | sim | Tamanho de exibição do campo em telas. |
| `gridLgColumns` | `number` | sim | Tamanho de exibição do campo em telas grandes (lg). |
| `gridLgPull` | `number` | sim | Tamanho do espaçamento após o campo antes da exibição do próximo campo em telas grandes (lg). |
| `gridMdColumns` | `number` | sim | Tamanho de exibição do campo em telas médias (md). |
| `gridMdPull` | `number` | sim | Tamanho do espaçamento após o campo antes da exibição do próximo campo em telas médias (md). |
| `gridSmColumns` | `number` | sim | Tamanho de exibição do campo em telas menores (sm). |
| `gridSmPull` | `number` | sim | Tamanho do espaçamento após o campo antes da exibição do próximo campo em telas menores (sm). |
| `gridXlColumns` | `number` | sim | Tamanho de exibição do campo em telas extra grandes (xl). |
| `gridXlPull` | `number` | sim | Tamanho do espaçamento após o campo antes da exibição do próximo campo em telas extra grandes (xl). |
| `headers` | `{
    [name: string]: string | Array<string>;
}` | sim | Objeto que contém os cabeçalhos que será enviado na requisição dos arquivos. |
| `help` | `string` | sim | Texto de ajuda. |
| `helper` | `string | PoHelperOptions` | sim | Texto simples que será apresentado como auxílio ao campo ou objeto com as definições do po-helper. |
| `hideLabelStatus` | `boolean` | sim | Indica se o status do `model` será escondido visualmente ao lado do switch |
| `hidePasswordPeek` | `boolean` | sim | Permite esconder a função de espiar a senha digitada no `po-password`. |
| `hideRestrictionsInfo` | `boolean` | sim | Oculta visualmente as informações de restrições para o upload. |
| `hideSearch` | `boolean` | sim | Esconde o campo de pesquisa existente dentro do dropdown do `po-multiselect`. |
| `hideSelectAll` | `boolean` | sim | Indica se o campo "Selecionar todos" do `po-multiselect` será escondido. |
| `hideSelectButton` | `boolean` | sim | Omite o botão de seleção de arquivos. |
| `hideSendButton` | `boolean` | sim | Omite o botão de envio de arquivos. |
| `icon` | `string | TemplateRef<void>` | sim | Define o ícone que será exibido no início do campo. |
| `infiniteScroll` | `boolean` | sim | Se verdadeiro ativa a funcionalidade de scroll infinito para o combo ou lookup, ao chegar ao fim da tabela executará nova busca dos dados conforme paginação. |
| `infiniteScrollDistance` | `number` | sim | Define o percentual necessário para disparar o evento show-more, que é responsável por carregar mais dados no combo. Caso o valor seja maior que 100 ou menor que 0, o valor padrão será 100%. |
| `invalidValue` | `boolean` | sim | Define qual valor será considerado como inválido para exibir a mensagem da propriedade `p-field-error-message`. |
| `isoFormat` | `PoDatepickerIsoFormat` | sim | Padrão de formatação para saída do model, independentemente do formato de entrada. |
| `key` | `boolean` | sim | Identificador |
| `keydown` | `Function` | sim | Função executada quando uma tecla é pressionada enquanto o foco está no componente. |
| `label` | `string` | sim | Rótulo do campo exibido. |
| `labelPosition` | `PoSwitchLabelPosition` | sim | Posição de exibição do rótulo do PoSwitch. |
| `listboxControlPosition` | `'top' | 'bottom'` | sim | Define a direção preferida para exibição do `listbox` em relação ao campo (`top` ou `bottom`). |
| `literals` | `PoLookupLiterals | PoMultiselectLiterals | PoComboLiterals | PoDatepickerRangeLiterals | PoUploadLiterals` | sim | Objeto com as literais usadas para os seguintes componentes: `po-lookup`, `po-multiselect`, `po-combo` e `po-datepicker-range`. |
| `loading` | `boolean` | sim | Habilita um estado de carregamento no componente, desabilitando-o e exibindo um ícone de carregamento. |
| `locale` | `string` | sim | Define a localidade a ser utilizada no componente. |
| `mask` | `string` | sim | Máscara para o campo. |
| `maskFormatModel` | `boolean` | sim | Define que o valor do componente será conforme especificado na mascára. O valor padrão é `false`. |
| `maskNoLengthValidation` | `boolean` | sim | Controla como o componente aplica as validações de comprimento mínimo (`minLength`) e máximo (`maxLength`) quando há uma máscara (`p-mask`) definida. |
| `maxLength` | `number` | sim | Tamanho máximo de caracteres. |
| `maxValue` | `string | number` | sim | Valor máximo a ser informado no componente, podendo ser utilizado quando o tipo de dado por *number*, *date*, *dateTime* ou *time*. |
| `minLength` | `number` | sim | Tamanho mínimo de caracteres. |
| `minValue` | `string | number` | sim | Valor mínimo a ser informado no componente, podendo ser utilizado quando o tipo de dado por *number*, *date*, *dateTime* ou *time*. |
| `minuteInterval` | `number` | sim | Define o intervalo entre os minutos exibidos no painel do timepicker. |
| `mode` | `'month-year' | 'year'` | sim | Define o modo de seleção do `po-datepicker`. |
| `modelFormat` | `PoTimepickerModelFormat` | sim | Define o formato do valor do horário a ser utilizado no model do `po-timepicker`. |
| `multiple` | `boolean` | sim | Permite a seleção de múltiplos itens. |
| `noAutocomplete` | `boolean` | sim | Define a propriedade nativa `autocomplete` do campo como off. |
| `offsetColumns` | `number` | sim | Tamanho do espaço de exibição do campo em telas. |
| `offsetLgColumns` | `number` | sim | Tamanho do espaço de exibição do campo em telas grandes (lg). |
| `offsetMdColumns` | `number` | sim | Tamanho do espaço de exibição do campo em telas médias (md). |
| `offsetSmColumns` | `number` | sim | Tamanho do espaço de exibição do campo em telas menores (sm). |
| `offsetXlColumns` | `number` | sim | Tamanho do espaço de exibição do campo em telas extra grandes (xl). |
| `onError` | `Function` | sim | Evento será disparado quando ocorrer algum erro no envio do arquivo. |
| `onSuccess` | `Function` | sim | Evento será disparado quando o envio do arquivo for realizado com sucesso. |
| `onUpload` | `Function` | sim | Função que será executada no momento de realizar o envio do arquivo, |
| `optional` | `boolean` | sim | Define se a indicação de campo opcional será exibida. |
| `options` | `Array<string> | Array<PoSelectOption> | Array<PoMultiselectOption> | Array<PoCheckboxGroupOption> | Array<any>` | sim | Lista de opções que serão exibidos em um componente, podendo selecionar uma opção. |
| `optionsMulti` | `boolean` | sim | Permite que o usuário faça múltipla seleção dentro da lista de opções. |
| `optionsService` | `string | PoComboFilter | PoMultiselectFilter` | sim | Serviço que será utilizado para buscar os itens e preencher a lista de opções dinamicamente. |
| `order` | `number` | sim | Informa a ordem de exibição do campo. |
| `params` | `any` | sim | Objeto que será enviado como parâmetro nas requisições de busca usados pelos componentes `po-lookup` e |
| `pattern` | `string` | sim | Regex para validação do campo. |
| `placeholder` | `string` | sim | Mensagem que será exibida enquanto o campo não estiver preenchido. |
| `placeholderSearch` | `string` | sim | Placeholder do campo de pesquisa do `po-multiselect`. |
| `property` | `string` | não | Nome de referência do campo. |
| `range` | `boolean` | sim | O controle passa a permitir a entrada de um intervalo ao invés de um único valor. |
| `rangePresetOptions` | `Array<PoCalendarRangePreset>` | sim | Lista de presets customizados de intervalos de data exibidos no painel lateral do calendário. |
| `rangePresets` | `boolean | Array<string>` | sim | Habilita a exibição dos presets padrão de intervalos de data no painel lateral do calendário. |
| `rangePresetsOrder` | `'asc' | 'desc'` | sim | Define a ordenação dos presets na lista. |
| `readonly` | `boolean` | sim | Indica que o campo será somente leitura. |
| `removeInitialFilter` | `boolean` | sim | Define que o filtro no primeiro clique será removido. |
| `required` | `boolean` | sim | Define a obrigatoriedade do campo. |
| `requiredFieldErrorMessage` | `boolean` | sim | Exibe a mensagem setada na propriedade `errorMessage` se o campo estiver vazio e for requerido. |
| `restrictions` | `PoUploadFileRestrictions` | sim | Objeto que segue a definição da interface `PoUploadFileRestrictions`, |
| `rows` | `number` | sim | Quantidade de linhas exibidas no `po-textarea`. |
| `searchService` | `string | PoLookupFilter` | sim | Serviço que será utilizado para realizar a busca avançada. Pode ser utilizado em conjunto com a propriedade `columns`. |
| `secondInterval` | `number` | sim | Define o intervalo entre os segundos exibidos no painel do timepicker. |
| `secret` | `boolean` | sim | Esconde a informação estilo *password*, pode ser utilizado quando o tipo de dado for *string*. |
| `showRequired` | `boolean` | sim | Define se a indicação de campo obrigatório será exibida. |
| `showSeconds` | `boolean` | sim | Exibe a coluna de segundos no painel do timepicker. |
| `showThumbnail` | `boolean` | sim | Exibe a pré-visualização de imagens ao anexá-las. |
| `size` | `string` | sim | Define o tamanho dos componentes de formulário no template conforme suas respectivas documentações: |
| `sort` | `boolean` | sim | Indica que a lista definida na propriedade p-options será ordenada pela descrição. |
| `step` | `number` | sim | Intervalo utilizado no `po-number`. |
| `thousandMaxlength` | `number` | sim | Quantidade máxima de dígitos antes do separador decimal. O valor máximo permitido é 13 |
| `type` | `string | PoDynamicFieldType` | sim | Tipo do valor campo. |
| `url` | `string` | sim | URL que deve ser feita a requisição com os arquivos selecionados. |
| `validate` | `string | Function` | sim | Função ou serviço para validar as **mudanças do campo**. |
| `visible` | `boolean` | sim | Indica se o campo será visível. |
| `yearRangeLimit` | `number` | sim | Define o limite de anos exibidos na lista de anos do `po-datepicker` nos modos `month-year` e `year`. |
