-- ============================================================================
-- RENOMEAÇÃO DEFINITIVA: a entidade Cliente passa a ser a tabela `clientes`
--   * contas                  → clientes
--   * conta_cnaes_secundarios → cliente_cnaes
--   * usuarios.conta_id       → usuarios.cliente_id
--   * tokens.conta_id         → tokens.cliente_id
--   * assinaturas.cliente_id  → assinaturas.usuario_id  (apontava p/ usuários!)
--   * assinaturas.conta_id    → assinaturas.cliente_id  (o verdadeiro Cliente)
--   * notificacoes.cliente_id → notificacoes.usuario_id (sempre foi o usuário)
--   * usuarios SEM colunas de negócio (cnpj, razão social, endereço, IE/IM,
--     tipo_pessoa) — regra: docs/regra-cliente-usuario.md
--   * Menu: restaura a rotina "Perfis" (id ...0020, que havia sido sobrescrita)
--     e cria "Usuários" no id ...0023
--
-- Banco alvo: buscadados
-- Idempotente. PRÉ-REQUISITO: ter aplicado 2026-06-10_ajustes-completos.sql
-- e 2026-06-10_dados-negocio-conta.sql (backfills) ANTES deste script.
-- Aplicar com a API PARADA e subir a API nova em seguida.
--
--   docker compose exec -T postgres psql -U rfb_user -d buscadados < historico/sql/2026-06-10_rename-clientes.sql
-- ============================================================================

BEGIN;

-- ─── 1. contas → clientes ───────────────────────────────────────────────────
ALTER TABLE IF EXISTS contas RENAME TO clientes;

-- ─── 2. conta_cnaes_secundarios → cliente_cnaes ─────────────────────────────
ALTER TABLE IF EXISTS conta_cnaes_secundarios RENAME TO cliente_cnaes;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name = 'cliente_cnaes' AND column_name = 'conta_id') THEN
    ALTER TABLE cliente_cnaes RENAME COLUMN conta_id TO cliente_id;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uq_conta_cnae_secundario') THEN
    ALTER TABLE cliente_cnaes RENAME CONSTRAINT uq_conta_cnae_secundario TO uq_cliente_cnae;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pk_conta_cnaes_secundarios') THEN
    ALTER TABLE cliente_cnaes RENAME CONSTRAINT pk_conta_cnaes_secundarios TO pk_cliente_cnaes;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_conta_cnaes_secundarios_conta') THEN
    ALTER TABLE cliente_cnaes RENAME CONSTRAINT fk_conta_cnaes_secundarios_conta TO fk_cliente_cnaes_cliente;
  END IF;
END $$;

ALTER INDEX IF EXISTS idx_conta_cnaes_secundarios_conta RENAME TO idx_cliente_cnaes_cliente;

-- ─── 3. usuarios.conta_id → cliente_id ──────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name = 'usuarios' AND column_name = 'conta_id') THEN
    ALTER TABLE usuarios RENAME COLUMN conta_id TO cliente_id;
  END IF;
END $$;

-- ─── 4. tokens.conta_id → cliente_id ────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name = 'tokens' AND column_name = 'conta_id') THEN
    ALTER TABLE tokens RENAME COLUMN conta_id TO cliente_id;
  END IF;
END $$;

ALTER INDEX IF EXISTS uq_tokens_conta_ativo RENAME TO uq_tokens_cliente_ativo;

-- ─── 5. assinaturas: cliente_id → usuario_id, depois conta_id → cliente_id ──
-- ORDEM IMPORTA: o cliente_id antigo apontava para usuarios.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name = 'assinaturas' AND column_name = 'cliente_id')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name = 'assinaturas' AND column_name = 'usuario_id') THEN
    ALTER TABLE assinaturas RENAME COLUMN cliente_id TO usuario_id;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name = 'assinaturas' AND column_name = 'conta_id') THEN
    ALTER TABLE assinaturas RENAME COLUMN conta_id TO cliente_id;
  END IF;
END $$;

