-- ============================================================================
-- Token de API pertence ao CLIENTE (conta), não ao usuário
-- Regra: docs/regra-cliente-usuario.md — 1 token ativo por Cliente, compartilhado
-- por todos os usuários da conta; regeneração afeta todos.
-- Banco alvo: buscadados
--
-- Aplicar com:
--   docker compose exec -T postgres psql -U rfb_user -d buscadados < scripts/sql/2026-06-10_token-por-cliente.sql
-- (Swarm/Portainer: docker exec -i <container_postgres> psql -U rfb_user -d buscadados < ...)
--
-- Obs.: o backend roda TypeORM com synchronize=true; a coluna, FK e índice
-- também são criados no próximo restart da API. Este script aplica no banco
-- atual e faz o BACKFILL (que o synchronize não faz).
-- ============================================================================

-- 1. Coluna de propriedade do token: Cliente (conta). Null = token de admin da plataforma.
ALTER TABLE tokens ADD COLUMN IF NOT EXISTS conta_id uuid;

-- Remove o índice durante o backfill (pode já existir se a API reiniciou antes
-- deste script — o synchronize do TypeORM o cria). Recriado no passo 5.
DROP INDEX IF EXISTS uq_tokens_conta_ativo;

-- 2. Backfill: token herda a conta do usuário dono da assinatura que o referencia
UPDATE tokens t
SET conta_id = u.conta_id
FROM assinaturas a
JOIN usuarios u ON u.id = a.cliente_id
WHERE a.token_id = t.id
  AND t.conta_id IS NULL
  AND u.conta_id IS NOT NULL;

-- 3. Backfill: assinaturas passam a referenciar a conta do usuário
UPDATE assinaturas a
SET conta_id = u.conta_id
FROM usuarios u
WHERE u.id = a.cliente_id
  AND a.conta_id IS NULL
  AND u.conta_id IS NOT NULL;

-- 4. Garante exatamente 1 token ATIVO por Cliente: desativa duplicados,
--    mantendo o mais recente de cada conta
UPDATE tokens t
SET ativo = false
WHERE t.ativo = true
  AND t.conta_id IS NOT NULL
  AND t.id <> (
    SELECT t2.id
    FROM tokens t2
    WHERE t2.conta_id = t.conta_id AND t2.ativo = true
    ORDER BY t2.criado_em DESC
    LIMIT 1
  );

-- 5. Índice único parcial: no máximo 1 token ativo por conta
CREATE UNIQUE INDEX IF NOT EXISTS uq_tokens_conta_ativo
    ON tokens (conta_id)
    WHERE ativo = true AND conta_id IS NOT NULL;

-- Conferência (opcional):
-- SELECT conta_id, count(*) FROM tokens WHERE ativo = true AND conta_id IS NOT NULL GROUP BY conta_id HAVING count(*) > 1;
