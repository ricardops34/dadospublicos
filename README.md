# RFB Data Service — API de Dados Públicos CNPJ

Serviço REST completo que processa os dados públicos da **Receita Federal do Brasil**
e os disponibiliza via API — similar ao [cnpj.ws](https://www.cnpj.ws), porém **self-hosted e open-source**.

---

## Visão do produto

```
[Receita Federal — dados.gov.br]   Fontes estaduais (Sintegra)
          │  ETL mensal                     │
          └──────────────┬──────────────────┘
                         ▼
              [PostgreSQL 16 — schema rfb]
                         │
                         ▼
              [API NestJS — RFB Data Service]
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
           [CRM]   [Sistemas]  [Público]
        Visão 360   próprios   (planos)
```

---

## Funcionalidades (espelho do cnpj.ws)

| Funcionalidade | Gratuito | Básico | Premium |
|---|:---:|:---:|:---:|
| Consulta CNPJ individual | ✅ | ✅ | ✅ |
| Dados de estabelecimento completo | ✅ | ✅ | ✅ |
| Dados de sócios | ✅ | ✅ | ✅ |
| Simples Nacional / MEI | ✅ | ✅ | ✅ |
| Filiais por CNPJ raiz | ❌ | ✅ | ✅ |
| Inscrições estaduais | ❌ | ✅ | ✅ |
| Validação Suframa | ❌ | ✅ | ✅ |
| Regimes tributários | ❌ | ❌ | ✅ |
| Pesquisa avançada (18 filtros) | ❌ | ❌ | ✅ |
| Paginação por cursor | ❌ | ❌ | ✅ |
| Monitoramento de consumo | ❌ | ✅ | ✅ |
| Rate limit | 3 req/min | 2000 req/min | 2000 req/min |

---

## Endpoints

| Método | Rota | Auth | Plano mínimo |
|---|---|---|---|
| GET | `/cnpj/:cnpj` | Nenhuma | Gratuito |
| GET | `/cnpj-raiz/:cnpj_raiz` | Token | Básico |
| GET | `/v2/pesquisa` | Token | Premium |
| POST | `/suframa` | Token | Básico |
| GET | `/consumo` | Token | Básico |
| GET | `/geocode/cep/:cep` | Token | Básico |
| GET | `/mapa` | Token | Premium |
| GET | `/health` | Nenhuma | — |

---

## Stack — mesma do CRM Visão 360

| Camada | Tecnologia |
|---|---|
| API | NestJS 11 |
| Linguagem | TypeScript 5 |
| Banco | TypeORM 0.3 + PostgreSQL 16 |
| ETL | Python 3.11 |
| Runtime | Node.js 20 |
| Cache geocode | ViaCEP + Nominatim (OSM) |

---

## Estrutura do repositório

```
dadospublicos/
├── src/
│   ├── modules/
│   │   ├── cnpj/           # GET /cnpj/:cnpj
│   │   ├── cnpj-raiz/      # GET /cnpj-raiz/:cnpj_raiz
│   │   ├── pesquisa/       # GET /v2/pesquisa (Premium)
│   │   ├── suframa/        # POST /suframa
│   │   ├── consumo/        # GET /consumo
│   │   ├── geocode/        # CEP → lat/lng
│   │   ├── mapa/           # GeoJSON para Leaflet
│   │   └── auth/           # Tokens e planos
│   ├── entities/
│   ├── database/
│   └── main.ts
├── etl/                    # Scripts Python (carga RFB)
│   ├── etl_rfb.py
│   ├── etl_sintegra.py
│   └── requirements.txt
├── docs/
│   ├── database.md         # Schema do banco
│   ├── api.md              # Endpoints detalhados
│   ├── etl.md              # Pipeline de carga
│   ├── planos.md           # Planos e rate limiting
│   ├── mapa-prospeccao.md  # Módulo de mapa Leaflet
│   └── integracao.md       # Integração com CRM
├── .env.example
├── .gitignore
└── README.md
```

---

## Início rápido

```bash
git clone https://github.com/ricardops34/dadospublicos.git
cd dadospublicos

# Configurar
cp .env.example .env

# ETL — carga inicial (requer ~25 GB disco, demora horas)
cd etl && pip install -r requirements.txt && python etl_rfb.py

# API
npm install && npm run start:dev
```

> **Requisito de disco:** 25 GB livres para ETL inicial.

---

## Documentação

- [Banco de dados](docs/database.md)
- [API — endpoints detalhados](docs/api.md)
- [ETL — pipeline de carga RFB](docs/etl.md)
- [Planos e rate limiting](docs/planos.md)
- [Mapa de prospecção](docs/mapa-prospeccao.md)
- [Integração com o CRM](docs/integracao.md)

---

## Referências

- Fonte de dados: https://dados.gov.br/dados/conjuntos-dados/cadastro-nacional-da-pessoa-juridica---cnpj
- Metadados RFB: https://www.gov.br/receitafederal/dados/cnpj-metadados.pdf
- ETL de referência: https://github.com/aphonsoar/Receita_Federal_do_Brasil_-_Dados_Publicos_CNPJ
- Produto de referência: https://www.cnpj.ws
