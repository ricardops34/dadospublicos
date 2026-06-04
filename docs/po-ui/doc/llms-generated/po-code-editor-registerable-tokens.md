# PoCodeEditorRegisterableTokens

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-code-editor-registerable-tokens

Interface para configuração de tokens de novas sintaxes ao code editor.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `comment` | `Array<any>` | sim | Tokenizer de comentários. |
| `interpolated` | `Array<any>` | sim | Sequência de interpolação. |
| `interpolatedCompound` | `Array<any>` | sim | Sequência de interpolação composta. |
| `root` | `Array<any>` | não | Principal tokenizer da sintaxe customizada. |
| `string` | `Array<any>` | sim | Tokenizer de strings. |
| `whitespace` | `Array<any>` | sim | Tokenizer de whitespaces. |
