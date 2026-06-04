---
name: data-dictionary-lookup
description: "Query the TOTVS Protheus ERP data dictionary (SX2 tables, SX3 fields, SIX indexes, SX6 parameters, SX5 generic tables, SX7 triggers, SX1 questions, SX9 relationships, SXB standard lookups, SXG/SXA groups). Use when the user asks 'what fields does SA1 have', 'what is the index of SE1', 'parameter MV_ESTADO', 'generic table 12', 'triggers for field A1_COD', 'standard lookup SA1', 'table structure', 'data dictionary'. Also use during refactoring, migration, or code improvements when dictionary impact validation is needed to confirm whether changes affect fields, triggers, indexes, parameters, or table relationships."
license: MIT
metadata:
  domain: Protheus
  maintainer: Customizações ADVPL/TLPP
  author: Thalion Starforge
  version: '4.2.0'
  category: Documentation
---

# Protheus Data Dictionary Lookup

## Overview

Structured querying of the TOTVS Protheus ERP data dictionary. Allows searching tables, fields, indexes, parameters, generic tables, triggers, parameterization questions, relationships, and standard lookups (SQL queries via `execute-sql` and TDN documentation via search tools).

## When to Use

- Discover which fields a table has and their types/sizes
- Check available indexes for a table
- Query the value and purpose of a parameter (MV_*)
- Search generic table contents (SX5)
- Check triggers associated with a field
- Query parameterization questions (SX1)
- Check relationships between tables (SX9)
- Query standard lookups (SXB)
- Find the sharing mode of a table (Exclusive/Shared)
- **Impact validation in the dictionary**: during refactorings, migrations, or code improvements, consult the dictionary when necessary to confirm whether the changes affect fields, triggers, indexes, parameters, or relationships of the tables involved in the process

---

## Bundled Reference Files

This skill uses progressive disclosure. The SKILL.md covers dictionary structure, query flow, and response format. SQL queries and detailed column reference are in the `references/` directory — read on demand as needed:

| Reference File | When to Read | Content |
| --- | --- | --- |
| [references/sql-queries.md](references/sql-queries.md) | Executing **dictionary queries** — listing fields, indexes, parameters, triggers, questions, relationships, standard lookups, or combining SX* tables | Complete SQL queries for all 9 dictionary tables (SX2, SX3, SIX, SX6, SX5, SX7, SX1, SX9, SXB), combined queries (full view, fields with triggers, mandatory fields), and mandatory `execute-sql` rules (TRIM, d_e_l_e_t_, lowercase) |
| [references/column-reference.md](references/column-reference.md) | Interpreting **results** or needing to understand the **meaning of specific columns** from SX* tables | Detailed tables with all columns from SX2, SX3, SIX, SX6, SX5, SX7, SX1, SX9, and SXB, including type, possible values, and functional description |

---

## Data Dictionary Structure

Protheus organizes its metadata in SX* tables:

| Table | Description | Primary Key |
|-------|-------------|-------------|
| **SX1** | Parameterization questions (reports/queries) | `X1_GRUPO` + `X1_ORDEM` |
| **SX2** | System tables registry | `X2_CHAVE` (table alias) |
| **SX3** | Table fields | `X3_ARQUIVO` + `X3_CAMPO` |
| **SX5** | Generic tables (lookup values) | `X5_TABELA` + `X5_CHAVE` |
| **SX6** | System parameters (MV_*) | `X6_VAR` |
| **SX7** | Field triggers | `X7_CAMPO` + `X7_SEQUENC` |
| **SX9** | Table relationships | `X9_DOM` + `X9_CDOM` |
| **SXA** | Folders and groupers | - |
| **SXB** | Standard lookups (F3) | `XB_ALIAS` + `XB_TIPO` |
| **SXG** | Field groups | - |
| **SIX** | Table indexes | `INDICE` + `ORDEM` |

---

## Multi-Company Table Suffix

In SQL Server environments with multiple companies, the SX* dictionary tables are suffixed with the **company code** (zero-padded to 3 digits):

| Company | SX2 | SX3 | SIX | SX5 | SX6 | SX7 |
|---------|-----|-----|-----|-----|-----|-----|
| Company 01 | `SX2010` | `SX3010` | `SIX010` | `SX5010` | `SX6010` | `SX7010` |
| Company 02 | `SX2020` | `SX3020` | `SIX020` | `SX5020` | `SX6020` | `SX7020` |

