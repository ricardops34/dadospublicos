-- ============================================================================
-- AJUSTES CONSOLIDADOS — 2026-06-10
-- Aplica no banco ATUAL todas as diferenças desta entrega:
--   1. CNAE no cadastro de cliente PJ (contas + conta_cnaes_secundarios)
--   2. Token de API pertence ao Cliente/conta (tokens.conta_id + backfill)
--   3. Manutenção de usuários (rotina de menu "Usuários" p/ admin)
--
-- Banco alvo: buscadados
-- Idempotente: pode ser executado mais de uma vez sem efeito colateral.
--
-- Aplicar com:
--   docker compose exec -T postgres psql -U rfb_user -d buscadados < historico/sql/2026-06-10_ajustes-completos.sql
-- (Swarm/Portainer):
--   docker exec -i <container_postgres> psql -U rfb_user -d buscadados < historico/sql/2026-06-10_ajustes-completos.sql
--
-- Obs.: o backend (TypeORM synchronize=true) cria colunas/FKs no próximo
-- restart, mas NÃO faz os backfills nem insere o menu — por isso este script.
-- ============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. CNAE — cadastro de cliente pessoa jurídica
-- ============================================================================

-- CNAE principal na conta/empresa (tenant)
ALTER TABLE contas ADD COLUMN IF NOT EXISTS cnae_principal varchar(7);
ALTER TABLE contas ADD COLUMN IF NOT EXISTS cnae_principal_descricao varchar(300);

-- CNAEs secundários da conta/empresa
CREATE TABLE IF NOT EXISTS conta_cnaes_secundarios (
    id          uuid         NOT NULL DEFAULT uuid_generate_v4(),
    conta_id    uuid         NOT NULL,
    codigo      varchar(7)   NOT NULL,
    descricao   varchar(300),
    criado_em   timestamp    NOT NULL DEFAULT now(),
    CONSTRAINT pk_conta_cnaes_secundarios PRIMARY KEY (id),
    CONSTRAINT uq_conta_cnae_secundario UNIQUE (conta_id, codigo),
    CONSTRAINT fk_conta_cnaes_secundarios_conta FOREIGN KEY (conta_id)
        REFERENCES contas (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_conta_cnaes_secundarios_conta
    ON conta_cnaes_secundarios (conta_id);

-- ============================================================================
-- 2. Token de API pertence ao CLIENTE (conta)
-- ============================================================================

-- Coluna de propriedade do token. Null = token de admin da plataforma.
ALTER TABLE tokens ADD COLUMN IF NOT EXISTS conta_id uuid;

-- FK tokens.conta_id -> contas (Postgres não tem ADD CONSTRAINT IF NOT EXISTS)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'tokens' AND constraint_name = 'fk_tokens_conta'
  ) THEN
    ALTER TABLE tokens
      ADD CONSTRAINT fk_tokens_conta FOREIGN KEY (conta_id)
      REFERENCES contas (id) ON DELETE SET NULL;
  END IF;
END $$;

-- Remove o índice único durante o backfill (pode já existir se a API
-- reiniciou antes deste script). Recriado ao final desta seção.
DROP INDEX IF EXISTS uq_tokens_conta_ativo;

-- Backfill: token herda a conta do usuário dono da assinatura que o referencia
UPDATE tokens t
SET conta_id = u.conta_id
FROM assinaturas a
JOIN usuarios u ON u.id = a.cliente_id
WHERE a.token_id = t.id
  AND t.conta_id IS NULL
  AND u.conta_id IS NOT NULL;

-- Backfill: assinaturas passam a referenciar a conta do usuário
UPDATE assinaturas a
SET conta_id = u.conta_id
FROM usuarios u
WHERE u.id = a.cliente_id
  AND a.conta_id IS NULL
  AND u.conta_id IS NOT NULL;

-- Garante exatamente 1 token ATIVO por Cliente: desativa duplicados,
-- mantendo o mais recente de cada conta
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

-- Índice único parcial: no máximo 1 token ativo por conta
CREATE UNIQUE INDEX IF NOT EXISTS uq_tokens_conta_ativo
    ON tokens (conta_id)
    WHERE ativo = true AND conta_id IS NOT NULL;

-- ============================================================================
-- 3. Manutenção de usuários — menu do admin
--    (a aba "Usuários" do perfil cliente fica em Minha Conta e não usa menu;
--     o usuário principal já é contas.proprietario_id — sem mudança de schema)
-- ============================================================================

-- Rotina "Usuários" no módulo Configurações (admin)
INSERT INTO menu_rotinas (id, modulo_id, nome, short_label, icone, rota, tipo, ordem, ativo, recurso) VALUES
  ('c1000000-0000-0000-0000-000000000020','b1000000-0000-0000-0000-000000000004','Usuários','Usuários','an an-users','/portal/usuarios-admin','link',4,TRUE,NULL)
ON CONFLICT (id) DO UPDATE
  SET modulo_id = EXCLUDED.modulo_id, nome = EXCLUDED.nome, short_label = EXCLUDED.short_label,
      icone = EXCLUDED.icone, rota = EXCLUDED.rota, tipo = EXCLUDED.tipo,
      ordem = EXCLUDED.ordem, recurso = EXCLUDED.recurso;

-- Vincula a rotina ao perfil Administrador
INSERT INTO perfil_rotinas (perfil_id, rotina_id) VALUES
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000020')
ON CONFLICT DO NOTHING;

COMMIT;

-- ============================================================================
-- Conferências (opcionais, executar à parte):
-- ============================================================================
-- Colunas novas:
--   SELECT column_name FROM information_schema.columns WHERE table_name='contas'  AND column_name LIKE 'cnae%';
--   SELECT column_name FROM information_schema.columns WHERE table_name='tokens'  AND column_name='conta_id';
-- Tokens sem conta (esperado: apenas tokens de admin):
--   SELECT id, nome, email FROM tokens WHERE conta_id IS NULL AND ativo = true;
-- Nenhuma conta com mais de 1 token ativo (esperado: 0 linhas):
--   SELECT conta_id, count(*) FROM tokens WHERE ativo = true AND conta_id IS NOT NULL GROUP BY conta_id HAVING count(*) > 1;
-- Menu do admin:
--   SELECT nome, rota FROM menu_rotinas WHERE id = 'c1000000-0000-0000-0000-000000000020';
