# Banco de Dados — RFB Data Service

> PostgreSQL 16 · Schema: `public` (banco dedicado `dados_rfb`)
> Baseado no projeto de referência: https://github.com/aphonsoar/Receita_Federal_do_Brasil_-_Dados_Publicos_CNPJ

---

## Diagrama de relacionamentos

```
empresa ──────────────────┐
                          │ cnpj_basico
estabelecimento ──────────┤
                          │
socios ───────────────────┤
                          │
simples ──────────────────┘

estabelecimento.cnae_fiscal_principal ──► cnae.codigo
estabelecimento.municipio             ──► munic.codigo
estabelecimento.pais                  ──► pais.codigo
socios.qualificacao_socio             ──► quals.codigo
empresa.natureza_juridica             ──► natju.codigo
empresa.situacao_cadastral            ──► moti.codigo

ceps (cache geocode)
  └── ceps.municipio_ibge ──► munic.codigo_ibge
```

---

## Tabelas principais

### `empresa`
Dados cadastrais da **matriz** de cada pessoa jurídica.

| Coluna | Tipo | Descrição |
|---|---|---|
| `cnpj_basico` | varchar(8) | PK — 8 primeiros dígitos do CNPJ |
| `razao_social` | varchar | Razão social |
| `natureza_juridica` | varchar(4) | FK → natju |
| `qualificacao_responsavel` | varchar(2) | FK → quals |
| `capital_social` | decimal | Capital social |
| `porte_empresa` | varchar(2) | 01=ME, 03=EPP, 05=Demais |
| `ente_federativo` | varchar | Ente federativo responsável |

### `estabelecimento`
Dados de cada **filial/unidade** (inclui a matriz como `cnpj_ordem = 0001`).

| Coluna | Tipo | Descrição |
|---|---|---|
| `cnpj_basico` | varchar(8) | FK → empresa |
| `cnpj_ordem` | varchar(4) | Ordem da filial |
| `cnpj_dv` | varchar(2) | Dígito verificador |
| `identificador_matriz_filial` | varchar(1) | 1=Matriz, 2=Filial |
| `nome_fantasia` | varchar | — |
| `situacao_cadastral` | varchar(2) | 02=Ativa 03=Suspensa 04=Inapta 08=Baixada |
| `data_situacao_cadastral` | date | — |
| `motivo_situacao_cadastral` | varchar(2) | FK → moti |
| `cnae_fiscal_principal` | varchar(7) | FK → cnae |
| `cnae_fiscal_secundaria` | text | Lista separada por vírgula |
| `data_inicio_atividade` | date | — |
| `logradouro` | varchar | — |
| `numero` | varchar | — |
| `complemento` | varchar(200) | — |
| `bairro` | varchar(150) | — |
| `cep` | varchar(8) | — |
| `uf` | varchar(2) | — |
| `municipio` | varchar(4) | FK → munic |
| `ddd_telefone_1` | varchar(4) | — |
| `telefone_1` | varchar | — |
| `ddd_telefone_2` | varchar(4) | — |
| `telefone_2` | varchar | — |
| `ddd_fax` | varchar(4) | — |
| `fax` | varchar | — |
| `email` | varchar | — |
| `situacao_especial` | varchar | — |
| `data_situacao_especial` | date | — |

> CNPJ completo = `cnpj_basico + cnpj_ordem + cnpj_dv`

### `socios`
Quadro societário de cada empresa.

| Coluna | Tipo | Descrição |
|---|---|---|
| `cnpj_basico` | varchar(8) | FK → empresa |
| `identificador_socio` | varchar(1) | 1=PJ 2=PF 3=Estrangeiro |
| `nome_socio` | varchar | — |
| `cnpj_cpf_socio` | varchar | CPF/CNPJ mascarado |
| `qualificacao_socio` | varchar(2) | FK → quals |
| `data_entrada_sociedade` | date | — |
| `pais` | varchar(3) | FK → pais |
| `representante_legal` | varchar | — |
| `nome_representante` | varchar | — |
| `qualificacao_representante` | varchar(2) | FK → quals |
| `faixa_etaria` | varchar(1) | 1=0-12 ... 9=Não informado |

### `simples`
Situação no Simples Nacional e MEI.

| Coluna | Tipo | Descrição |
|---|---|---|
| `cnpj_basico` | varchar(8) | PK, FK → empresa |
| `opcao_pelo_simples` | varchar(1) | S/N |
| `data_opcao_simples` | date | — |
| `data_exclusao_simples` | date | — |
| `opcao_pelo_mei` | varchar(1) | S/N |
| `data_opcao_mei` | date | — |
| `data_exclusao_mei` | date | — |

---

## Tabelas de referência (lookup)

| Tabela | PK | Conteúdo |
|---|---|---|
| `cnae` | `codigo` varchar(7) | Classificação de atividades econômicas |
| `natju` | `codigo` varchar(4) | Naturezas jurídicas |
| `quals` | `codigo` varchar(2) | Qualificações de sócios |
| `moti` | `codigo` varchar(2) | Motivos de situação cadastral |
| `pais` | `codigo` varchar(3) | Países |
| `munic` | `codigo` varchar(4) | Municípios (código RFB) |

---

## Tabela extra — cache de geocodificação

### `ceps`
Criada por este projeto (não existe no ETL de referência).
Armazena lat/lng de CEPs consultados via ViaCEP + Nominatim.

| Coluna | Tipo | Descrição |
|---|---|---|
| `cep` | varchar(8) | PK — sem hífen |
| `logradouro` | varchar | — |
| `bairro` | varchar | nullable |
| `municipio_ibge` | integer | Código IBGE 7 dígitos |
| `uf_sigla` | varchar(2) | — |
| `complemento` | varchar | nullable |
| `lat` | decimal(9,6) | nullable — preenchido após geocodificação |
| `lng` | decimal(9,6) | nullable |
| `geocodificado_em` | timestamp | nullable |
| `atualizado_em` | timestamp | auto |

---

## Índices recomendados

```sql
-- Consultas por CNPJ completo
CREATE INDEX idx_estab_cnpj ON estabelecimento(cnpj_basico, cnpj_ordem, cnpj_dv);

-- Filtros de prospecção
CREATE INDEX idx_estab_situacao  ON estabelecimento(situacao_cadastral);
CREATE INDEX idx_estab_cnae      ON estabelecimento(cnae_fiscal_principal);
CREATE INDEX idx_estab_municipio ON estabelecimento(municipio);
CREATE INDEX idx_estab_uf        ON estabelecimento(uf);
CREATE INDEX idx_empresa_porte   ON empresa(porte_empresa);

-- Cache geocode
CREATE INDEX idx_ceps_sem_geo ON ceps(cep) WHERE lat IS NULL;
```
