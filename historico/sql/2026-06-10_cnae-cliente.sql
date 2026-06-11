-- ============================================================================
-- CNAE no cadastro de cliente (pessoa jurídica)
-- Banco alvo: buscadados
--
-- Aplicar com:
--   docker compose exec -T postgres psql -U rfb_user -d buscadados < historico/sql/2026-06-10_cnae-cliente.sql
-- (Swarm/Portainer: docker exec -i <container_postgres> psql -U rfb_user -d buscadados < historico/sql/2026-06-10_cnae-cliente.sql)
--
-- Obs.: o backend roda TypeORM com synchronize=true, então em instalações novas
-- estas estruturas são criadas automaticamente. Este script serve para aplicar
-- no banco atual sem reiniciar a API.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- O catálogo de CNAEs (tabela "cnaes" do banco dados_rfb) já é populado pelo
-- ETL mensal da Receita Federal (Cnaes.zip) — nenhum seed adicional necessário.
