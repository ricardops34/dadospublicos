# API — Endpoints Detalhados

> Base URL pública: `https://api.seudominio.com`
> Autenticação: header `x_api_token: SEU_TOKEN` ou query `?token=SEU_TOKEN`

---

## Autenticação

Endpoints gratuitos não requerem token. Endpoints pagos exigem token no header ou query string.

```bash
# Header (recomendado)
curl -H "x_api_token: SEU_TOKEN" https://api.seudominio.com/cnpj-raiz/27865757

# Query string
curl "https://api.seudominio.com/cnpj-raiz/27865757?token=SEU_TOKEN"
```

---

## GET `/cnpj/:cnpj` — Gratuito

Retorna dados completos de um CNPJ.

**Rate limit:** 3 req/min (sem token) · 2000 req/min (com token)

```bash
GET /cnpj/27865757000102
```

**Resposta:**
```json
{
  "cnpj_raiz": "27865757",
  "razao_social": "GLOBO COMUNICACAO E PARTICIPACOES S/A",
  "capital_social": "6983568523.86",
  "porte": { "id": "05", "descricao": "Demais" },
  "natureza_juridica": { "id": "2054", "descricao": "Sociedade Anônima Fechada" },
  "atualizado_em": "2024-01-20T05:41:44.884Z",
  "estabelecimento": {
    "cnpj": "27865757000102",
    "cnpj_raiz": "27865757",
    "cnpj_ordem": "0001",
    "cnpj_digito_verificador": "02",
    "tipo": "Matriz",
    "nome_fantasia": "GLOBO",
    "situacao_cadastral": "Ativa",
    "data_situacao_cadastral": "2000-01-01",
    "data_inicio_atividade": "1965-04-26",
    "pais": { "id": "105", "iso2": "BR", "iso3": "BRA", "nome": "Brasil", "comex_id": "1058" },
    "estado": { "id": 19, "nome": "Rio de Janeiro", "sigla": "RJ" },
    "cidade": { "id": 6001, "nome": "Rio de Janeiro", "ibge_id": 3304557, "siafi_id": "6001" },
    "cep": "22793900",
    "logradouro": "RUA LATA MORAIS",
    "numero": "300",
    "complemento": "ANDAR 1",
    "bairro": "BARRA DA TIJUCA",
    "tipo_logradouro": "RUA",
    "ddd1": "21", "telefone1": "21122222",
    "ddd2": null, "telefone2": null,
    "ddd_fax": null, "fax": null,
    "email": "JURIDICO@GLOBO.COM",
    "atividade_principal": { "id": "6010100", "descricao": "Atividades de rádio" },
    "atividades_secundarias": [
      { "id": "6021700", "descricao": "Atividades de televisão aberta" }
    ],
    "situacao_especial": null,
    "data_situacao_especial": null
  },
  "socios": [
    {
      "nome": "***NOME MASCARADO***",
      "tipo": "Pessoa Jurídica",
      "qualificacao": { "id": "22", "descricao": "Sócio-Administrador" },
      "data_entrada": "2010-05-15",
      "pais": { "id": "105", "nome": "Brasil" },
      "faixa_etaria": null
    }
  ],
  "simples": {
    "simples": "Não",
    "data_opcao_simples": null,
    "data_exclusao_simples": null,
    "mei": "Não",
    "data_opcao_mei": null,
    "data_exclusao_mei": null,
    "atualizado_em": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## GET `/cnpj-raiz/:cnpj_raiz` — Básico

Retorna a empresa matriz e todas as filiais de um CNPJ raiz (8 dígitos), com paginação.

```bash
GET /cnpj-raiz/27865757?pagina=1&limite=20
```

**Query params:**

| Param | Tipo | Padrão | Descrição |
|---|---|---|---|
| `pagina` | number | 1 | Número da página |
| `limite` | number | 20 | Registros por página (máx. 100) |

**Resposta:**
```json
{
  "paginacao": {
    "pagina_atual": 1,
    "total_paginas": 3,
    "total_registros": 42,
    "limite": 20
  },
  "cnpj_raiz": "27865757",
  "razao_social": "GLOBO COMUNICACAO E PARTICIPACOES S/A",
  "estabelecimentos": [
    { "cnpj": "27865757000102", "tipo": "Matriz", "situacao_cadastral": "Ativa", "uf": "RJ" },
    { "cnpj": "27865757000200", "tipo": "Filial", "situacao_cadastral": "Ativa", "uf": "SP" }
  ]
}
```

---

## GET `/v2/pesquisa` — Premium

Pesquisa avançada com até 18 filtros e paginação por cursor.

```bash
GET /v2/pesquisa?atividade_principal_id=4711301&estado_id=35&situacao_cadastral=Ativa&limite=50
```

**Filtros disponíveis:**

| Parâmetro | Tipo | Exemplo | Descrição |
|---|---|---|---|
| `atividade_principal_id` | string | `4711301` | Código CNAE principal |
| `atividade_secundaria_id` | string | `4711302` | Código CNAE secundário |
| `estado_id` | number | `35` | Código IBGE do estado |
| `cidade_id` | number | `3550308` | Código IBGE do município |
| `razao_social` | string | `LTDA` | Busca parcial |
| `nome_fantasia` | string | `mercado` | Busca parcial |
| `natureza_juridica_id` | string | `2062` | Código natureza jurídica |
| `porte_id` | string | `01` | ME=01, EPP=03, Demais=05 |
| `situacao_cadastral` | string | `Ativa` | Ativa/Baixada/Inapta/Suspensa |
| `data_inicio_atividade_de` | date | `2020-01-01` | Data de abertura mínima |
| `data_inicio_atividade_ate` | date | `2024-12-31` | Data de abertura máxima |
| `socio_nome` | string | `João` | Nome de sócio |
| `socio_cpf_cnpj` | string | `123.***.***-**` | CPF/CNPJ de sócio (mascarado) |
| `cep` | string | `01310100` | CEP exato |
| `pais_id` | string | `105` | Código BACEN do país |
| `simples` | boolean | `true` | Optante Simples Nacional |
| `mei` | boolean | `false` | Optante MEI |
| `limite` | number | `50` | Registros por página (máx. 100) |
| `cursor` | string | — | Token de paginação |

**Resposta:**
```json
{
  "paginacao": {
    "limite": 50,
    "total_aproximado": 38876,
    "cursor_atual": "eyJ2IjoiMjc4NjU3NTcwMDAxMDIiLCJkIjoiYXNjIiwibSI6ImluYyJ9",
    "proximo_cursor": "eyJ2IjoiMjc4NjU3NTcwMDAxMDMiLCJkIjoiYXNjIiwibSI6ImluYyJ9",
    "tem_proxima_pagina": true
  },
  "filtros_aplicados": {
    "atividade_principal_id": "4711301",
    "estado_id": 35,
    "situacao_cadastral": "Ativa"
  },
  "data": [
    "27865757000102",
    "12345678000191"
  ]
}
```

> Para buscar os dados completos de cada CNPJ retornado, chamar `GET /cnpj/:cnpj` individualmente.

---

## POST `/suframa` — Básico

Valida inscrição Suframa (Zona Franca de Manaus e áreas de livre comércio).

```bash
POST /suframa
Content-Type: application/json

