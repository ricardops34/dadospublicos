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
