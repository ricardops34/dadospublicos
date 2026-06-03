# ETL — Pipeline de Carga RFB

> Baseado em: https://github.com/aphonsoar/Receita_Federal_do_Brasil_-_Dados_Publicos_CNPJ
> Linguagem: Python 3.11+

---

## Visão geral

```
[dados.gov.br]
      │  download (~4,7 GB ZIP)
      ▼
[etl/downloads/]       ← arquivos ZIP
      │  descompressão
      ▼
[etl/extraidos/]       ← arquivos CSV (layout fixo RFB)
      │  parse + limpeza
      ▼
[PostgreSQL — schema rfb]
      │  10 tabelas prontas
      ▼
[API NestJS]
```

---

## Arquivos fonte da RFB

A Receita Federal disponibiliza os dados divididos em múltiplos ZIPs:

| Arquivo | Conteúdo | Tamanho aprox. |
|---|---|---|
| `Empresas*.zip` | Dados de matrizes | ~1,2 GB |
| `Estabelecimentos*.zip` | Dados de filiais | ~2,8 GB |
| `Socios*.zip` | Quadro societário | ~0,4 GB |
| `Simples.zip` | Simples Nacional/MEI | ~0,3 GB |
| `Cnaes.zip` | Tabela CNAE | < 1 MB |
| `Naturezas.zip` | Naturezas jurídicas | < 1 MB |
| `Qualificacoes.zip` | Qualificações de sócios | < 1 MB |
| `Municipios.zip` | Municípios | < 1 MB |
| `Paises.zip` | Países | < 1 MB |
| `Motivos.zip` | Motivos de situação | < 1 MB |

**URL base:** `https://dadosabertos.rfb.gov.br/CNPJ/`

---

## Estrutura do ETL

```
etl/
├── etl_rfb.py           ← script principal (4 fases)
├── etl_sintegra.py      ← carga de inscrições estaduais
├── config.py            ← lê .env
├── db.py                ← conexão PostgreSQL (psycopg2)
├── requirements.txt
└── downloads/           ← ZIPs baixados (gitignore)
└── extraidos/           ← CSVs extraídos (gitignore)
```

---

## As 4 fases do `etl_rfb.py`

### Fase 1 — Download

```python
# Baixa todos os ZIPs da RFB para etl/downloads/
# Verifica tamanho para evitar re-download desnecessário
download_arquivos_rfb(OUTPUT_PATH)
```

### Fase 2 — Descompressão

```python
# Extrai os ZIPs para etl/extraidos/
# Pula arquivos já extraídos
descompactar_arquivos(OUTPUT_PATH, EXTRACTED_PATH)
```

### Fase 3 — Tratamento

```python
# Lê os CSVs conforme layout oficial (NOVOLAYOUTDOSDADOSABERTOSDOCNPJ.pdf)
# Limpa encoding (latin-1 → utf-8), remove espaços, trata nulos
# Transforma campos de data (YYYYMMDD → date)
tratar_dados(EXTRACTED_PATH)
```

### Fase 4 — Carga no banco

```python
# TRUNCATE + INSERT em lote (copy_from para performance)
# Ordem respeitada: lookups primeiro, depois tabelas principais
carregar_banco(conn)
```

---

## Requisitos de hardware

| Recurso | Mínimo | Recomendado |
|---|---|---|
| Disco | 25 GB livres | 50 GB |
| RAM | 4 GB | 8 GB |
| CPU | 2 cores | 4 cores |
| Tempo de carga | 8h | 4h |

---

## Variáveis de ambiente necessárias

```env
OUTPUT_FILES_PATH=./etl/downloads
EXTRACTED_FILES_PATH=./etl/extraidos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dados_rfb
DB_USER=rfb_user
DB_PASSWORD=
```

---

## Como executar

```bash
cd etl
pip install -r requirements.txt
cp ../.env.example ../.env   # preencher variáveis
python etl_rfb.py
```

---

## Atualização mensal

A RFB disponibiliza uma nova versão completa por mês (não há delta/incremental).
O processo é sempre **full reload**:

```bash
# Cron sugerido — 1º de cada mês às 3h
0 3 1 * * cd /opt/dadospublicos/etl && python etl_rfb.py >> /var/log/etl_rfb.log 2>&1
```

**Estratégia de atualização sem downtime:**

```
1. Carregar dados novos em schema temporário (rfb_novo)
2. Validar contagens (deve ter ~55M+ estabelecimentos)
3. Renomear: rfb → rfb_old, rfb_novo → rfb
4. Dropar rfb_old
```

---

## ETL de inscrições estaduais (`etl_sintegra.py`)

Complementa os dados da RFB com informações estaduais via Sintegra.
Disponível para: SP, MG, RJ, RS, BA, ES, GO, MA, MS, PB, PR, SE.

```bash
python etl_sintegra.py --estado SP
```