> The base table (`SX3`, `SX2`, `SIX`) in these environments contains only cross-company customizations or may be empty. **Always query the suffixed table** for the target company.

### Determining the correct suffix

**Step 1 — Check if the user specified a company.** If they said "company 01" or "empresa 01", use suffix `010`. If "company 02" / "empresa 02", use `020`.

**Step 2 — If not specified, discover available company tables:**

```sql
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME LIKE 'SX3%'
  AND TABLE_NAME NOT LIKE '%BKP%'
  AND TABLE_NAME NOT LIKE '%XNQ%'
ORDER BY TABLE_NAME
```

**Step 3 — If multiple companies exist and the user did not specify, ask before querying.** Do not assume company 01.

**Step 4 — If base table (`SX3`) returns 0 rows for the target alias**, automatically retry with the `010` suffix (company 01 default).

### This environment

- **Company 01 → suffix `010`** (e.g., `SX3010`, `SX2010`, `SIX010`)
- **Company 02 → suffix `020`** (e.g., `SX3020`, `SX2020`, `SIX020`)
- Base tables (`SX3`, `SX2`, `SIX`) contain only cross-company custom fields

---

## Mandatory Rules for execute-sql Queries

1. **Always** include `D_E_L_E_T_ = ' '` (soft-delete filter)
2. Columns are **uppercase** in this environment — use `X3_CAMPO`, `X3_TITULO`, etc.
3. Use `TRIM()` in `character` field comparisons (trailing spaces)
4. Use the **suffixed table** for company-specific queries: `SX3010`, `SX2010`, `SIX010`
5. Never use branch suffix: `SX3T10` — this is different from the company suffix `SX3010`

---

## Query Flow by Scenario

### Full table overview

Execute **3 queries in parallel** (see queries in [references/sql-queries.md](references/sql-queries.md)):

1. **Metadata** → `SX2{SUFFIX}` filtering by `X2_CHAVE`
2. **Fields** → `SX3{SUFFIX}` filtering by `X3_ARQUIVO`
3. **Indexes** → `SIX{SUFFIX}` filtering by `INDICE`

### Parameter lookup

1. Search by exact name (`TRIM(X6_VAR) LIKE 'MV_NAME%'`) or by description (`UPPER(X6_DESCRIC) LIKE '%TERM%'`)
2. If additional context is needed, search TDN documentation via `product-docs-search`

### Field triggers

1. Query `SX7{SUFFIX}` filtering by `X7_CAMPO`
2. Combine with `SX3{SUFFIX}` to get field titles for involved fields

---

## Response Format

When presenting results to the user, always:

1. **Title**: Table name and description (from SX2)
2. **Sharing mode**: E (Exclusive) or C (Shared) — indicate the meaning
3. **Formatted table**: Fields in markdown table with relevant columns
4. **Indexes**: List with composition and description
5. **Notes**: Virtual fields, triggers, special validations

### Response Example

```markdown
## SA1 — Clientes

**Modo:** Compartilhado (C) | **Chave única:** A1_FILIAL+A1_COD+A1_LOJA | **Rotina MVC:** CRMA980

### Campos Principais

| Campo | Título | Tipo | Tam | Dec | Contexto | Obrig | F3 |
|-------|--------|------|-----|-----|----------|-------|----|
| A1_FILIAL | Filial | C | 2 | — | — | x | — |
| A1_COD | Codigo | C | 6 | — | R | x | — |
| A1_LOJA | Loja | C | 2 | — | — | x | — |
| A1_NOME | Nome | C | 50 | — | — | x | — |

### Índices

| Ordem | Composição | Descrição |
|-------|-----------|-----------|
| 1 | A1_FILIAL+A1_COD+A1_LOJA | Codigo + Loja |
| 2 | A1_FILIAL+A1_NOME+A1_LOJA | Nome + Loja |
```

---

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Query returns empty | Base table `SX3` used instead of `SX3010` | Use company-suffixed table: `SX3010`, `SX3020` |
| Query returns empty | `character` field has trailing spaces | Use `TRIM()` in comparisons |
| Field not found | Alias with spaces in `X3_ARQUIVO` | Use `TRIM(X3_ARQUIVO) = 'SA1'` |
| Deleted records returned | Missing soft-delete filter | Always include `D_E_L_E_T_ = ' '` |
| Wrong company data | Queried `SX3010` but user is on company 02 | Use `SX3020` for company 02 |