-- ─── 6. notificacoes.cliente_id → usuario_id (sempre guardou o usuário) ─────
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name = 'notificacoes' AND column_name = 'cliente_id') THEN
    ALTER TABLE notificacoes RENAME COLUMN cliente_id TO usuario_id;
  END IF;
END $$;

-- ─── 7. usuarios: remove colunas de negócio (dados pertencem ao Cliente) ────
-- PRÉ-REQUISITO: backfill usuarios→clientes já aplicado
-- (2026-06-10_dados-negocio-conta.sql). Esta etapa é IRREVERSÍVEL.
ALTER TABLE usuarios DROP COLUMN IF EXISTS tipo_pessoa;
ALTER TABLE usuarios DROP COLUMN IF EXISTS cnpj;
ALTER TABLE usuarios DROP COLUMN IF EXISTS razao_social;
ALTER TABLE usuarios DROP COLUMN IF EXISTS cep;
ALTER TABLE usuarios DROP COLUMN IF EXISTS logradouro;
ALTER TABLE usuarios DROP COLUMN IF EXISTS numero;
ALTER TABLE usuarios DROP COLUMN IF EXISTS complemento;
ALTER TABLE usuarios DROP COLUMN IF EXISTS bairro;
ALTER TABLE usuarios DROP COLUMN IF EXISTS municipio;
ALTER TABLE usuarios DROP COLUMN IF EXISTS uf;
ALTER TABLE usuarios DROP COLUMN IF EXISTS inscricao_estadual;
ALTER TABLE usuarios DROP COLUMN IF EXISTS inscricao_municipal;

-- ─── 8. Menu: corrige colisão de ids ────────────────────────────────────────
-- O script anterior gravou "Usuários" no id ...0020, que pertence à rotina
-- "Perfis" (seed.js). Restaura Perfis e move Usuários para ...0023.
UPDATE menu_rotinas
SET nome = 'Perfis', short_label = 'Perfis', icone = 'an an-identification-badge',
    rota = '/portal/perfis', ordem = 4
WHERE id = 'c1000000-0000-0000-0000-000000000020'
  AND rota = '/portal/usuarios-admin';

INSERT INTO menu_rotinas (id, modulo_id, nome, short_label, icone, rota, tipo, ordem, ativo, recurso) VALUES
  ('c1000000-0000-0000-0000-000000000023','b1000000-0000-0000-0000-000000000004','Usuários','Usuários','an an-users','/portal/usuarios-admin','link',7,TRUE,NULL)
ON CONFLICT (id) DO UPDATE
  SET modulo_id = EXCLUDED.modulo_id, nome = EXCLUDED.nome, short_label = EXCLUDED.short_label,
      icone = EXCLUDED.icone, rota = EXCLUDED.rota, tipo = EXCLUDED.tipo,
      ordem = EXCLUDED.ordem, recurso = EXCLUDED.recurso;

INSERT INTO perfil_rotinas (perfil_id, rotina_id) VALUES
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000023')
ON CONFLICT DO NOTHING;

COMMIT;

-- ============================================================================
-- Conferências (opcionais):
-- ============================================================================
-- Tabelas renomeadas:
--   SELECT table_name FROM information_schema.tables
--    WHERE table_name IN ('clientes','cliente_cnaes','contas','conta_cnaes_secundarios');
-- Colunas de assinaturas (esperado: usuario_id e cliente_id):
--   SELECT column_name FROM information_schema.columns WHERE table_name='assinaturas'
--    AND column_name IN ('usuario_id','cliente_id','conta_id');
-- usuarios sem colunas de negócio (esperado: 0 linhas):
--   SELECT column_name FROM information_schema.columns WHERE table_name='usuarios'
--    AND column_name IN ('cnpj','razao_social','cep','tipo_pessoa');
-- Menu (esperado: Perfis em /portal/perfis e Usuários em /portal/usuarios-admin):
--   SELECT id, nome, rota FROM menu_rotinas
--    WHERE id IN ('c1000000-0000-0000-0000-000000000020','c1000000-0000-0000-0000-000000000023');
