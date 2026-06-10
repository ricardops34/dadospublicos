-- =============================================================================
-- seed-menu.sql — Menu dinâmico: tabelas + dados iniciais
-- Idempotente: usa ON CONFLICT DO NOTHING / DO UPDATE
-- Banco alvo: buscadados
-- =============================================================================

-- ── Tabelas ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS perfis (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo     VARCHAR(20)  NOT NULL UNIQUE,
  nome       VARCHAR(100) NOT NULL,
  descricao  TEXT,
  ativo      BOOLEAN      NOT NULL DEFAULT TRUE,
  criado_em  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_modulos (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        VARCHAR(100) NOT NULL,
  short_label VARCHAR(30),
  icone       VARCHAR(60),
  ordem       INTEGER     NOT NULL DEFAULT 0,
  ativo       BOOLEAN     NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS menu_rotinas (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  modulo_id   UUID         REFERENCES menu_modulos(id) ON DELETE SET NULL,
  nome        VARCHAR(100) NOT NULL,
  short_label VARCHAR(30),
  icone       VARCHAR(60),
  rota        VARCHAR(255),
  tipo        VARCHAR(20)  NOT NULL DEFAULT 'link',
  ordem       INTEGER      NOT NULL DEFAULT 0,
  ativo       BOOLEAN      NOT NULL DEFAULT TRUE,
  recurso     VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS perfil_rotinas (
  perfil_id  UUID NOT NULL REFERENCES perfis(id)      ON DELETE CASCADE,
  rotina_id  UUID NOT NULL REFERENCES menu_rotinas(id) ON DELETE CASCADE,
  PRIMARY KEY (perfil_id, rotina_id)
);

-- ── Índices ───────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_menu_rotinas_modulo_id   ON menu_rotinas  (modulo_id);
CREATE INDEX IF NOT EXISTS idx_perfil_rotinas_perfil_id ON perfil_rotinas(perfil_id);
CREATE INDEX IF NOT EXISTS idx_perfil_rotinas_rotina_id ON perfil_rotinas(rotina_id);

-- =============================================================================
-- Perfis
-- =============================================================================

INSERT INTO perfis (id, codigo, nome, ativo) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'admin',             'Administrador',          TRUE),
  ('a1000000-0000-0000-0000-000000000002', 'cliente',           'Cliente',                TRUE),
  ('a1000000-0000-0000-0000-000000000003', 'cliente_onboarding','Cliente (Onboarding)',    TRUE)
ON CONFLICT (codigo) DO UPDATE
  SET nome = EXCLUDED.nome;

-- =============================================================================
-- Módulos do menu admin
-- =============================================================================

INSERT INTO menu_modulos (id, nome, short_label, icone, ordem, ativo) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Dashboards',    'Dashboard',  'an an-gauge',           1, TRUE),
  ('b1000000-0000-0000-0000-000000000002', 'Comercial',     'Comercial',  'an an-handshake',       2, TRUE),
  ('b1000000-0000-0000-0000-000000000003', 'Financeiro',    'Financeiro', 'an an-currency-dollar', 3, TRUE),
  ('b1000000-0000-0000-0000-000000000004', 'Configurações', 'Config',     'an an-gear',            4, TRUE),
  ('b1000000-0000-0000-0000-000000000005', 'Minha Conta',   'Minha Cta',  'an an-user-circle',     5, TRUE)
ON CONFLICT (id) DO UPDATE
  SET nome = EXCLUDED.nome, short_label = EXCLUDED.short_label,
      icone = EXCLUDED.icone, ordem = EXCLUDED.ordem;

-- =============================================================================
-- Rotinas — perfil Admin (com módulo)
-- =============================================================================

INSERT INTO menu_rotinas (id, modulo_id, nome, short_label, icone, rota, tipo, ordem, ativo, recurso) VALUES
  -- Dashboards
  ('c1000000-0000-0000-0000-000000000001','b1000000-0000-0000-0000-000000000001','Visão Geral',      'Visão',    'an an-chart-line',        '/portal/dashboard',        'link',  1, TRUE, NULL),
  ('c1000000-0000-0000-0000-000000000002','b1000000-0000-0000-0000-000000000001','Analytics LP',     'Analytics','an an-chart-bar',          '/portal/analytics',        'link',  2, TRUE, NULL),
  ('c1000000-0000-0000-0000-000000000003','b1000000-0000-0000-0000-000000000001','Painel 360 Admin', '360 Admin','an an-map-trifold',        '/portal/painel-360-admin', 'link',  3, TRUE, NULL),
  -- Comercial
  ('c1000000-0000-0000-0000-000000000004','b1000000-0000-0000-0000-000000000002','Clientes',         'Clientes', 'an an-users',             '/portal/clientes',         'link',  1, TRUE, NULL),
  ('c1000000-0000-0000-0000-000000000005','b1000000-0000-0000-0000-000000000002','Planos',           'Planos',   'an an-tag',               '/portal/planos',           'link',  2, TRUE, NULL),
  ('c1000000-0000-0000-0000-000000000006','b1000000-0000-0000-0000-000000000002','Recursos',         'Recursos', 'an an-puzzle-piece',      '/portal/recursos',         'link',  3, TRUE, NULL),
  ('c1000000-0000-0000-0000-000000000007','b1000000-0000-0000-0000-000000000002','Recurso × Planos', 'Rec×Plan', 'an an-arrows-left-right', '/portal/recurso-planos',   'link',  4, TRUE, NULL),
  -- Financeiro
  ('c1000000-0000-0000-0000-000000000008','b1000000-0000-0000-0000-000000000003','Assinaturas',      'Assinat.', 'an an-calendar-check',    '/portal/assinaturas',      'link',  1, TRUE, NULL),
  ('c1000000-0000-0000-0000-000000000009','b1000000-0000-0000-0000-000000000003','Faturas Admin',    'Faturas',  'an an-receipt',           '/portal/faturas',          'link',  2, TRUE, NULL),
  ('c1000000-0000-0000-0000-000000000010','b1000000-0000-0000-0000-000000000003','Consumo Admin',    'Consumo',  'an an-chart-bar',         '/portal/consumo-admin',    'link',  3, TRUE, NULL),
  -- Configurações
  ('c1000000-0000-0000-0000-000000000011','b1000000-0000-0000-0000-000000000004','Parâmetros',       'Params',   'an an-sliders',           '/portal/parametros',       'link',  1, TRUE, NULL),
  ('c1000000-0000-0000-0000-000000000012','b1000000-0000-0000-0000-000000000004','Config. E-mail',   'E-mail',   'an an-envelope',          '/portal/config-email',     'link',  2, TRUE, NULL),
  ('c1000000-0000-0000-0000-000000000013','b1000000-0000-0000-0000-000000000004','ETL / Sistema',    'ETL',      'an an-database',          '/portal/etl',              'link',  3, TRUE, NULL),
  ('c1000000-0000-0000-0000-000000000023','b1000000-0000-0000-0000-000000000004','Usuários',         'Usuários', 'an an-users',             '/portal/usuarios-admin',   'link',  7, TRUE, NULL),
  -- Minha Conta (admin)
  ('c1000000-0000-0000-0000-000000000014','b1000000-0000-0000-0000-000000000005','Dados pessoais',   'Dados',    'an an-user',              '/portal/minha-conta',      'link',  1, TRUE, NULL),
  ('c1000000-0000-0000-0000-000000000015','b1000000-0000-0000-0000-000000000005','Meu Plano',        'Plano',    'an an-tag',               '/portal/meu-plano',        'link',  2, TRUE, NULL),
  ('c1000000-0000-0000-0000-000000000016','b1000000-0000-0000-0000-000000000005','Meu Token API',    'Token',    'an an-key',               '/portal/meu-token',        'link',  3, TRUE, NULL),
  ('c1000000-0000-0000-0000-000000000017','b1000000-0000-0000-0000-000000000005','Meu Consumo',      'Consumo',  'an an-chart-bar',         '/portal/consumo',          'link',  4, TRUE, NULL),
  ('c1000000-0000-0000-0000-000000000018','b1000000-0000-0000-0000-000000000005','Minhas Faturas',   'Faturas',  'an an-receipt',           '/portal/minhas-faturas',   'link',  5, TRUE, NULL),
  -- Sair admin (standalone)
  ('c1000000-0000-0000-0000-000000000019', NULL,                                'Sair',             'Sair',     'an an-sign-out',           '/sair',                   'danger',99, TRUE, NULL)
ON CONFLICT (id) DO UPDATE
  SET modulo_id = EXCLUDED.modulo_id, nome = EXCLUDED.nome, short_label = EXCLUDED.short_label,
      icone = EXCLUDED.icone, rota = EXCLUDED.rota, tipo = EXCLUDED.tipo,
      ordem = EXCLUDED.ordem, recurso = EXCLUDED.recurso;

-- =============================================================================
-- Rotinas — perfil Cliente (standalone, sem módulo)
-- =============================================================================

INSERT INTO menu_rotinas (id, modulo_id, nome, short_label, icone, rota, tipo, ordem, ativo, recurso) VALUES
  ('c2000000-0000-0000-0000-000000000001', NULL, 'Início',        'Início',   'an an-house',        '/portal/dashboard',      'link',   1, TRUE, NULL),
  ('c2000000-0000-0000-0000-000000000002', NULL, 'Minha Conta',   'Conta',    'an an-user-circle',  '/portal/minha-conta',    'link',   2, TRUE, NULL),
  ('c2000000-0000-0000-0000-000000000003', NULL, 'Meu Plano',     'Plano',    'an an-tag',          '/portal/meu-plano',      'link',   3, TRUE, NULL),
  ('c2000000-0000-0000-0000-000000000004', NULL, 'Meu Token API', 'Token',    'an an-key',          '/portal/meu-token',      'link',   4, TRUE, NULL),
  ('c2000000-0000-0000-0000-000000000005', NULL, 'Consumo',       'Consumo',  'an an-chart-bar',    '/portal/consumo',        'link',   5, TRUE, NULL),
  ('c2000000-0000-0000-0000-000000000006', NULL, 'Faturas',       'Faturas',  'an an-receipt',      '/portal/minhas-faturas', 'link',   6, TRUE, NULL),
  ('c2000000-0000-0000-0000-000000000007', NULL, 'Painel 360',    '360',      'an an-map-trifold',  '/portal/painel-360',     'link',   7, TRUE, 'painel-360'),
  ('c2000000-0000-0000-0000-000000000008', NULL, 'Sair',          'Sair',     'an an-sign-out',     '/sair',                  'danger', 99,TRUE, NULL)
ON CONFLICT (id) DO UPDATE
  SET nome = EXCLUDED.nome, short_label = EXCLUDED.short_label, icone = EXCLUDED.icone,
      rota = EXCLUDED.rota, tipo = EXCLUDED.tipo, ordem = EXCLUDED.ordem, recurso = EXCLUDED.recurso;

-- =============================================================================
-- Rotinas — perfil Onboarding (standalone, sem módulo)
-- =============================================================================

INSERT INTO menu_rotinas (id, modulo_id, nome, short_label, icone, rota, tipo, ordem, ativo, recurso) VALUES
  ('c3000000-0000-0000-0000-000000000001', NULL, 'Primeiro acesso', 'Onboarding', 'an an-user-circle',    '/portal/primeiro-acesso', 'link',   1, TRUE, NULL),
  ('c3000000-0000-0000-0000-000000000002', NULL, 'Minha Conta',     'Conta',      'an an-shield-warning', '/portal/minha-conta',     'link',   2, TRUE, NULL),
  ('c3000000-0000-0000-0000-000000000003', NULL, 'Sair',            'Sair',       'an an-sign-out',       '/sair',                   'danger', 99,TRUE, NULL)
ON CONFLICT (id) DO UPDATE
  SET nome = EXCLUDED.nome, short_label = EXCLUDED.short_label, icone = EXCLUDED.icone,
      rota = EXCLUDED.rota, tipo = EXCLUDED.tipo, ordem = EXCLUDED.ordem;

-- =============================================================================
-- Associações PerfilRotina
-- =============================================================================

-- Admin
INSERT INTO perfil_rotinas (perfil_id, rotina_id) VALUES
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000001'),
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000002'),
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000003'),
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000004'),
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000005'),
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000006'),
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000007'),
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000008'),
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000009'),
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000010'),
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000011'),
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000012'),
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000013'),
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000014'),
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000015'),
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000016'),
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000017'),
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000018'),
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000019'),
  ('a1000000-0000-0000-0000-000000000001','c1000000-0000-0000-0000-000000000023')
ON CONFLICT DO NOTHING;

-- Cliente
INSERT INTO perfil_rotinas (perfil_id, rotina_id) VALUES
  ('a1000000-0000-0000-0000-000000000002','c2000000-0000-0000-0000-000000000001'),
  ('a1000000-0000-0000-0000-000000000002','c2000000-0000-0000-0000-000000000002'),
  ('a1000000-0000-0000-0000-000000000002','c2000000-0000-0000-0000-000000000003'),
  ('a1000000-0000-0000-0000-000000000002','c2000000-0000-0000-0000-000000000004'),
  ('a1000000-0000-0000-0000-000000000002','c2000000-0000-0000-0000-000000000005'),
  ('a1000000-0000-0000-0000-000000000002','c2000000-0000-0000-0000-000000000006'),
  ('a1000000-0000-0000-0000-000000000002','c2000000-0000-0000-0000-000000000007'),
  ('a1000000-0000-0000-0000-000000000002','c2000000-0000-0000-0000-000000000008')
ON CONFLICT DO NOTHING;

-- Onboarding
INSERT INTO perfil_rotinas (perfil_id, rotina_id) VALUES
  ('a1000000-0000-0000-0000-000000000003','c3000000-0000-0000-0000-000000000001'),
  ('a1000000-0000-0000-0000-000000000003','c3000000-0000-0000-0000-000000000002'),
  ('a1000000-0000-0000-0000-000000000003','c3000000-0000-0000-0000-000000000003')
ON CONFLICT DO NOTHING;
