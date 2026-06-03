# RFB Data Service — Dados Públicos CNPJ

Serviço independente que consome a API **cnpj.ws** e os dados públicos da Receita Federal
para oferecer **prospecção de clientes** e **enriquecimento de CNPJ** ao CRM Visão 360.

---

## Arquitetura

```
[cnpj.ws API]          ← busca/enriquecimento individual
      │
      ▼
[RFB Data Service]     ← NestJS 11 / Node 20
      │  cache + filtros avançados
      ▼
[PostgreSQL 16]        ← banco dedicado (dados_rfb)
      │
      ▼
[CRM Visão 360]        ← consome via API REST
```

---

## Fonte de dados

| Fonte | Uso | Plano |
|---|---|---|
| **cnpj.ws** | Lookup individual, enriquecimento, filtros avançados | Gratuito (3 req/min) → Pago (2000 req/min) |
| **RFB bulk** (opcional) | Carga completa para prospecção offline | Download mensal ~4,7 GB compactado |

> Para prospecção em escala (centenas de leads) o plano pago do cnpj.ws ou a carga bulk da RFB
> são necessários. O plano gratuito cobre enriquecimento pontual e demonstração.

---

## Stack

| Camada | Tecnologia | Igual ao CRM? |
|---|---|---|
| API | NestJS 11 | ✅ |
| Linguagem | TypeScript 5 | ✅ |
| Banco | TypeORM 0.3 + PostgreSQL 16 | ✅ |
| Runtime | Node.js 20 | ✅ |
| Variáveis | dotenv / @nestjs/config | ✅ |
| Geocodificação | ViaCEP + Nominatim (OSM) | — |
| Mapa | Leaflet.js (consumido pelo CRM) | — |

---

## Estrutura do repositório

```
dadospublicos/
├── src/
│   ├── modules/
│   │   ├── cnpj/          # Lookup e enriquecimento via cnpj.ws
│   │   ├── prospeccao/    # Busca e filtros de prospecção
│   │   ├── geocode/       # CEP → lat/lng (ViaCEP + Nominatim)
│   │   └── saude/         # Health check
│   ├── entities/          # TypeORM entities
│   ├── database/          # Config DataSource
│   └── main.ts
├── docs/
│   ├── database.md
│   ├── api.md
│   ├── mapa-prospeccao.md
│   └── integracao-crm.md
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Endpoints principais

| Método | Rota | Descrição |
|---|---|---|
| GET | `/cnpj/:cnpj` | Retorna cartão CNPJ completo via cnpj.ws |
| GET | `/prospeccao/busca` | Filtra empresas por CNAE/UF/município/porte |
| GET | `/prospeccao/mapa` | Retorna GeoJSON para Leaflet |
| POST | `/prospeccao/exportar` | Exporta lista filtrada (CSV/JSON) |
| GET | `/geocode/cep/:cep` | CEP → lat/lng (com cache) |

---

## Início rápido

```bash
git clone https://github.com/ricardops34/dadospublicos.git
cd dadospublicos
cp .env.example .env   # preencher CNPJWS_TOKEN e credenciais do banco
npm install
npm run start:dev
```

---

## Documentação

- [Banco de dados](docs/database.md)
- [API — endpoints detalhados](docs/api.md)
- [Mapa de prospecção](docs/mapa-prospeccao.md)
- [Integração com o CRM](docs/integracao-crm.md)
