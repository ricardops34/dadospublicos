# PoUploadFileRestrictions

**Tipo:** Interface / Modelo
**Pacote:** `@po-ui/ng-components`
**Referência:** https://po-ui.io/documentation/po-upload-file-restrictions

Interface que define as restrições dos arquivos a serem selecionados com base em regras predefinidas
para o seu tamanho, extensão e quantidade.

## Propriedades

| Propriedade | Tipo | Opcional | Descrição |
|---|---|---|---|
| `allowedExtensions` | `Array<string>` | sim | Extensões permitidas de arquivos que serão enviados ao servidor, devendo ser informada uma coleção de extensões, por exemplo: |
| `maxFileSize` | `number` | sim | Tamanho máximo do arquivo a ser enviado ao servidor. |
| `maxFiles` | `number` | sim | Quantidade máxima de arquivos para o *upload*. |
| `minFileSize` | `number` | sim | Tamanho mínimo em *bytes* do arquivo que será enviado ao servidor. |
