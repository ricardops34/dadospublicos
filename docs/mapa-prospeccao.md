# Módulo: Mapa de Prospecção e Carteira

> Tela única com **Leaflet.js** exibindo clientes da carteira e prospects da base RFB.
> Filtros pelos campos do cartão CNPJ. Geocodificação por CEP via ViaCEP + Nominatim.

---

## Visão geral da tela

```
┌──────────────────────────────────────────────────────────────────────┐
│  [Filtros laterais]          [Mapa Leaflet — fullscreen]             │
│                                                                      │
│  CNAE ▼                      ● cliente da carteira  (azul)          │
│  UF   ▼                      ◆ prospect RFB         (verde)         │
│  Município ▼                 ▲ ambos                (laranja)       │
│  Porte ▼                                                             │
│  Situação ▼                  [Popup ao clicar no pin]                │
│  Simples S/N                 Razão social                            │
│  Só prospects                CNPJ / Situação                        │
│  Só carteira                 CNAE / Porte                            │
│                              CEP / Endereço                          │
│  [Aplicar filtros]           [+ Importar como Lead]                  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Stack técnica

| Camada | Tecnologia | Função |
|---|---|---|
| Frontend | Angular 21 + PO-UI | Shell da tela, filtros, sidebar |
| Mapa | **Leaflet.js 1.9.x** + `leaflet.markercluster` | Renderização do mapa |
| Tiles | OpenStreetMap (gratuito) | Camada de mapa base |
| Geocodificação | **ViaCEP** + **Nominatim (OSM)** | CEP → lat/lng |
| Backend | NestJS — módulo `prospeccao` | API de busca e geocodificação |
| Base de dados | Schema `rfb` no PostgreSQL | Dados públicos RFB |
| Cache geocode | Tabela `ceps` do CRM | Evita re-consulta da mesma coordenada |

> **Custo zero** — OpenStreetMap + Nominatim são gratuitos sem API key.
> Para volumes altos ou precisão maior, pode-se adicionar Google Maps Geocoding como fallback.

---

## Fluxo de geocodificação

```
[Endpoint /prospeccao/mapa]
        │
        ├─ Busca estabelecimentos na base RFB (filtros aplicados)
        │
        ├─ Para cada registro:
        │    ├─ CEP existe na tabela `ceps` com lat/lng? → usa cache
        │    └─ Não existe → chama ViaCEP → depois Nominatim
        │         └─ Salva lat/lng na tabela `ceps` (cache permanente)
        │
        └─ Retorna GeoJSON com features (clientes + prospects)
```

### Estratégia de geocodificação por CEP

```
CEP → ViaCEP (logradouro, bairro, municipio, uf)
    → Nominatim query: "logradouro, numero, municipio, uf, Brasil"
    → lat, lng
    → salva em ceps.lat / ceps.lng
```

**Rate limit Nominatim:** 1 req/segundo. Processar em batch com throttle no backend.

---

## Alteração nas tabelas do CRM

### Adicionar lat/lng na tabela `ceps`

```typescript
// cep.entity.ts — campos adicionais
@Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
lat: number | null;

@Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
lng: number | null;

@Column({ name: 'geocodificado_em', type: 'timestamp', nullable: true })
geocodificadoEm: Date | null;
```

---

## API Backend — módulo `prospeccao`

### `GET /prospeccao/mapa`

Query params (todos opcionais):

| Parâmetro | Tipo | Exemplo | Descrição |
|---|---|---|---|
| `cnae` | string | `4711301` | Código CNAE |
| `uf` | string | `SP` | Sigla do estado |
| `municipio_ibge` | number | `3550308` | Código IBGE do município |
| `porte` | string | `ME,EPP` | Porte (separado por vírgula) |
| `situacao` | string | `02` | 02=Ativa, 04=Inapta |
| `simples` | boolean | `true` | Optantes Simples Nacional |
| `mei` | boolean | `false` | Optantes MEI |
| `camadas` | string | `carteira,prospects` | Quais camadas retornar |
| `limit` | number | `500` | Max de pins por camada |

**Response:** GeoJSON FeatureCollection

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-46.6333, -23.5505] },
      "properties": {
        "tipo": "carteira",
        "cnpj": "12.345.678/0001-90",
        "razao_social": "Empresa LTDA",
        "nome_fantasia": "Nome Fantasia",
        "situacao": "Ativa",
        "cnae_codigo": "4711301",
        "cnae_descricao": "Comércio varejista...",
        "porte": "ME",
        "simples": true,
        "telefone": "(11) 99999-9999",
        "email": "contato@empresa.com",
        "endereco": "Rua X, 123 - Bairro - SP",
        "cliente_id": "uuid-se-for-carteira"
      }
    }
  ]
}
```

### `POST /prospeccao/importar-lead`

Converte um prospect da base RFB em lead/cliente no CRM.

```json
{ "cnpj": "12345678000190" }
```

---

## Frontend Angular — componente do mapa

```
src/app/modules/prospeccao/
├── prospeccao.module.ts
├── prospeccao-routing.module.ts
├── mapa/
│   ├── mapa.component.ts        ← inicializa Leaflet, gerencia camadas
│   ├── mapa.component.html
│   ├── mapa.component.scss
│   ├── mapa-filtros/
│   │   ├── mapa-filtros.component.ts   ← sidebar com filtros PO-UI
│   │   └── mapa-filtros.component.html
│   └── mapa-popup/
│       ├── mapa-popup.component.ts     ← popup do pin
│       └── mapa-popup.component.html
└── prospeccao.service.ts        ← chama GET /prospeccao/mapa
```

### Camadas Leaflet

```typescript
// duas camadas separadas — podem ser ligadas/desligadas
const camadaCarteira  = L.layerGroup()  // pins azuis
const camadaProspects = L.layerGroup()  // pins verdes

L.control.layers({}, {
  'Minha Carteira': camadaCarteira,
  'Prospects RFB':  camadaProspects,
}).addTo(map)
```

### Cluster de marcadores

Usar `leaflet.markercluster` para agrupar pins próximos — obrigatório dado o volume potencial de registros da RFB.

```bash
npm install leaflet leaflet.markercluster
npm install @types/leaflet --save-dev
```

---

## Escopo e fases

### V2 — Fase 1 (backend + mapa básico)
- [ ] Carga da base RFB no schema `rfb`
- [ ] Módulo NestJS `prospeccao` com endpoint `/mapa`
- [ ] Geocodificação de CEPs via ViaCEP + Nominatim com cache
- [ ] Componente Angular com Leaflet — duas camadas (carteira + prospects)
- [ ] Filtros: CNAE, UF, município, porte, situação
- [ ] Popup com dados do cartão CNPJ

### V2 — Fase 2 (prospecção avançada)
- [ ] Importar prospect como lead
- [ ] Filtro "excluir já na minha carteira"
- [ ] Raio de busca (km) a partir de um ponto central
- [ ] Exportar lista filtrada (CSV)
- [ ] Atualização mensal automática da base RFB (cron)

---

## Dependências npm a adicionar no frontend

```json
"leaflet": "^1.9.4",
"leaflet.markercluster": "^1.5.3"
```

```json
devDependencies:
"@types/leaflet": "^1.9.x"
```

> O PO-UI não tem componente de mapa — Leaflet é usado diretamente via `import * as L from 'leaflet'` no componente Angular.
