# Histórico

Esta pasta concentra scripts SQL e artefatos antigos que não fazem mais parte do fluxo principal de bootstrap.

## Seed atual

- Seed canônico: `backend/seed.js`
- Comando: `backend/package.json:10` com `npm run seed:init`

## Conteúdo

- `historico/sql/`: migrações e backfills históricos
- `historico/backend-scripts/`: scripts SQL antigos do backend

## Uso

Use estes arquivos apenas para:

- migração de ambientes antigos
- recuperação de instalações legadas
- consulta histórica de mudanças de schema/dados
