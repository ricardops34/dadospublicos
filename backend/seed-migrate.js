#!/usr/bin/env node
// Uso: node seed-migrate.js
//
// Migração incremental — roda sobre banco com dados existentes:
//   1. Backfill de Contas (modelo tenant) para clientes já cadastrados
//   2. Seed do menu dinâmico (perfis, módulos, rotinas, associações)
//
// NÃO recria admin, planos nem sincroniza IBGE.
// Seguro rodar múltiplas vezes (idempotente).

'use strict';

const { NestFactory } = require('@nestjs/core');
const { AppModule }   = require('./dist/app.module');

async function main() {
  console.log('\n[migrate] Iniciando contexto NestJS...');
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn'] });

  const { getDataSourceToken } = require('@nestjs/typeorm');
  const ds = app.get(getDataSourceToken('buscadados'));

  // ── 1. Backfill tenant ────────────────────────────────────────────────────
  console.log('[migrate] Criando Contas para clientes sem conta vinculada...');

  await ds.query(`
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
      AND id NOT IN (SELECT proprietario_id FROM contas)
  `);

  await ds.query(`
    UPDATE usuarios u
    SET conta_id = c.id
    FROM contas c
    WHERE c.proprietario_id = u.id
      AND u.conta_id IS NULL
  `);

  await ds.query(`
    UPDATE assinaturas a
    SET conta_id = u.conta_id
    FROM usuarios u
    WHERE a.cliente_id = u.id
      AND u.conta_id IS NOT NULL
      AND a.conta_id IS NULL
  `);

  const [[{ total_contas }]]    = [await ds.query(`SELECT count(*)::int AS total_contas FROM contas`)];
  const [[{ sem_conta }]]       = [await ds.query(`SELECT count(*)::int AS sem_conta FROM usuarios WHERE perfil='cliente' AND conta_id IS NULL`)];
  console.log(`[migrate] Contas: ${total_contas} | Clientes sem conta: ${sem_conta} (deve ser 0)`);

  // ── 2. Menu dinâmico ──────────────────────────────────────────────────────
  console.log('[migrate] Semeando perfis, módulos, rotinas e associações...');

  // Perfis
  const perfis = [
    { id: 'a1000000-0000-0000-0000-000000000001', codigo: 'admin',             nome: 'Administrador' },
    { id: 'a1000000-0000-0000-0000-000000000002', codigo: 'cliente',           nome: 'Cliente' },
    { id: 'a1000000-0000-0000-0000-000000000003', codigo: 'cliente_onboarding', nome: 'Cliente (Onboarding)' },
  ];
  for (const p of perfis) {
    await ds.query(`
      INSERT INTO perfis (id, codigo, nome, ativo)
      VALUES ($1, $2, $3, true)
      ON CONFLICT (codigo) DO UPDATE SET nome = EXCLUDED.nome
    `, [p.id, p.codigo, p.nome]);
  }

  // Módulos (grupos de menu — usados pelo perfil admin)
  const modulos = [
    { id: 'b1000000-0000-0000-0000-000000000001', nome: 'Dashboards',    shortLabel: 'Dashboard',  icone: 'an an-gauge',           ordem: 1 },
    { id: 'b1000000-0000-0000-0000-000000000002', nome: 'Comercial',     shortLabel: 'Comercial',  icone: 'an an-handshake',       ordem: 2 },
    { id: 'b1000000-0000-0000-0000-000000000003', nome: 'Financeiro',    shortLabel: 'Financeiro', icone: 'an an-currency-dollar', ordem: 3 },
    { id: 'b1000000-0000-0000-0000-000000000004', nome: 'Configurações', shortLabel: 'Config',     icone: 'an an-gear',            ordem: 4 },
    { id: 'b1000000-0000-0000-0000-000000000005', nome: 'Minha Conta',   shortLabel: 'Minha Cta',  icone: 'an an-user-circle',     ordem: 5 },
  ];
  for (const m of modulos) {
    await ds.query(`
      INSERT INTO menu_modulos (id, nome, short_label, icone, ordem, ativo)
      VALUES ($1, $2, $3, $4, $5, true)
      ON CONFLICT (id) DO UPDATE SET
        nome = EXCLUDED.nome, short_label = EXCLUDED.short_label,
        icone = EXCLUDED.icone, ordem = EXCLUDED.ordem
    `, [m.id, m.nome, m.shortLabel, m.icone, m.ordem]);
  }

  // Rotinas admin (com módulo)
  const rotinasAdmin = [
    { id: 'c1000000-0000-0000-0000-000000000001', moduloId: 'b1000000-0000-0000-0000-000000000001', nome: 'Visão Geral',      shortLabel: 'Visão',     icone: 'an an-chart-line',        rota: '/portal/dashboard',        tipo: 'link',   ordem: 1 },
    { id: 'c1000000-0000-0000-0000-000000000002', moduloId: 'b1000000-0000-0000-0000-000000000001', nome: 'Analytics LP',     shortLabel: 'Analytics',  icone: 'an an-chart-bar',         rota: '/portal/analytics',        tipo: 'link',   ordem: 2 },
    { id: 'c1000000-0000-0000-0000-000000000003', moduloId: 'b1000000-0000-0000-0000-000000000001', nome: 'Painel 360 Admin', shortLabel: '360 Admin',  icone: 'an an-map-trifold',       rota: '/portal/painel-360-admin', tipo: 'link',   ordem: 3 },
    { id: 'c1000000-0000-0000-0000-000000000004', moduloId: 'b1000000-0000-0000-0000-000000000002', nome: 'Clientes',         shortLabel: 'Clientes',   icone: 'an an-users',             rota: '/portal/clientes',         tipo: 'link',   ordem: 1 },
    { id: 'c1000000-0000-0000-0000-000000000005', moduloId: 'b1000000-0000-0000-0000-000000000002', nome: 'Planos',           shortLabel: 'Planos',     icone: 'an an-tag',               rota: '/portal/planos',           tipo: 'link',   ordem: 2 },
    { id: 'c1000000-0000-0000-0000-000000000006', moduloId: 'b1000000-0000-0000-0000-000000000002', nome: 'Recursos',         shortLabel: 'Recursos',   icone: 'an an-puzzle-piece',      rota: '/portal/recursos',         tipo: 'link',   ordem: 3 },
    { id: 'c1000000-0000-0000-0000-000000000007', moduloId: 'b1000000-0000-0000-0000-000000000002', nome: 'Recurso × Planos', shortLabel: 'Rec×Plan',   icone: 'an an-arrows-left-right', rota: '/portal/recurso-planos',   tipo: 'link',   ordem: 4 },
    { id: 'c1000000-0000-0000-0000-000000000008', moduloId: 'b1000000-0000-0000-0000-000000000003', nome: 'Assinaturas',      shortLabel: 'Assinat.',   icone: 'an an-calendar-check',    rota: '/portal/assinaturas',      tipo: 'link',   ordem: 1 },
    { id: 'c1000000-0000-0000-0000-000000000009', moduloId: 'b1000000-0000-0000-0000-000000000003', nome: 'Faturas Admin',    shortLabel: 'Faturas',    icone: 'an an-receipt',           rota: '/portal/faturas',          tipo: 'link',   ordem: 2 },
    { id: 'c1000000-0000-0000-0000-000000000010', moduloId: 'b1000000-0000-0000-0000-000000000003', nome: 'Consumo Admin',    shortLabel: 'Consumo',    icone: 'an an-chart-bar',         rota: '/portal/consumo-admin',    tipo: 'link',   ordem: 3 },
    { id: 'c1000000-0000-0000-0000-000000000011', moduloId: 'b1000000-0000-0000-0000-000000000004', nome: 'Parâmetros',       shortLabel: 'Params',     icone: 'an an-sliders',           rota: '/portal/parametros',       tipo: 'link',   ordem: 1 },
    { id: 'c1000000-0000-0000-0000-000000000012', moduloId: 'b1000000-0000-0000-0000-000000000004', nome: 'Config. E-mail',   shortLabel: 'E-mail',     icone: 'an an-envelope',          rota: '/portal/config-email',     tipo: 'link',   ordem: 2 },
    { id: 'c1000000-0000-0000-0000-000000000013', moduloId: 'b1000000-0000-0000-0000-000000000004', nome: 'ETL / Sistema',    shortLabel: 'ETL',        icone: 'an an-database',          rota: '/portal/etl',              tipo: 'link',   ordem: 3 },
    { id: 'c1000000-0000-0000-0000-000000000020', moduloId: 'b1000000-0000-0000-0000-000000000004', nome: 'Perfis',           shortLabel: 'Perfis',     icone: 'an an-identification-badge', rota: '/portal/perfis',        tipo: 'link',   ordem: 4 },
    { id: 'c1000000-0000-0000-0000-000000000021', moduloId: 'b1000000-0000-0000-0000-000000000004', nome: 'Módulos',          shortLabel: 'Módulos',    icone: 'an an-squares-four',      rota: '/portal/modulos',          tipo: 'link',   ordem: 5 },
    { id: 'c1000000-0000-0000-0000-000000000022', moduloId: 'b1000000-0000-0000-0000-000000000004', nome: 'Manutenção Menu',  shortLabel: 'Menu',       icone: 'an an-list',              rota: '/portal/rotinas',          tipo: 'link',   ordem: 6 },
    { id: 'c1000000-0000-0000-0000-000000000014', moduloId: 'b1000000-0000-0000-0000-000000000005', nome: 'Dados pessoais',   shortLabel: 'Dados',      icone: 'an an-user',              rota: '/portal/minha-conta',      tipo: 'link',   ordem: 1 },
    { id: 'c1000000-0000-0000-0000-000000000015', moduloId: 'b1000000-0000-0000-0000-000000000005', nome: 'Meu Plano',        shortLabel: 'Plano',      icone: 'an an-tag',               rota: '/portal/meu-plano',        tipo: 'link',   ordem: 2 },
    { id: 'c1000000-0000-0000-0000-000000000016', moduloId: 'b1000000-0000-0000-0000-000000000005', nome: 'Meu Token API',    shortLabel: 'Token',      icone: 'an an-key',               rota: '/portal/meu-token',        tipo: 'link',   ordem: 3 },
    { id: 'c1000000-0000-0000-0000-000000000017', moduloId: 'b1000000-0000-0000-0000-000000000005', nome: 'Meu Consumo',      shortLabel: 'Consumo',    icone: 'an an-chart-bar',         rota: '/portal/consumo',          tipo: 'link',   ordem: 4 },
    { id: 'c1000000-0000-0000-0000-000000000018', moduloId: 'b1000000-0000-0000-0000-000000000005', nome: 'Minhas Faturas',   shortLabel: 'Faturas',    icone: 'an an-receipt',           rota: '/portal/minhas-faturas',   tipo: 'link',   ordem: 5 },
    { id: 'c1000000-0000-0000-0000-000000000019', moduloId: null,                                   nome: 'Sair',             shortLabel: 'Sair',       icone: 'an an-sign-out',          rota: '/sair',                    tipo: 'danger', ordem: 99 },
  ];

  // Rotinas cliente (sem módulo)
  const rotinasCliente = [
    { id: 'c2000000-0000-0000-0000-000000000001', moduloId: null, nome: 'Início',        shortLabel: 'Início',   icone: 'an an-house',         rota: '/portal/dashboard',      tipo: 'link',   ordem: 1,  recurso: null },
    { id: 'c2000000-0000-0000-0000-000000000002', moduloId: null, nome: 'Minha Conta',   shortLabel: 'Conta',    icone: 'an an-user-circle',   rota: '/portal/minha-conta',    tipo: 'link',   ordem: 2,  recurso: null },
    { id: 'c2000000-0000-0000-0000-000000000003', moduloId: null, nome: 'Meu Plano',     shortLabel: 'Plano',    icone: 'an an-tag',           rota: '/portal/meu-plano',      tipo: 'link',   ordem: 3,  recurso: null },
    { id: 'c2000000-0000-0000-0000-000000000004', moduloId: null, nome: 'Meu Token API', shortLabel: 'Token',    icone: 'an an-key',           rota: '/portal/meu-token',      tipo: 'link',   ordem: 4,  recurso: null },
    { id: 'c2000000-0000-0000-0000-000000000005', moduloId: null, nome: 'Consumo',       shortLabel: 'Consumo',  icone: 'an an-chart-bar',     rota: '/portal/consumo',        tipo: 'link',   ordem: 5,  recurso: null },
    { id: 'c2000000-0000-0000-0000-000000000006', moduloId: null, nome: 'Faturas',       shortLabel: 'Faturas',  icone: 'an an-receipt',       rota: '/portal/minhas-faturas', tipo: 'link',   ordem: 6,  recurso: null },
    { id: 'c2000000-0000-0000-0000-000000000007', moduloId: null, nome: 'Painel 360',    shortLabel: '360',      icone: 'an an-map-trifold',   rota: '/portal/painel-360',     tipo: 'link',   ordem: 7,  recurso: 'painel-360' },
    { id: 'c2000000-0000-0000-0000-000000000008', moduloId: null, nome: 'Sair',          shortLabel: 'Sair',     icone: 'an an-sign-out',      rota: '/sair',                  tipo: 'danger', ordem: 99, recurso: null },
  ];

  // Rotinas onboarding (sem módulo)
  const rotinasOnboarding = [
    { id: 'c3000000-0000-0000-0000-000000000001', moduloId: null, nome: 'Primeiro acesso', shortLabel: 'Onboarding', icone: 'an an-user-circle',    rota: '/portal/primeiro-acesso', tipo: 'link',   ordem: 1,  recurso: null },
    { id: 'c3000000-0000-0000-0000-000000000002', moduloId: null, nome: 'Minha Conta',     shortLabel: 'Conta',      icone: 'an an-shield-warning', rota: '/portal/minha-conta',     tipo: 'link',   ordem: 2,  recurso: null },
    { id: 'c3000000-0000-0000-0000-000000000003', moduloId: null, nome: 'Sair',            shortLabel: 'Sair',       icone: 'an an-sign-out',       rota: '/sair',                   tipo: 'danger', ordem: 99, recurso: null },
  ];

  const todasRotinas = [...rotinasAdmin, ...rotinasCliente, ...rotinasOnboarding];
  for (const r of todasRotinas) {
    await ds.query(`
      INSERT INTO menu_rotinas (id, modulo_id, nome, short_label, icone, rota, tipo, ordem, ativo, recurso)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, $9)
      ON CONFLICT (id) DO UPDATE SET
        modulo_id = EXCLUDED.modulo_id, nome = EXCLUDED.nome, short_label = EXCLUDED.short_label,
        icone = EXCLUDED.icone, rota = EXCLUDED.rota, tipo = EXCLUDED.tipo,
        ordem = EXCLUDED.ordem, recurso = EXCLUDED.recurso
    `, [r.id, r.moduloId ?? null, r.nome, r.shortLabel, r.icone, r.rota, r.tipo, r.ordem, r.recurso ?? null]);
  }

  // Associações perfil → rotinas
  const assocAdmin      = rotinasAdmin.map(r =>      ({ perfilId: 'a1000000-0000-0000-0000-000000000001', rotinaId: r.id }));
  const assocCliente    = rotinasCliente.map(r =>    ({ perfilId: 'a1000000-0000-0000-0000-000000000002', rotinaId: r.id }));
  const assocOnboarding = rotinasOnboarding.map(r => ({ perfilId: 'a1000000-0000-0000-0000-000000000003', rotinaId: r.id }));

  for (const a of [...assocAdmin, ...assocCliente, ...assocOnboarding]) {
    await ds.query(`
      INSERT INTO perfil_rotinas (perfil_id, rotina_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `, [a.perfilId, a.rotinaId]);
  }

  const [[{ total_menu }]] = [await ds.query(`SELECT count(*)::int AS total_menu FROM menu_rotinas`)];
  console.log(`[migrate] Menu OK — ${total_menu} rotina(s).`);

  // ── Resumo ────────────────────────────────────────────────────────────────
  console.log('\n[migrate] ✓ Migração concluída.\n');
  process.exit(0);
}

main().catch(err => {
  console.error('[migrate] ERRO:', err);
  process.exit(1);
});
