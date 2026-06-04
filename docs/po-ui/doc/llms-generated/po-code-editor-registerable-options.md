# PoCodeEditorRegisterableOptions

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-code-editor-registerable-options

Interface para configuração de Opções de novas sintaxes ao code editor.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `escapes` | `RegExp` | não | Escapes específicos da sintaxes. |
| `ignoreCase` | `boolean` | sim | Define se a sintaxe será case sensitive ou não. |
| `keywords` | `Array<string>` | não | Palavras chaves da sintaxe. |
| `operators` | `Array<string>` | não | Operadores específicos da sintaxe. |
| `symbols` | `RegExp` | não | Símbolos específicos da sintaxes. |
| `tokenizer` | `PoCodeEditorRegisterableTokens` | não | Interface para recebimento de token específicos da sintaxe. |
