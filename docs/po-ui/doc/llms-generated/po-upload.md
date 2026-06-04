# PoUploadComponent

**Seletor:** `po-upload`
**Tipo:** Componente / Diretiva
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-upload

O componente `po-upload` permite que o usuário envie arquivo(s) ao servidor e acompanhe o progresso.
Este componente também possibilita algumas configurações como:
– Envio de diretórios, onde ele acessa o diretório selecionado assim como seus sub-diretórios;
- Múltipla seleção, onde o usuário pode enviar mais de um arquivo ao servidor.
- Auto envio, onde o arquivo é enviado imediatamente após a seleção do usuário, não necessitando que o usuário
clique em enviar.
- Restrições de formatos de arquivo e tamanho.
- Função de sucesso que será disparada quando os arquivos forem enviados com sucesso.
- Função de erro que será disparada quando houver erro no envio dos arquivos.
- Permite habilitar uma área onde os arquivos podem ser arrastados.

#### Tokens customizáveis

É possível alterar o estilo do componente usando os seguintes tokens (CSS):

> Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).

| Propriedade | Descrição | Valor Padrão |
|----------------------------------------|-------------------------------------------------------|---------------------------------------------------|
| **FIELD CONTAINER** | | |
| `--field-container-title-justify` | Alinhamento horizontal do título (`justify-content`) | `space-between` |
| `--field-container-title-flex` | Flex do título (`flex`) | `1 auto` |
| **TEXT SUPPORT** | | |
| `--font-family-text-support` | Família tipográfica usada no texto de suporte | `var(--font-family-theme)` |
| `--text-color-text-support` | Cor da fonte no texto de suporte | `var(--color-neutral-dark-90)` |
| **UPLOAD CONTENT** | | |
| `--background-color-content` | Cor de fundo | `var(--color-neutral-light-10)` |
| `--border-color-content` | Cor da borda | `var(--color-neutral-light-20)` |
| `--border-radius-content` | Contém o valor do raio dos cantos do elemento | `var(--border-radius-md)` |
| `--text-color-file-name` | Cor do texto do nome do arquivo | `var(--color-neutral-dark-90)` |
| `--font-family-file-name` | Família tipográfica usada no texto do arquivo | `var(--font-family-theme)` |
| `--text-color-info-bar` | Cor do texto de informação | `var(--color-neutral-mid-60)` |
| `--font-family-info-bar` | Família tipográfica usada no texto de informação | `var(--font-family-theme)` |
| **ERROR STATE** | | |
| `--background-color-content-error` | Cor de fundo do container de erro | `var(--color-neutral-light-00)` |
| `--border-color-content-error` | Cor da borda do container de erro | `var(--color-feedback-negative-base)` |
| `--text-color-error` | Cor do texto do container de erro | `var(--color-feedback-negative-dark)` |
| `--color-icon-error` | Cor do ícone no estado de erro | `var(--color-feedback-negative-base)` |
| `--font-family-error` | Família tipográfica usada no texto de erro | `var(--font-family-theme)` |
| **UPLOADED STATE** | | |
| `--background-color-content-uploaded` | Cor de fundo do container com status de enviado | `var(--color-neutral-light-00)` |
| `--border-color-content-uploaded` | Cor da borda do container com status de enviado | `var(--color-neutral-light-20)` |
| **INTERACTIVE STATE** | | |
| `--text-color-file-name-interactive` | Cor do texto do nome do arquivo quando interativo | `var(--color-action-default)` |
| **THUMBNAIL** | | |
| `--color-icon-thumbnail` | Cor do ícone na thumbnail | `var(--color-action-default)` |
| `--border-width-thumbnail` | Tamanho da fonte na thumbnail | `var(--border-width-sm)` |
| `--border-radius-thumbnail` | Contém o valor do raio dos cantos na thumbnail | `var(--border-radius-md)` |
| `--background-color-thumbnail` | Cor de fundo na thumbnail | `var(--color-neutral-light-05)` |
| **Focused** | | |
| `--outline-color-focused` | Cor do outline do estado de focus | `var(--color-action-focus)` |

## Inputs

