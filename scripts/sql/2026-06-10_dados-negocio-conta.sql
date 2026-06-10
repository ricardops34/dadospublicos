-- ============================================================================
-- Dados de negócio do CLIENTE saem do usuário e passam a viver na CONTA
-- Regra: docs/regra-cliente-usuario.md — "NUNCA armazenar informações de
-- negócio do Cliente dentro da entidade Usuário".
--
-- A partir desta versão o backend grava CNPJ/razão social/endereço/IE/IM
-- somente em `contas` (admin e onboarding) e lê da conta com fallback legado.
-- Este script faz o BACKFILL do banco atual.
--
-- Banco alvo: buscadados
-- Idempotente. Executar APÓS o 2026-06-10_ajustes-completos.sql.
--
-- Aplicar com:
--   docker compose exec -T postgres psql -U rfb_user -d buscadados < scripts/sql/2026-06-10_dados-negocio-conta.sql
-- ============================================================================

BEGIN;

-- 1. Clientes legados sem conta: cria a conta a partir dos dados do usuário
WITH novas AS (
  INSERT INTO contas (proprietario_id, tipo_pessoa, cnpj, razao_social, telefone, cep, logradouro,
                      numero, complemento, bairro, municipio, uf, inscricao_estadual,
                      inscricao_municipal, ativo, onboarding_pendente)
  SELECT u.id, COALESCE(u.tipo_pessoa, 'J'), u.cnpj, u.razao_social, u.telefone, u.cep, u.logradouro,
         u.numero, u.complemento, u.bairro, u.municipio, u.uf, u.inscricao_estadual,
         u.inscricao_municipal, u.ativo, u.onboarding_pendente
  FROM usuarios u
  WHERE u.perfil = 'cliente' AND u.conta_id IS NULL
  RETURNING id, proprietario_id
)
UPDATE usuarios u
SET conta_id = n.id
FROM novas n
WHERE u.id = n.proprietario_id;

-- 2. Backfill: dados de negócio do usuário principal preenchem a conta.
--    Campos já preenchidos na conta são preservados (conta prevalece);
--    tipo_pessoa segue o legado do usuário (era onde o admin editava).
UPDATE contas c SET
  tipo_pessoa         = COALESCE(u.tipo_pessoa, c.tipo_pessoa),
  cnpj                = COALESCE(c.cnpj,                u.cnpj),
  razao_social        = COALESCE(c.razao_social,        u.razao_social),
  telefone            = COALESCE(c.telefone,            u.telefone),
  cep                 = COALESCE(c.cep,                 u.cep),
  logradouro          = COALESCE(c.logradouro,          u.logradouro),
  numero              = COALESCE(c.numero,              u.numero),
  complemento         = COALESCE(c.complemento,         u.complemento),
  bairro              = COALESCE(c.bairro,              u.bairro),
  municipio           = COALESCE(c.municipio,           u.municipio),
  uf                  = COALESCE(c.uf,                  u.uf),
  inscricao_estadual  = COALESCE(c.inscricao_estadual,  u.inscricao_estadual),
  inscricao_municipal = COALESCE(c.inscricao_municipal, u.inscricao_municipal)
FROM usuarios u
WHERE u.id = c.proprietario_id;

-- 3. Reaplica os backfills de conta em assinaturas e tokens (idempotentes) —
--    necessário para as contas recém-criadas no passo 1
UPDATE assinaturas a
SET conta_id = u.conta_id
FROM usuarios u
WHERE u.id = a.cliente_id
  AND a.conta_id IS NULL
  AND u.conta_id IS NOT NULL;

UPDATE tokens t
SET conta_id = u.conta_id
FROM assinaturas a
JOIN usuarios u ON u.id = a.cliente_id
WHERE a.token_id = t.id
  AND t.conta_id IS NULL
  AND u.conta_id IS NOT NULL;

-- Mantém a regra de 1 token ativo por conta (mais recente prevalece)
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

COMMIT;

-- ============================================================================
-- Conferências (opcionais):
-- ============================================================================
-- Clientes ainda sem conta (esperado: 0 linhas):
--   SELECT id, nome, email FROM usuarios WHERE perfil = 'cliente' AND conta_id IS NULL;
-- Contas PJ sem CNPJ que o usuário legado tinha (esperado: 0 linhas):
--   SELECT c.id FROM contas c JOIN usuarios u ON u.id = c.proprietario_id
--    WHERE c.cnpj IS NULL AND u.cnpj IS NOT NULL;
