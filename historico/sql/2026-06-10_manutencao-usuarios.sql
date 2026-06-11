-- ============================================================================
-- Manutenção de usuários
--  * Perfil CLIENTE: nova aba "Usuários" no módulo Minha Conta (sem mudança de
--    menu — a tela é uma aba). O usuário principal é contas.proprietario_id.
--  * Perfil ADMIN: nova rotina "Usuários" no módulo Configurações.
-- Banco alvo: buscadados
--
-- Aplicar com:
--   docker compose exec -T postgres psql -U rfb_user -d buscadados < historico/sql/2026-06-10_manutencao-usuarios.sql
--
-- Obs.: não há mudança de schema (contas.proprietario_id já existe). Este
-- script apenas insere a rotina de menu do admin (mesmo conteúdo adicionado
-- ao historico/backend-scripts/seed-menu.sql para instalações novas).
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

-- Conferência (opcional):
-- SELECT r.nome, r.rota FROM menu_rotinas r WHERE r.id = 'c1000000-0000-0000-0000-000000000020';