| Propriedade | Alias | Tipo | Opcional | Padrão | Descrição |
|---|---|---|---|---|---|
| `additionalHelpTooltip` | `'p-additional-help-tooltip'` | `string` | sim | - | Exibe um ícone de ajuda adicional, com o texto desta propriedade sendo passado para o popover do componente `po-helper`. |
| `appendBox` | `'p-append-in-body'` | `boolean` | sim | `false` | Define que o popover (`p-helper`) será incluído no body da página e não dentro do componente. Essa |
| `autoFocus` | `'p-auto-focus'` | `boolean` | sim | `false` | Aplica foco no elemento ao ser iniciado. |
| `autoUpload` | `'p-auto-upload'` | `boolean` | sim | `false` | Define se o envio do arquivo será automático ao selecionar o mesmo. |
| `compactLabel` | `p-compact-label` | `boolean` | sim | `false` | Define se o título do campo será exibido de forma compacta. |
| `customAction` | `'p-custom-action'` | `PoProgressAction` | sim | - | Define uma ação personalizada no componente `po-upload`, adicionando um botão no canto inferior direito |
| `customModalActions` | `'p-custom-modal-actions'` | `Array<PoModalAction>` | sim | - | Define uma ou duas ações personalizadas do modal de pré-visualização, adicionando um botão ou dois botões no canto inferior direito |
| `directory` | `'p-directory'` | `boolean` | sim | `false` | Permite a seleção de diretórios contendo um ou mais arquivos para envio. |
| `disabled` | `'p-disabled'` | `boolean` | sim | - | Indica que o campo será desabilitado. |
| `disabledRemoveFile` | `'p-disabled-remove-file'` | `boolean` | sim | `false` | Desabilita botão de remover o(s) arquivo(s) selecionado(s). |
| `dragDrop` | `'p-drag-drop'` | `boolean` | sim | `false` | Exibe a área onde é possível arrastar e selecionar os arquivos. Quando estiver definida, omite o botão para seleção de arquivos |
| `dragDropHeight` | `'p-drag-drop-height'` | `number` | sim | `320` | Define em *pixels* a altura da área onde podem ser arrastados os arquivos. A altura mínima aceita é `160px`. |
| `fileRestrictions` | `'p-restrictions'` | `PoUploadFileRestrictions` | sim | - | Objeto que segue a definição da interface `PoUploadFileRestrictions`, |
| `formField` | `'p-form-field'` | `string` | sim | `files` | Nome do campo de formulário que será enviado para o serviço informado na propriedade `p-url`. |
| `headers` | `'p-headers'` | `{
    [name: string]: string | Array<string>;
}` | não | - | Objeto que contém os cabeçalhos que será enviado na requisição dos arquivos. |
| `help` | `'p-help'` | `string` | sim | - | Texto de apoio para o campo. |
| `hideRestrictionsInfo` | `'p-hide-restrictions-info'` | `boolean` | sim | `false` | Oculta visualmente as informações de restrições para o upload. |
| `hideSelectButton` | `'p-hide-select-button'` | `boolean` | sim | `false` | Omite o botão de seleção de arquivos. |
| `hideSendButton` | `'p-hide-send-button'` | `boolean` | sim | `false` | Omite o botão de envio de arquivos. |
| `isMultiple` | `'p-multiple'` | `boolean` | sim | - | Define se pode selecionar mais de um arquivo. |
| `label` | `'p-label'` | `string` | sim | - | Rótulo do campo. |
| `labelTextWrap` | `p-label-text-wrap` | `boolean` | sim | `false` | Habilita a quebra automática do texto da propriedade `p-label`. Quando `p-label-text-wrap` for verdadeiro, o texto que excede |
| `literals` | `'p-literals'` | `PoUploadLiterals` | sim | - | Objeto com as literais usadas no `po-upload`. |
| `loading` | `'p-loading'` | `boolean` | sim | `false` | Exibe um ícone de carregamento no botão `Selecionar arquivo`, à esquerda do texto, sinalizando que uma operação está em andamento. |
| `name` | `'name'` | `string` | não | - | Define o valor do atributo `name` do componente. |
| `optional` | `'p-optional'` | `boolean` | sim | `false` | Define se a indicação de campo opcional será exibida. |
| `poHelperComponent` | `p-helper` | `PoHelperOptions | string` | sim | - | Define as opções do componente de ajuda (po-helper) que será exibido ao lado do label quando a propriedade `p-label` for definida, ou, ao lado do componente na ausência da propriedade `p-label`. |
| `required` | `'p-required'` | `boolean` | sim | `false` | Define que o campo será obrigatório. |
| `requiredUrl` | `'p-required-url'` | `boolean` | sim | `true` | Define se a propriedade `p-url` é obrigatória. |
| `showRequired` | `'p-show-required'` | `boolean` | não | - | Define se a indicação de campo obrigatório será exibida. |
| `showThumbnail` | `'p-show-thumbnail'` | `boolean` | sim | `true` | Exibe a pré-visualização de imagens ao anexá-las. |
| `size` | `'p-size'` | `string` | sim | `medium` | Define o tamanho e as ações do componente: |
| `url` | `'p-url'` | `string` | não | - | URL que deve ser feita a requisição com os arquivos selecionados. |