{
  "cnpj": "61940292006682",
  "inscricao": "210140267"
}
```

**Resposta:**
```json
{
  "cnpj_raiz": "61940292",
  "cnpj": "61940292006682",
  "inscricao_suframa": "210140267",
  "ativo": true,
  "atualizado_em": "2024-01-16T12:28:32.434Z"
}
```

---

## GET `/consumo` — Básico

Monitoramento de requisições mensais do token autenticado.

```bash
GET /consumo
GET /consumo?ano=2024&mes=6
```

**Resposta:**
```json
{
  "plano": "basico",
  "limite_mensal": 50000,
  "data": [
    {
      "ano": 2024,
      "mes": 6,
      "quantidade": 12543,
      "atualizado_em": "2024-06-29T20:41:55.434Z"
    }
  ]
}
```

---

## GET `/cep/:cep` — Básico

Converte CEP em coordenadas geográficas (lat/lng). Resultado cacheado permanentemente.

```bash
GET /cep/01310100
```

**Resposta:**
```json
{
  "cep": "01310100",
  "logradouro": "Avenida Paulista",
  "bairro": "Bela Vista",
  "cidade": "São Paulo",
  "cidade_ibge": 3550308,
  "uf": "SP",
  "lat": -23.5613,
  "lng": -46.6558,
  "geocodificado_em": "2024-01-10T14:22:00.000Z"
}
```

---

## GET `/mapa` — Premium

Retorna GeoJSON com empresas filtradas para renderização no Leaflet.

```bash
GET /mapa?cnae=4711301&uf=SP&situacao_cadastral=Ativa&limit=500
```

**Resposta:** `application/geo+json`

```json
{
  "type": "FeatureCollection",
  "total": 1243,
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-46.6558, -23.5613] },
      "properties": {
        "cnpj": "27865757000102",
        "razao_social": "EMPRESA LTDA",
        "nome_fantasia": "Nome Fantasia",
        "situacao_cadastral": "Ativa",
        "cnae": "4711301",
        "cnae_descricao": "Comércio varejista de mercadorias",
        "porte": "ME",
        "simples": true,
        "telefone": "(11) 3333-4444",
        "email": "contato@empresa.com",
        "endereco": "Av. Paulista, 100 - Bela Vista - SP"
      }
    }
  ]
}
```

---

## GET `/health` — Público

Health check do serviço.

```bash
GET /health
```

```json
{ "status": "ok", "timestamp": "2024-06-29T10:00:00.000Z", "banco": "ok", "etl_ultima_carga": "2024-06-01" }
```

---

## Códigos de erro

| HTTP | Situação |
|---|---|
| `400` | Parâmetro inválido |
| `401` | Token ausente ou inválido |
| `403` | Plano insuficiente para o endpoint |
| `404` | CNPJ não encontrado |
| `429` | Rate limit excedido |
| `500` | Erro interno |

```json
{
  "status": 429,
  "titulo": "Rate limit excedido",
  "detalhes": "Limite de 3 requisições por minuto atingido. Aguarde 60 segundos ou use um token.",
  "validacao": []
}
```
