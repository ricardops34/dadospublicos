-- =============================================================
-- MIGRAÇÃO COMPLETA: Modelo Tenant (Conta separada do Usuário)
-- Banco: buscadados
-- Script autossuficiente — pode rodar antes ou depois do backend
-- Idempotente: seguro re-executar
--
-- Como aplicar na VPS:
--   psql -U rfb_user -d buscadados -f migrate-tenant.sql
-- =============================================================

SET search_path TO public;

BEGIN;

-- ─── 1. Criar extensão uuid se necessário ─────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── 2. Criar tabela contas ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS contas (
  id                  UUID         NOT NULL DEFAULT gen_random_uuid(),
  proprietario_id     UUID         NOT NULL,
  tipo_pessoa         VARCHAR(1)   NOT NULL DEFAULT 'J',
  cnpj                VARCHAR(14),
  razao_social        VARCHAR(200),
  telefone            VARCHAR(20),
  cep                 VARCHAR(10),
  logradouro          VARCHAR(200),
  numero              VARCHAR(50),
  complemento         VARCHAR(150),
  bairro              VARCHAR(150),
  municipio           VARCHAR(150),
  uf                  VARCHAR(2),
  inscricao_estadual  VARCHAR(50),
  inscricao_municipal VARCHAR(50),
  ativo               BOOLEAN      NOT NULL DEFAULT TRUE,
  onboarding_pendente BOOLEAN      NOT NULL DEFAULT TRUE,
  agendar_exclusao_em TIMESTAMP,
  criado_em           TIMESTAMP    NOT NULL DEFAULT NOW(),
  atualizado_em       TIMESTAMP    NOT NULL DEFAULT NOW(),
  CONSTRAINT pk_contas PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_contas_proprietario_id ON contas(proprietario_id);

-- ─── 3. Adicionar conta_id em usuarios ─────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuarios' AND column_name = 'conta_id'
  ) THEN
    ALTER TABLE usuarios ADD COLUMN conta_id UUID;
  END IF;
END $$;

-- FK apenas se ainda não existir
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'usuarios'
      AND constraint_name = 'fk_usuarios_conta_id'
  ) THEN
    ALTER TABLE usuarios
      ADD CONSTRAINT fk_usuarios_conta_id
      FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_usuarios_conta_id ON usuarios(conta_id);

-- ─── 4. Adicionar conta_id em assinaturas ──────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'assinaturas' AND column_name = 'conta_id'
  ) THEN
    ALTER TABLE assinaturas ADD COLUMN conta_id UUID;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'assinaturas'
      AND constraint_name = 'fk_assinaturas_conta_id'
  ) THEN
    ALTER TABLE assinaturas
      ADD CONSTRAINT fk_assinaturas_conta_id
      FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_assinaturas_conta_id ON assinaturas(conta_id);

-- ─── 5. Backfill: criar Conta para cada cliente sem conta vinculada ────────

INSERT INTO contas (
  proprietario_id, tipo_pessoa, cnpj, razao_social, telefone,
  cep, logradouro, numero, complemento, bairro, municipio, uf,
  inscricao_estadual, inscricao_municipal,
  ativo, onboarding_pendente, agendar_exclusao_em,
  criado_em, atualizado_em
)
SELECT
  id,
  COALESCE(tipo_pessoa, 'J'),
  cnpj, razao_social, telefone,
  cep, logradouro, numero, complemento, bairro, municipio, uf,
  inscricao_estadual, inscricao_municipal,
  ativo, onboarding_pendente, agendar_exclusao_em,
  criado_em, atualizado_em
FROM usuarios
WHERE perfil = 'cliente'
  AND conta_id IS NULL
  AND id NOT IN (SELECT proprietario_id FROM contas);

-- ─── 6. Setar conta_id em usuarios ────────────────────────────────────

UPDATE usuarios u
SET conta_id = c.id
FROM contas c
WHERE c.proprietario_id = u.id
  AND u.conta_id IS NULL;

-- ─── 7. Propagar conta_id para assinaturas ────────────────────────────────

UPDATE assinaturas a
SET conta_id = u.conta_id
FROM usuarios u
WHERE a.cliente_id = u.id
  AND u.conta_id IS NOT NULL
  AND a.conta_id IS NULL;

COMMIT;

-- =============================================================
-- VERIFICAÇÃO FINAL:
-- =============================================================
SELECT
  (SELECT COUNT(*) FROM contas)                                              AS total_contas,
  (SELECT COUNT(*) FROM usuarios WHERE perfil='cliente')                 AS total_clientes,
  (SELECT COUNT(*) FROM usuarios WHERE perfil='cliente' AND conta_id IS NULL) AS clientes_sem_conta,
  (SELECT COUNT(*) FROM assinaturas WHERE conta_id IS NULL)                  AS assinaturas_sem_conta;
-- clientes_sem_conta deve ser 0
