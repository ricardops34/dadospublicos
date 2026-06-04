# Tema Protheus / TOTVS para PO UI

Gerado automaticamente em `2026-05-18T21:46:26.768Z`.

- Pacote npm: `@totvs/po-theme`
- Versao `latest`: `21.16.0`
- Repositorio publico: https://github.com/totvs/po-theme-totvs
- Ultima atualizacao publica observada: `2026-05-18T13:34:44Z`

## Status

O repositorio publico informa que esta em processo de descontinuacao e que novas evolucoes passaram para um projeto interno/privado. Apesar disso, o pacote segue publicado no npm e pode ser usado como tema padrao TOTVS para aplicacoes com PO UI.

## Instalacao

```bash
npm i @totvs/po-theme
```

## Configuracao no `angular.json`

Adicione os estilos nesta ordem:

```json
"styles": [
  "node_modules/@totvs/po-theme/css/po-theme-default-variables.min.css",
  "node_modules/@totvs/po-theme/css/po-theme-default.min.css",
  "node_modules/@po-ui/style/css/po-theme-core.min.css"
]
```

## Observacoes

- O pacote se apresenta como `PO Theme - Totvs Default Theme`.
- O repositório publico e marcado como descontinuado; trate-o como referencia historica e snapshot tecnico.
- Para customizacoes avancadas de tema no PO UI, consulte tambem [theme-customization.md](./theme-customization.md).

## Fontes locais espelhadas

- [README do tema](../sources/po-theme-readme.md)
- [package.json do tema](../sources/po-theme-package.json)
- [Snapshot do repositorio publico](../sources/po-theme-totvs-repo/README.md)

## Metadados tecnicos do pacote

```json
{
  "name": "@totvs/po-theme",
  "description": "PO Theme - Totvs Default Theme",
  "distTags": {
    "v5-lts": "5.22.7",
    "v17-lts": "17.26.28",
    "beta": "20.11.0-beta.2",
    "v20-ng": "20.13.1",
    "v19-lts": "19.39.11",
    "latest": "21.16.0",
    "next": "21.16.0"
  },
  "latestVersion": {
    "version": "21.16.0",
    "repository": {
      "url": "git+https://github.com/totvs/po-theme-totvs.git",
      "type": "git"
    },
    "license": "MIT",
    "devDependencies": {
      "@po-ui/style": "21.16.0"
    },
    "dist": {
      "shasum": "5c9df9f6c7865449dc5c38352410b23248b34d6c",
      "tarball": "https://registry.npmjs.org/@totvs/po-theme/-/po-theme-21.16.0.tgz",
      "fileCount": 26,
      "integrity": "sha512-45WlVKyJA5VldV6MvFsP3BiBHQH+wGzDmHzOv8NSM72UpYJYR0R4UPpv+fHVm1WkPb9IVn7ajAqIPNtiKtNtMQ==",
      "signatures": [
        {
          "sig": "MEUCIBkL48NRHWv3mM83r7ndC23MJx7gLmjl5wbPQrvR++QuAiEAhao108PdtYofP1himoK9CKIJwQ4RF7X99hUjY6Z8MIM=",
          "keyid": "SHA256:DhQ8wR5APBvFHLF/+Tc+AYvPOdTpcIDqOhxsBHRwC7U"
        }
      ],
      "unpackedSize": 2357454
    }
  }
}
```

## Trecho oficial do README

```md
# ⚠️ Descontinuação do Repositório

Este repositório está em processo de descontinuação.

Esses recursos passam a ser gerenciados exclusivamente em um projeto interno (repositório privado). Portanto, não haverá mais publicação de inovações e novas funcionalidades.

Para dúvidas ou orientações sobre migração, abra uma issue neste repositório.

---

# PO Theme - Totvs Default Theme

Tema padrão da Totvs para aplicações desenvolvidas com [PO UI](http://po-ui.io).

:warning: __Uso exclusivo dos produtos TOTVS e Clientes.__

### Como usar o tema

O **PO UI** possui o seu próprio tema, mas disponibilizamos um tema com os padrões da TOTVS.

Para utilizá-lo, instale o pacote `@totvs/po-theme` conforme abaixo:

```
npm i @totvs/po-theme
```

Em seguida, atualize o arquivo `angular.json` para utilizar o tema.

```json
"styles": [
  "node_modules/@totvs/po-theme/css/po-theme-default-variables.min.css",
  "node_modules/@totvs/po-theme/css/po-theme-default.min.css",
  "node_modules/@po-ui/style/css/po-theme-core.min.css",
]
```

> Leia mais sobre [como criar seu próprio tema customizado do PO UI][create-theme-customization].

[create-theme-customization]: https://po-ui.io/guides/create-theme-customization
```