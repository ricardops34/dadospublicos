# PoCodeEditorRegisterable

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-code-editor-registerable

Interface para configuração de novas sintaxes ao code editor.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `language` | `string` | não | Nome da sintaxe a ser registrada no code editor. |
| `options` | `PoCodeEditorRegisterableOptions` | não | Opções de configuração da sintaxe customizada. |
| `suggestions` | `PoCodeEditorRegisterableSuggestionType` | sim | Lista de sugestões para a função de autocomplete. |
