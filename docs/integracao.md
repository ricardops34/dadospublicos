# Integração com o CRM Visão 360

---

## Como o CRM consome esta API

```
[CRM Visão 360]
      │
      ├── GET /cnpj/:cnpj          → enriquece cadastro de empresa/cliente
      ├── GET /v2/pesquisa         → módulo de prospecção (Premium)
      ├── GET /mapa                → mapa Leaflet de prospects + carteira
      └── GET /geocode/cep/:cep   → geocodificação de endereços
```

---

## Variáveis de ambiente no CRM

```env
# backend/.env do CRM
RFB_API_URL=http://localhost:3001
RFB_API_TOKEN=token_do_plano_premium
```

---

## Fluxo: enriquecimento de empresa

Quando o usuário cadastra uma empresa no CRM e informa o CNPJ:

```
[CRM frontend] → digita CNPJ
      │
      ▼
[CRM backend]  → GET rfb-api/cnpj/:cnpj
      │
      ▼
[RFB API]      → retorna dados completos
      │
      ▼
[CRM backend]  → preenche campos:
                 empresas.razao_social
                 empresas.cnae_codigo
                 empresas.porte
                 empresas.situacao_cadastral
                 empresas.cep_codigo
                 empresas.municipio_ibge
                 ...
```

---

## Fluxo: prospecção + mapa

```
[CRM frontend] → filtra: CNAE=4711301, UF=SP, Porte=ME
      │
      ▼
[CRM backend]  → GET rfb-api/mapa?cnae=4711301&uf=SP&porte_id=01
      │
      ▼
[RFB API]      → retorna GeoJSON com pins
      │
      ▼
[CRM frontend] → Leaflet renderiza pins
                 Azul   = clientes da carteira
                 Verde  = prospects da RFB
```

---

## Fluxo: importar prospect como cliente

```
[CRM frontend] → clica "Importar como Lead" no popup do mapa
      │
      ▼
[CRM backend]  → GET rfb-api/cnpj/:cnpj (dados completos)
      │           → cria registro em clientes
      │           → vincula ao vendedor logado em carteira_clientes
      ▼
[CRM frontend] → redireciona para cadastro do novo cliente
```

---

## Alinhamento de campos RFB → CRM

| Campo RFB (`estabelecimento`) | Tabela CRM | Coluna CRM |
|---|---|---|
| `cnpj_raiz` + `cnpj_ordem` + `cnpj_dv` | `clientes` | `cod_erp` |
| `razao_social` (via empresa) | `clientes` | `razao_social` |
| `nome_fantasia` | `clientes` | `nome_fantasia` |
| `cnae_fiscal_principal` | `clientes` / `empresas` | `cnae_codigo` |
| `situacao_cadastral` | `clientes` | `situacao` |
| `cep` | `clientes` / `empresas` | `cep_codigo` |
| `municipio` (código RFB) | `municipios` | `codigo_ibge` (via de-para) |
| `uf` | `ufs` | `sigla` |
| `porte_empresa` | `empresas` | `porte` |
| `capital_social` (via empresa) | `empresas` | `capital_social` |
| `opcao_pelo_simples` | `empresas` | `regime_tributario` |