## Outputs

| Evento | Alias | Tipo | Descrição |
|---|---|---|---|
| `additionalHelp` | `'p-additional-help'` | `EventEmitter` | Evento disparado ao clicar no ícone de ajuda adicional. |
| `customActionClick` | `'p-custom-action-click'` | `EventEmitter` | Evento emitido ao clicar na ação personalizada configurada no `p-custom-action`. |
| `keydown` | `'p-keydown'` | `EventEmitter` | Evento disparado quando uma tecla é pressionada enquanto o foco está no componente. |
| `ngModelChange` | `'ngModelChange'` | `EventEmitter` | Função para atualizar o ngModel do componente, necessário quando não for utilizado dentro da *tag* `form`. |
| `onCancel` | `'p-cancel'` | `EventEmitter` | Evento será disparado ao clicar no ícone de fechar. |
| `onError` | `'p-error'` | `EventEmitter` | Evento será disparado quando ocorrer algum erro no envio do arquivo. |
| `onOpenModalPreview` | `'p-open-modal-preview'` | `EventEmitter` | Evento será disparado ao abrir o modal de pré-visualização. |
| `onRemove` | `'p-remove'` | `EventEmitter` | Evento será disparado ao clicar no ícone de remover. |
| `onSuccess` | `'p-success'` | `EventEmitter` | Evento será disparado quando o envio do arquivo for realizado com sucesso. |
| `onUpload` | `'p-upload'` | `EventEmitter` | Função que será executada no momento de realizar o envio do arquivo, |

## Métodos

### `clear()`

Método responsável por **limpar** o(s) arquivo(s) selecionado(s).

### `focus()`

Função que atribui foco ao componente.

Para utilizá-la é necessário ter a instância do componente no DOM, podendo ser utilizado o ViewChild da seguinte forma:

```
import { PoUploadComponent } from '@po-ui/ng-components';

...

@ViewChild(PoUploadComponent, { static: true }) upload: PoUploadComponent;

focusUpload() {
  this.upload.focus();
}
```

### `closeModal()`

Método responsável por fechar o modal.

### `selectFiles()`

Método responsável por **abrir** a janela para seleção de arquivo(s).

### `sendFiles()`

Método responsável por **enviar** o(s) arquivo(s) selecionado(s).

### `showAdditionalHelp()`

Método que exibe `p-helper` ou executa a ação definida em `p-helper{eventOnClick}` ou em `p-additionalHelp`.
Para isso, será necessário configurar uma tecla de atalho utilizando o evento `p-keydown`.

> Exibe ou oculta o conteúdo do componente `po-helper` quando o componente estiver com foco.

```
//Exemplo com p-label e p-helper
<po-upload
 #upload
 ...
 p-label="Label do upload"
 [p-helper]="helperOptions"
 (p-keydown)="onKeyDown($event, upload)"
></po-upload>
```
```
...
onKeyDown(event: KeyboardEvent, inp: PoUploadComponent): void {
 if (event.code === 'F9') {
   inp.showAdditionalHelp();
 }
}
```
