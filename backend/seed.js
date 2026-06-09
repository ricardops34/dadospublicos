#!/usr/bin/env node
// Uso: node seed.js
// Variaveis opcionais: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, ADMIN_PLAN_SLUG, FORCE_IBGE_SYNC

'use strict';

const ADMIN_EMAIL     = process.env.ADMIN_EMAIL      || 'admin@bjsoft.com.br';
const ADMIN_PASSWORD  = process.env.ADMIN_PASSWORD   || 'admin1234';
const ADMIN_NAME      = process.env.ADMIN_NAME       || 'Administrador';
const ADMIN_PLAN_SLUG = process.env.ADMIN_PLAN_SLUG  || 'premium';
const ADMIN_PLAN_EXPIRY = process.env.ADMIN_PLAN_EXPIRY || '2999-12-31';
const FORCE_IBGE_SYNC = process.env.FORCE_IBGE_SYNC === '1';

const { NestFactory } = require('@nestjs/core');
const { AppModule }   = require('./dist/app.module');

async function main() {
  console.log('\n[seed] Iniciando contexto NestJS...');
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn'] });

  // ── Planos e Recursos ────────────────────────────────────────────────────
  console.log('[seed] Semeando planos e recursos...');
  const { PlanosService } = require('./dist/modules/planos/planos.service');
  const planosService = app.get(PlanosService);
  const planos = await planosService.seed();
  console.log(`[seed] Planos: ${planos.length} registros.`);

  // ── Admin ────────────────────────────────────────────────────────────────
  console.log(`[seed] Criando/atualizando admin: ${ADMIN_EMAIL}`);
  const bcrypt = require('bcrypt');
  const senhaHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const { getDataSourceToken } = require('@nestjs/typeorm');
  const ds       = app.get(getDataSourceToken('buscadados'));
  const dsViacep = app.get(getDataSourceToken('viacep'));
  await ds.query(`
    INSERT INTO clientes_api (nome, email, senha_hash, perfil, ativo, email_verificado, onboarding_pendente, tipo_pessoa)
    VALUES ($1, $2, $3, 'admin', true, true, false, 'J')
    ON CONFLICT (email) DO UPDATE
    SET nome = EXCLUDED.nome, senha_hash = EXCLUDED.senha_hash,
        perfil = 'admin', ativo = true, email_verificado = true, onboarding_pendente = false
  `, [ADMIN_NAME, ADMIN_EMAIL, senhaHash]);
  console.log('[seed] Admin OK.');

  // ── Plano do Admin ───────────────────────────────────────────────────────
  console.log(`[seed] Atribuindo plano ${ADMIN_PLAN_SLUG} ao admin...`);
  const { AssinaturasService } = require('./dist/modules/assinaturas/assinaturas.service');
  const assinaturasService = app.get(AssinaturasService);

  const [adminRow] = await ds.query(`SELECT id FROM clientes_api WHERE email = $1 LIMIT 1`, [ADMIN_EMAIL]);
  if (!adminRow) throw new Error('Admin não encontrado após insert.');

  const [activePlan] = await ds.query(`
    SELECT p.slug FROM assinaturas a JOIN planos p ON p.id = a.plano_id
    WHERE a.cliente_id = $1 AND a.status = 'ativa' ORDER BY a.criado_em DESC LIMIT 1
  `, [adminRow.id]);

  if (!activePlan || activePlan.slug !== ADMIN_PLAN_SLUG) {
    await assinaturasService.assinar(adminRow.id, ADMIN_PLAN_SLUG);
    console.log('[seed] Assinatura criada.');
  } else {
    console.log('[seed] Assinatura já existente, atualizando validade...');
  }

  await ds.query(`
    UPDATE assinaturas SET data_fim = $1, proximo_vencimento = $1, status = 'ativa',
      cancelado_em = NULL, agendar_cancelamento_em = NULL, motivo_cancelamento = NULL
    WHERE cliente_id = $2 AND status = 'ativa'
  `, [ADMIN_PLAN_EXPIRY, adminRow.id]);

  // ── UFs e Municípios IBGE ────────────────────────────────────────────────
  const { GeocodeService } = require('./dist/modules/geocode/geocode.service');
  const geocodeService = app.get(GeocodeService);

  const [[{ count: ufCount }]] = [await dsViacep.query(`SELECT count(*)::int AS count FROM uf_ibge`)];

  if (FORCE_IBGE_SYNC || ufCount === 0) {
    console.log('[seed] Sincronizando UFs e municípios do IBGE...');
    const result = await geocodeService.syncIbge();
    console.log('[seed] IBGE:', JSON.stringify(result));
  } else {
    console.log(`[seed] IBGE já carregado (${ufCount} UFs). Use FORCE_IBGE_SYNC=1 para forçar.`);
  }

  // ── Tenant: backfill de Contas para clientes existentes ─────────────────
  console.log('[seed] Migrando dados de tenant (contas)...');

  // Cria Conta para cada cliente que ainda não tem conta vinculada
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
    FROM clientes_api
    WHERE perfil = 'cliente'
      AND conta_id IS NULL
      AND id NOT IN (SELECT proprietario_id FROM contas)
  `);

  // Vincula conta_id em clientes_api
  await ds.query(`
    UPDATE clientes_api u
    SET conta_id = c.id
    FROM contas c
    WHERE c.proprietario_id = u.id
      AND u.conta_id IS NULL
  `);

  // Propaga conta_id para assinaturas
  await ds.query(`
    UPDATE assinaturas a
    SET conta_id = u.conta_id
    FROM clientes_api u
    WHERE a.cliente_id = u.id
      AND u.conta_id IS NOT NULL
      AND a.conta_id IS NULL
  `);

  const [[{ contas_count }]] = [await ds.query(`SELECT count(*)::int AS contas_count FROM contas`)];
  console.log(`[seed] Tenant OK — ${contas_count} conta(s).`);

  // ── Menu dinâmico: Perfis, Módulos, Rotinas ──────────────────────────────
  console.log('[seed] Semeando perfis, módulos, rotinas e associações do menu...');

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
  console.log('[seed] Perfis OK.');

  // Módulos do menu admin
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
      ON CONFLICT (id) DO UPDATE SET nome = EXCLUDED.nome, short_label = EXCLUDED.short_label,
        icone = EXCLUDED.icone, ordem = EXCLUDED.ordem
    `, [m.id, m.nome, m.shortLabel, m.icone, m.ordem]);
  }
  console.log('[seed] Módulos OK.');

  // Rotinas — admin (com módulo)
  const rotinasAdmin = [
    // Dashboards
    { id: 'c1000000-0000-0000-0000-000000000001', moduloId: 'b1000000-0000-0000-0000-000000000001', nome: 'Visão Geral',      shortLabel: 'Visão',    icone: 'an an-chart-line',        rota: '/portal/dashboard',       tipo: 'link', ordem: 1 },
    { id: 'c1000000-0000-0000-0000-000000000002', moduloId: 'b1000000-0000-0000-0000-000000000001', nome: 'Analytics LP',     shortLabel: 'Analytics', icone: 'an an-chart-bar',        rota: '/portal/analytics',       tipo: 'link', ordem: 2 },
    { id: 'c1000000-0000-0000-0000-000000000003', moduloId: 'b1000000-0000-0000-0000-000000000001', nome: 'Painel 360 Admin', shortLabel: '360 Admin', icone: 'an an-map-trifold',      rota: '/portal/painel-360-admin', tipo: 'link', ordem: 3 },
    // Comercial
    { id: 'c1000000-0000-0000-0000-000000000004', moduloId: 'b1000000-0000-0000-0000-000000000002', nome: 'Clientes',         shortLabel: 'Clientes', icone: 'an an-users',             rota: '/portal/clientes',        tipo: 'link', ordem: 1 },
    { id: 'c1000000-0000-0000-0000-000000000005', moduloId: 'b1000000-0000-0000-0000-000000000002', nome: 'Planos',           shortLabel: 'Planos',   icone: 'an an-tag',               rota: '/portal/planos',          tipo: 'link', ordem: 2 },
    { id: 'c1000000-0000-0000-0000-000000000006', moduloId: 'b1000000-0000-0000-0000-000000000002', nome: 'Recursos',         shortLabel: 'Recursos', icone: 'an an-puzzle-piece',      rota: '/portal/recursos',        tipo: 'link', ordem: 3 },
    { id: 'c1000000-0000-0000-0000-000000000007', moduloId: 'b1000000-0000-0000-0000-000000000002', nome: 'Recurso × Planos', shortLabel: 'Rec×Plan', icone: 'an an-arrows-left-right', rota: '/portal/recurso-planos',  tipo: 'link', ordem: 4 },
    // Financeiro
    { id: 'c1000000-0000-0000-0000-000000000008', moduloId: 'b1000000-0000-0000-0000-000000000003', nome: 'Assinaturas',      shortLabel: 'Assinat.', icone: 'an an-calendar-check',   rota: '/portal/assinaturas',     tipo: 'link', ordem: 1 },
    { id: 'c1000000-0000-0000-0000-000000000009', moduloId: 'b1000000-0000-0000-0000-000000000003', nome: 'Faturas Admin',    shortLabel: 'Faturas',  icone: 'an an-receipt',           rota: '/portal/faturas',         tipo: 'link', ordem: 2 },
    { id: 'c1000000-0000-0000-0000-000000000010', moduloId: 'b1000000-0000-0000-0000-000000000003', nome: 'Consumo Admin',    shortLabel: 'Consumo',  icone: 'an an-chart-bar',         rota: '/portal/consumo-admin',   tipo: 'link', ordem: 3 },
    // Configurações
    { id: 'c1000000-0000-0000-0000-000000000011', moduloId: 'b1000000-0000-0000-0000-000000000004', nome: 'Parâmetros',       shortLabel: 'Params',   icone: 'an an-sliders',           rota: '/portal/parametros',      tipo: 'link', ordem: 1 },
    { id: 'c1000000-0000-0000-0000-000000000012', moduloId: 'b1000000-0000-0000-0000-000000000004', nome: 'Config. E-mail',   shortLabel: 'E-mail',   icone: 'an an-envelope',          rota: '/portal/config-email',    tipo: 'link', ordem: 2 },
    { id: 'c1000000-0000-0000-0000-000000000013', moduloId: 'b1000000-0000-0000-0000-000000000004', nome: 'ETL / Sistema',    shortLabel: 'ETL',      icone: 'an an-database',          rota: '/portal/etl',             tipo: 'link', ordem: 3 },
    // Minha Conta (admin)
    { id: 'c1000000-0000-0000-0000-000000000014', moduloId: 'b1000000-0000-0000-0000-000000000005', nome: 'Dados pessoais',   shortLabel: 'Dados',    icone: 'an an-user',              rota: '/portal/minha-conta',     tipo: 'link', ordem: 1 },
    { id: 'c1000000-0000-0000-0000-000000000015', moduloId: 'b1000000-0000-0000-0000-000000000005', nome: 'Meu Plano',        shortLabel: 'Plano',    icone: 'an an-tag',               rota: '/portal/meu-plano',       tipo: 'link', ordem: 2 },
    { id: 'c1000000-0000-0000-0000-000000000016', moduloId: 'b1000000-0000-0000-0000-000000000005', nome: 'Meu Token API',    shortLabel: 'Token',    icone: 'an an-key',               rota: '/portal/meu-token',       tipo: 'link', ordem: 3 },
    { id: 'c1000000-0000-0000-0000-000000000017', moduloId: 'b1000000-0000-0000-0000-000000000005', nome: 'Meu Consumo',      shortLabel: 'Consumo',  icone: 'an an-chart-bar',         rota: '/portal/consumo',         tipo: 'link', ordem: 4 },
    { id: 'c1000000-0000-0000-0000-000000000018', moduloId: 'b1000000-0000-0000-0000-000000000005', nome: 'Minhas Faturas',   shortLabel: 'Faturas',  icone: 'an an-receipt',           rota: '/portal/minhas-faturas',  tipo: 'link', ordem: 5 },
    // Sair — admin (sem módulo)
    { id: 'c1000000-0000-0000-0000-000000000019', moduloId: null, nome: 'Sair', shortLabel: 'Sair', icone: 'an an-sign-out', rota: '/sair', tipo: 'danger', ordem: 99 },
  ];

  // Rotinas — cliente (sem módulo)
  const rotinasCliente = [
    { id: 'c2000000-0000-0000-0000-000000000001', moduloId: null, nome: 'Início',        shortLabel: 'Início',   icone: 'an an-house',        rota: '/portal/dashboard',      tipo: 'link',   ordem: 1, recurso: null },
    { id: 'c2000000-0000-0000-0000-000000000002', moduloId: null, nome: 'Minha Conta',   shortLabel: 'Conta',    icone: 'an an-user-circle',  rota: '/portal/minha-conta',    tipo: 'link',   ordem: 2, recurso: null },
    { id: 'c2000000-0000-0000-0000-000000000003', moduloId: null, nome: 'Meu Plano',     shortLabel: 'Plano',    icone: 'an an-tag',          rota: '/portal/meu-plano',      tipo: 'link',   ordem: 3, recurso: null },
    { id: 'c2000000-0000-0000-0000-000000000004', moduloId: null, nome: 'Meu Token API', shortLabel: 'Token',    icone: 'an an-key',          rota: '/portal/meu-token',      tipo: 'link',   ordem: 4, recurso: null },
    { id: 'c2000000-0000-0000-0000-000000000005', moduloId: null, nome: 'Consumo',       shortLabel: 'Consumo',  icone: 'an an-chart-bar',    rota: '/portal/consumo',        tipo: 'link',   ordem: 5, recurso: null },
    { id: 'c2000000-0000-0000-0000-000000000006', moduloId: null, nome: 'Faturas',       shortLabel: 'Faturas',  icone: 'an an-receipt',      rota: '/portal/minhas-faturas', tipo: 'link',   ordem: 6, recurso: null },
    { id: 'c2000000-0000-0000-0000-000000000007', moduloId: null, nome: 'Painel 360',    shortLabel: '360',      icone: 'an an-map-trifold',  rota: '/portal/painel-360',     tipo: 'link',   ordem: 7, recurso: 'painel-360' },
    { id: 'c2000000-0000-0000-0000-000000000008', moduloId: null, nome: 'Sair',          shortLabel: 'Sair',     icone: 'an an-sign-out',     rota: '/sair',                  tipo: 'danger', ordem: 99, recurso: null },
  ];

  // Rotinas — onboarding (sem módulo)
  const rotinasOnboarding = [
    { id: 'c3000000-0000-0000-0000-000000000001', moduloId: null, nome: 'Primeiro acesso', shortLabel: 'Onboarding', icone: 'an an-user-circle',    rota: '/portal/primeiro-acesso', tipo: 'link',   ordem: 1, recurso: null },
    { id: 'c3000000-0000-0000-0000-000000000002', moduloId: null, nome: 'Minha Conta',     shortLabel: 'Conta',      icone: 'an an-shield-warning', rota: '/portal/minha-conta',     tipo: 'link',   ordem: 2, recurso: null },
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
  console.log('[seed] Rotinas OK.');

  // Associações PerfilRotina
  // Admin: todas as rotinasAdmin
  const assocAdmin = rotinasAdmin.map(r => ({
    perfilId: 'a1000000-0000-0000-0000-000000000001',
    rotinaId: r.id,
  }));
  // Cliente: rotinasCliente
  const assocCliente = rotinasCliente.map(r => ({
    perfilId: 'a1000000-0000-0000-0000-000000000002',
    rotinaId: r.id,
  }));
  // Onboarding: rotinasOnboarding
  const assocOnboarding = rotinasOnboarding.map(r => ({
    perfilId: 'a1000000-0000-0000-0000-000000000003',
    rotinaId: r.id,
  }));

  for (const a of [...assocAdmin, ...assocCliente, ...assocOnboarding]) {
    await ds.query(`
      INSERT INTO perfil_rotinas (perfil_id, rotina_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `, [a.perfilId, a.rotinaId]);
  }
  console.log('[seed] Associações PerfilRotina OK.');

  // ── Resumo ───────────────────────────────────────────────────────────────
  const [[{ clientes }]]    = [await ds.query(`SELECT count(*)::int AS clientes FROM clientes_api`)];
  const [[{ planos_count }]] = [await ds.query(`SELECT count(*)::int AS planos_count FROM planos`)];
  console.log(`\n[seed] ✓ Concluído — clientes: ${clientes}, planos: ${planos_count}`);

  process.exit(0);
}

main().catch(err => {
  console.error('[seed] ERRO:', err);
  process.exit(1);
});
