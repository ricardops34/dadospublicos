#!/usr/bin/env node
// Seed canônico de bootstrap da aplicação.
// Cobertura: admin da plataforma, planos/recursos, UFs/municípios IBGE,
// clientes vinculados, perfis, módulos, rotinas e associações de menu.
// Uso: node seed.js
// Variáveis opcionais: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME,
// ADMIN_PLAN_SLUG, ADMIN_PLAN_EXPIRY, FORCE_IBGE_SYNC,
// BOOTSTRAP_CLIENT_NAME, BOOTSTRAP_CLIENT_EMAIL, BOOTSTRAP_CLIENT_CNPJ, BOOTSTRAP_CLIENT_PHONE,
// BOOTSTRAP_CLIENT_FANTASY_NAME, BOOTSTRAP_CLIENT_COMPANY_SIZE, BOOTSTRAP_CLIENT_STATUS,
// BOOTSTRAP_CLIENT_CEP, BOOTSTRAP_CLIENT_STREET, BOOTSTRAP_CLIENT_NUMBER, BOOTSTRAP_CLIENT_DISTRICT,
// BOOTSTRAP_CLIENT_CITY, BOOTSTRAP_CLIENT_UF, BOOTSTRAP_CLIENT_CNAE,
// BOOTSTRAP_CLIENT_CNAE_DESC, BOOTSTRAP_CLIENT_LEGAL_NATURE_CODE, BOOTSTRAP_CLIENT_LEGAL_NATURE_DESC

'use strict';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'ricardo@bjsoft.com.br';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin1234';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Administrador';
const ADMIN_PLAN_SLUG = process.env.ADMIN_PLAN_SLUG || 'premium';
const ADMIN_PLAN_EXPIRY = process.env.ADMIN_PLAN_EXPIRY || '2999-12-31';
const FORCE_IBGE_SYNC = process.env.FORCE_IBGE_SYNC === '1';
const BOOTSTRAP_CLIENT_NAME = process.env.BOOTSTRAP_CLIENT_NAME || 'RICARDO PATAY SOTOMAYOR';
const BOOTSTRAP_CLIENT_EMAIL = process.env.BOOTSTRAP_CLIENT_EMAIL || 'conasci@gmail.com';
const BOOTSTRAP_CLIENT_CNPJ = (process.env.BOOTSTRAP_CLIENT_CNPJ || '19.654.062/0001-45').replace(/\D/g, '') || null;
const BOOTSTRAP_CLIENT_PHONE = (process.env.BOOTSTRAP_CLIENT_PHONE || '+5567991468448').replace(/\D/g, '') || null;
const BOOTSTRAP_CLIENT_FANTASY_NAME = process.env.BOOTSTRAP_CLIENT_FANTASY_NAME || 'B. J. INFORMATICA';
const BOOTSTRAP_CLIENT_COMPANY_SIZE = process.env.BOOTSTRAP_CLIENT_COMPANY_SIZE || 'Micro Empresa';
const BOOTSTRAP_CLIENT_STATUS = process.env.BOOTSTRAP_CLIENT_STATUS || 'Ativa';
const BOOTSTRAP_CLIENT_CEP = (process.env.BOOTSTRAP_CLIENT_CEP || '79117130').replace(/\D/g, '') || null;
const BOOTSTRAP_CLIENT_STREET = process.env.BOOTSTRAP_CLIENT_STREET || 'JOAO GUIMARAES ROSA';
const BOOTSTRAP_CLIENT_NUMBER = process.env.BOOTSTRAP_CLIENT_NUMBER || '459';
const BOOTSTRAP_CLIENT_DISTRICT = process.env.BOOTSTRAP_CLIENT_DISTRICT || 'VILA NASSER';
const BOOTSTRAP_CLIENT_CITY = process.env.BOOTSTRAP_CLIENT_CITY || 'Campo Grande';
const BOOTSTRAP_CLIENT_UF = process.env.BOOTSTRAP_CLIENT_UF || 'MS';
const BOOTSTRAP_CLIENT_CNAE = (process.env.BOOTSTRAP_CLIENT_CNAE || '6209100').replace(/\D/g, '') || null;
const BOOTSTRAP_CLIENT_CNAE_DESC = process.env.BOOTSTRAP_CLIENT_CNAE_DESC || 'Suporte técnico, manutenção e outros serviços em tecnologia da informação';
const BOOTSTRAP_CLIENT_LEGAL_NATURE_CODE = process.env.BOOTSTRAP_CLIENT_LEGAL_NATURE_CODE || '2135';
const BOOTSTRAP_CLIENT_LEGAL_NATURE_DESC = process.env.BOOTSTRAP_CLIENT_LEGAL_NATURE_DESC || 'Empresário (Individual)';

const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');

async function main() {
  console.log('\n[seed] Iniciando contexto NestJS...');
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn'] });

  console.log('[seed] Semeando planos e recursos...');
  const { PlanosService } = require('./dist/modules/planos/planos.service');
  const planosService = app.get(PlanosService);
  const planos = await planosService.seed();
  console.log(`[seed] Planos: ${planos.length} registros.`);

  console.log(`[seed] Criando/atualizando admin da plataforma: ${ADMIN_EMAIL}`);
  const bcrypt = require('bcrypt');
  const senhaHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const { getDataSourceToken } = require('@nestjs/typeorm');
  const ds = app.get(getDataSourceToken('buscadados'));
  const dsViacep = app.get(getDataSourceToken('viacep'));

  await ds.query(`
    INSERT INTO usuarios (nome, email, senha_hash, perfil, ativo, email_verificado, onboarding_pendente)
    VALUES ($1, $2, $3, 'admin', true, true, false)
    ON CONFLICT (email) DO UPDATE
    SET nome = EXCLUDED.nome, senha_hash = EXCLUDED.senha_hash,
        perfil = 'admin', ativo = true, email_verificado = true, onboarding_pendente = false
  `, [ADMIN_NAME, ADMIN_EMAIL, senhaHash]);
  console.log('[seed] Admin da plataforma OK.');

  const [adminRow] = await ds.query(`SELECT id FROM usuarios WHERE email = $1 LIMIT 1`, [ADMIN_EMAIL]);
  if (!adminRow) throw new Error('Admin não encontrado após insert.');

  console.log('[seed] Garantindo cliente bootstrap vinculado ao admin...');
  let clienteBootstrap = null;

  if (BOOTSTRAP_CLIENT_CNPJ) {
    [clienteBootstrap] = await ds.query(`
      SELECT id, proprietario_id
      FROM clientes
      WHERE cnpj = $1
      LIMIT 1
    `, [BOOTSTRAP_CLIENT_CNPJ]);
  }

  if (!clienteBootstrap) {
    [clienteBootstrap] = await ds.query(`
      SELECT id, proprietario_id
      FROM clientes
      WHERE proprietario_id = $1 OR email = $2
      ORDER BY CASE WHEN proprietario_id = $1 THEN 0 ELSE 1 END
      LIMIT 1
    `, [adminRow.id, BOOTSTRAP_CLIENT_EMAIL]);
  }

  if (clienteBootstrap) {
    await ds.query(`
      UPDATE clientes
      SET proprietario_id = $2,
          tipo_pessoa = 'J',
          nome = $3,
          email = $4,
          cnpj = COALESCE($5, cnpj),
          telefone = COALESCE($6, telefone),
          cep = COALESCE($7, cep),
          logradouro = COALESCE($8, logradouro),
          numero = COALESCE($9, numero),
          bairro = COALESCE($10, bairro),
          municipio = COALESCE($11, municipio),
          uf = COALESCE($12, uf),
          cnae_principal = COALESCE($13, cnae_principal),
          cnae_principal_descricao = COALESCE($14, cnae_principal_descricao),
          natureza_juridica_codigo = COALESCE($15, natureza_juridica_codigo),
          natureza_juridica_descricao = COALESCE($16, natureza_juridica_descricao),
          porte_empresa = COALESCE($17, porte_empresa),
          situacao_cadastral = COALESCE($18, situacao_cadastral),
          razao_social = COALESCE(NULLIF(razao_social, ''), $3),
          nome_fantasia = COALESCE(NULLIF(nome_fantasia, ''), $19),
          ativo = true,
          onboarding_pendente = false,
          agendar_exclusao_em = NULL
      WHERE id = $1
    `, [
      clienteBootstrap.id,
      adminRow.id,
      BOOTSTRAP_CLIENT_NAME,
      BOOTSTRAP_CLIENT_EMAIL,
      BOOTSTRAP_CLIENT_CNPJ,
      BOOTSTRAP_CLIENT_PHONE,
      BOOTSTRAP_CLIENT_CEP,
      BOOTSTRAP_CLIENT_STREET,
      BOOTSTRAP_CLIENT_NUMBER,
      BOOTSTRAP_CLIENT_DISTRICT,
      BOOTSTRAP_CLIENT_CITY,
      BOOTSTRAP_CLIENT_UF,
      BOOTSTRAP_CLIENT_CNAE,
      BOOTSTRAP_CLIENT_CNAE_DESC,
      BOOTSTRAP_CLIENT_LEGAL_NATURE_CODE,
      BOOTSTRAP_CLIENT_LEGAL_NATURE_DESC,
      BOOTSTRAP_CLIENT_COMPANY_SIZE,
      BOOTSTRAP_CLIENT_STATUS,
      BOOTSTRAP_CLIENT_FANTASY_NAME,
    ]);
  } else {
    [clienteBootstrap] = await ds.query(`
      INSERT INTO clientes (
        proprietario_id, tipo_pessoa, nome, email, cnpj, telefone,
        cep, logradouro, numero, bairro, municipio, uf,
        cnae_principal, cnae_principal_descricao,
        natureza_juridica_codigo, natureza_juridica_descricao,
        porte_empresa, situacao_cadastral,
        razao_social, nome_fantasia, ativo, onboarding_pendente, agendar_exclusao_em
      )
      VALUES ($1, 'J', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $2, $18, true, false, NULL)
      RETURNING id, proprietario_id
    `, [
      adminRow.id,
      BOOTSTRAP_CLIENT_NAME,
      BOOTSTRAP_CLIENT_EMAIL,
      BOOTSTRAP_CLIENT_CNPJ,
      BOOTSTRAP_CLIENT_PHONE,
      BOOTSTRAP_CLIENT_CEP,
      BOOTSTRAP_CLIENT_STREET,
      BOOTSTRAP_CLIENT_NUMBER,
      BOOTSTRAP_CLIENT_DISTRICT,
      BOOTSTRAP_CLIENT_CITY,
      BOOTSTRAP_CLIENT_UF,
      BOOTSTRAP_CLIENT_CNAE,
      BOOTSTRAP_CLIENT_CNAE_DESC,
      BOOTSTRAP_CLIENT_LEGAL_NATURE_CODE,
      BOOTSTRAP_CLIENT_LEGAL_NATURE_DESC,
      BOOTSTRAP_CLIENT_COMPANY_SIZE,
      BOOTSTRAP_CLIENT_STATUS,
      BOOTSTRAP_CLIENT_FANTASY_NAME,
    ]);
  }

  await ds.query(`
    UPDATE usuarios
    SET cliente_id = $2,
        telefone = COALESCE($3, telefone),
        ativo = true,
        email_verificado = true,
        onboarding_pendente = false
    WHERE id = $1
  `, [adminRow.id, clienteBootstrap.id, BOOTSTRAP_CLIENT_PHONE]);

  console.log(`[seed] Cliente bootstrap OK (${BOOTSTRAP_CLIENT_NAME}).`);

  console.log(`[seed] Atribuindo plano ${ADMIN_PLAN_SLUG} ao admin...`);
  const { AssinaturasService } = require('./dist/modules/assinaturas/assinaturas.service');
  const assinaturasService = app.get(AssinaturasService);

  const [activePlan] = await ds.query(`
    SELECT p.slug FROM assinaturas a JOIN planos p ON p.id = a.plano_id
    WHERE a.usuario_id = $1 AND a.status = 'ativa' ORDER BY a.criado_em DESC LIMIT 1
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
    WHERE usuario_id = $2 AND status = 'ativa'
  `, [ADMIN_PLAN_EXPIRY, adminRow.id]);

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

  console.log('[seed] Verificando vínculo usuário → cliente...');

  await ds.query(`
    INSERT INTO clientes (
      proprietario_id, tipo_pessoa, ativo, onboarding_pendente,
      agendar_exclusao_em, criado_em, atualizado_em
    )
    SELECT id, 'J', ativo, onboarding_pendente, agendar_exclusao_em, criado_em, atualizado_em
    FROM usuarios
    WHERE perfil = 'cliente'
      AND cliente_id IS NULL
      AND id NOT IN (SELECT proprietario_id FROM clientes)
  `);

  await ds.query(`
    UPDATE usuarios u
    SET cliente_id = c.id
    FROM clientes c
    WHERE c.proprietario_id = u.id
      AND u.cliente_id IS NULL
  `);

  await ds.query(`
    UPDATE assinaturas a
    SET cliente_id = u.cliente_id
    FROM usuarios u
    WHERE a.usuario_id = u.id
      AND u.cliente_id IS NOT NULL
      AND a.cliente_id IS NULL
  `);

  await ds.query(`
    UPDATE tokens t
    SET cliente_id = u.cliente_id
    FROM assinaturas a
    JOIN usuarios u ON u.id = a.usuario_id
    WHERE a.token_id = t.id
      AND t.cliente_id IS NULL
      AND u.cliente_id IS NOT NULL
  `);

  const [[{ clientes_count }]] = [await ds.query(`SELECT count(*)::int AS clientes_count FROM clientes`)];
  console.log(`[seed] Clientes OK — ${clientes_count} cliente(s).`);

  console.log('[seed] Semeando perfis, módulos, rotinas e associações do menu...');

  const perfis = [
    { id: 'a1000000-0000-0000-0000-000000000001', codigo: 'admin', nome: 'Administrador' },
    { id: 'a1000000-0000-0000-0000-000000000002', codigo: 'cliente', nome: 'Cliente' },
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

  const modulos = [
    { id: 'b1000000-0000-0000-0000-000000000001', nome: 'Dashboards', shortLabel: 'Dashboard', icone: 'an an-gauge', ordem: 1 },
    { id: 'b1000000-0000-0000-0000-000000000002', nome: 'Comercial', shortLabel: 'Comercial', icone: 'an an-handshake', ordem: 2 },
    { id: 'b1000000-0000-0000-0000-000000000003', nome: 'Financeiro', shortLabel: 'Financeiro', icone: 'an an-currency-dollar', ordem: 3 },
    { id: 'b1000000-0000-0000-0000-000000000004', nome: 'Configurações', shortLabel: 'Config', icone: 'an an-gear', ordem: 4 },
    { id: 'b1000000-0000-0000-0000-000000000005', nome: 'Minha Conta', shortLabel: 'Minha Cta', icone: 'an an-user-circle', ordem: 5 },
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

  const rotinasAdmin = [
    { id: 'c1000000-0000-0000-0000-000000000001', moduloId: 'b1000000-0000-0000-0000-000000000001', nome: 'Visão Geral', shortLabel: 'Visão', icone: 'an an-chart-line', rota: '/portal/dashboard', tipo: 'link', ordem: 1 },
    { id: 'c1000000-0000-0000-0000-000000000002', moduloId: 'b1000000-0000-0000-0000-000000000001', nome: 'Analytics LP', shortLabel: 'Analytics', icone: 'an an-chart-bar', rota: '/portal/analytics', tipo: 'link', ordem: 2 },
    { id: 'c1000000-0000-0000-0000-000000000003', moduloId: 'b1000000-0000-0000-0000-000000000001', nome: 'Painel 360 Admin', shortLabel: '360 Admin', icone: 'an an-map-trifold', rota: '/portal/painel-360-admin', tipo: 'link', ordem: 3 },
    { id: 'c1000000-0000-0000-0000-000000000004', moduloId: 'b1000000-0000-0000-0000-000000000002', nome: 'Clientes', shortLabel: 'Clientes', icone: 'an an-users', rota: '/portal/clientes', tipo: 'link', ordem: 1 },
    { id: 'c1000000-0000-0000-0000-000000000005', moduloId: 'b1000000-0000-0000-0000-000000000002', nome: 'Planos', shortLabel: 'Planos', icone: 'an an-tag', rota: '/portal/planos', tipo: 'link', ordem: 2 },
    { id: 'c1000000-0000-0000-0000-000000000006', moduloId: 'b1000000-0000-0000-0000-000000000002', nome: 'Recursos', shortLabel: 'Recursos', icone: 'an an-puzzle-piece', rota: '/portal/recursos', tipo: 'link', ordem: 3 },
    { id: 'c1000000-0000-0000-0000-000000000007', moduloId: 'b1000000-0000-0000-0000-000000000002', nome: 'Recurso × Planos', shortLabel: 'Rec×Plan', icone: 'an an-arrows-left-right', rota: '/portal/recurso-planos', tipo: 'link', ordem: 4 },
    { id: 'c1000000-0000-0000-0000-000000000008', moduloId: 'b1000000-0000-0000-0000-000000000003', nome: 'Assinaturas', shortLabel: 'Assinat.', icone: 'an an-calendar-check', rota: '/portal/assinaturas', tipo: 'link', ordem: 1 },
    { id: 'c1000000-0000-0000-0000-000000000009', moduloId: 'b1000000-0000-0000-0000-000000000003', nome: 'Faturas Admin', shortLabel: 'Faturas', icone: 'an an-receipt', rota: '/portal/faturas', tipo: 'link', ordem: 2 },
    { id: 'c1000000-0000-0000-0000-000000000010', moduloId: 'b1000000-0000-0000-0000-000000000003', nome: 'Consumo Admin', shortLabel: 'Consumo', icone: 'an an-chart-bar', rota: '/portal/consumo-admin', tipo: 'link', ordem: 3 },
    { id: 'c1000000-0000-0000-0000-000000000011', moduloId: 'b1000000-0000-0000-0000-000000000004', nome: 'Parâmetros', shortLabel: 'Params', icone: 'an an-sliders', rota: '/portal/parametros', tipo: 'link', ordem: 1 },
    { id: 'c1000000-0000-0000-0000-000000000012', moduloId: 'b1000000-0000-0000-0000-000000000004', nome: 'Config. E-mail', shortLabel: 'E-mail', icone: 'an an-envelope', rota: '/portal/config-email', tipo: 'link', ordem: 2 },
    { id: 'c1000000-0000-0000-0000-000000000013', moduloId: 'b1000000-0000-0000-0000-000000000004', nome: 'ETL / Sistema', shortLabel: 'ETL', icone: 'an an-database', rota: '/portal/etl', tipo: 'link', ordem: 3 },
    { id: 'c1000000-0000-0000-0000-000000000020', moduloId: 'b1000000-0000-0000-0000-000000000004', nome: 'Perfis', shortLabel: 'Perfis', icone: 'an an-identification-badge', rota: '/portal/perfis', tipo: 'link', ordem: 4 },
    { id: 'c1000000-0000-0000-0000-000000000021', moduloId: 'b1000000-0000-0000-0000-000000000004', nome: 'Módulos', shortLabel: 'Módulos', icone: 'an an-squares-four', rota: '/portal/modulos', tipo: 'link', ordem: 5 },
    { id: 'c1000000-0000-0000-0000-000000000022', moduloId: 'b1000000-0000-0000-0000-000000000004', nome: 'Manutenção Menu', shortLabel: 'Menu', icone: 'an an-list', rota: '/portal/rotinas', tipo: 'link', ordem: 6 },
    { id: 'c1000000-0000-0000-0000-000000000023', moduloId: 'b1000000-0000-0000-0000-000000000004', nome: 'Usuários', shortLabel: 'Usuários', icone: 'an an-users', rota: '/portal/usuarios-admin', tipo: 'link', ordem: 7 },
    { id: 'c1000000-0000-0000-0000-000000000014', moduloId: 'b1000000-0000-0000-0000-000000000005', nome: 'Dados pessoais', shortLabel: 'Dados', icone: 'an an-user', rota: '/portal/minha-conta', tipo: 'link', ordem: 1 },
    { id: 'c1000000-0000-0000-0000-000000000015', moduloId: 'b1000000-0000-0000-0000-000000000005', nome: 'Meu Plano', shortLabel: 'Plano', icone: 'an an-tag', rota: '/portal/meu-plano', tipo: 'link', ordem: 2 },
    { id: 'c1000000-0000-0000-0000-000000000016', moduloId: 'b1000000-0000-0000-0000-000000000005', nome: 'Meu Token API', shortLabel: 'Token', icone: 'an an-key', rota: '/portal/meu-token', tipo: 'link', ordem: 3 },
    { id: 'c1000000-0000-0000-0000-000000000017', moduloId: 'b1000000-0000-0000-0000-000000000005', nome: 'Meu Consumo', shortLabel: 'Consumo', icone: 'an an-chart-bar', rota: '/portal/consumo', tipo: 'link', ordem: 4 },
    { id: 'c1000000-0000-0000-0000-000000000018', moduloId: 'b1000000-0000-0000-0000-000000000005', nome: 'Minhas Faturas', shortLabel: 'Faturas', icone: 'an an-receipt', rota: '/portal/minhas-faturas', tipo: 'link', ordem: 5 },
    { id: 'c1000000-0000-0000-0000-000000000019', moduloId: null, nome: 'Sair', shortLabel: 'Sair', icone: 'an an-sign-out', rota: '/sair', tipo: 'danger', ordem: 99 },
  ];

  const rotinasCliente = [
    { id: 'c2000000-0000-0000-0000-000000000001', moduloId: null, nome: 'Início', shortLabel: 'Início', icone: 'an an-house', rota: '/portal/dashboard', tipo: 'link', ordem: 1, recurso: null },
    { id: 'c2000000-0000-0000-0000-000000000002', moduloId: null, nome: 'Minha Conta', shortLabel: 'Conta', icone: 'an an-user-circle', rota: '/portal/minha-conta', tipo: 'link', ordem: 2, recurso: null },
    { id: 'c2000000-0000-0000-0000-000000000003', moduloId: null, nome: 'Meu Plano', shortLabel: 'Plano', icone: 'an an-tag', rota: '/portal/meu-plano', tipo: 'link', ordem: 3, recurso: null },
    { id: 'c2000000-0000-0000-0000-000000000004', moduloId: null, nome: 'Meu Token API', shortLabel: 'Token', icone: 'an an-key', rota: '/portal/meu-token', tipo: 'link', ordem: 4, recurso: null },
    { id: 'c2000000-0000-0000-0000-000000000005', moduloId: null, nome: 'Consumo', shortLabel: 'Consumo', icone: 'an an-chart-bar', rota: '/portal/consumo', tipo: 'link', ordem: 5, recurso: null },
    { id: 'c2000000-0000-0000-0000-000000000006', moduloId: null, nome: 'Faturas', shortLabel: 'Faturas', icone: 'an an-receipt', rota: '/portal/minhas-faturas', tipo: 'link', ordem: 6, recurso: null },
    { id: 'c2000000-0000-0000-0000-000000000007', moduloId: null, nome: 'Painel 360', shortLabel: '360', icone: 'an an-map-trifold', rota: '/portal/painel-360', tipo: 'link', ordem: 7, recurso: 'painel-360' },
    { id: 'c2000000-0000-0000-0000-000000000008', moduloId: null, nome: 'Sair', shortLabel: 'Sair', icone: 'an an-sign-out', rota: '/sair', tipo: 'danger', ordem: 99, recurso: null },
  ];

  const rotinasOnboarding = [
    { id: 'c3000000-0000-0000-0000-000000000001', moduloId: null, nome: 'Primeiro acesso', shortLabel: 'Onboarding', icone: 'an an-user-circle', rota: '/portal/primeiro-acesso', tipo: 'link', ordem: 1, recurso: null },
    { id: 'c3000000-0000-0000-0000-000000000002', moduloId: null, nome: 'Minha Conta', shortLabel: 'Conta', icone: 'an an-shield-warning', rota: '/portal/minha-conta', tipo: 'link', ordem: 2, recurso: null },
    { id: 'c3000000-0000-0000-0000-000000000003', moduloId: null, nome: 'Sair', shortLabel: 'Sair', icone: 'an an-sign-out', rota: '/sair', tipo: 'danger', ordem: 99, recurso: null },
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

  const assocAdmin = rotinasAdmin.map((r) => ({
    perfilId: 'a1000000-0000-0000-0000-000000000001',
    rotinaId: r.id,
  }));
  const assocCliente = rotinasCliente.map((r) => ({
    perfilId: 'a1000000-0000-0000-0000-000000000002',
    rotinaId: r.id,
  }));
  const assocOnboarding = rotinasOnboarding.map((r) => ({
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

  const [[{ usuarios_count }]] = [await ds.query(`SELECT count(*)::int AS usuarios_count FROM usuarios`)];
  const [[{ clientes_count_final }]] = [await ds.query(`SELECT count(*)::int AS clientes_count_final FROM clientes`)];
  const [[{ planos_count }]] = [await ds.query(`SELECT count(*)::int AS planos_count FROM planos`)];
  const [[{ perfis_count }]] = [await ds.query(`SELECT count(*)::int AS perfis_count FROM perfis`)];
  const [[{ modulos_count }]] = [await ds.query(`SELECT count(*)::int AS modulos_count FROM menu_modulos`)];
  const [[{ rotinas_count }]] = [await ds.query(`SELECT count(*)::int AS rotinas_count FROM menu_rotinas`)];
  const [[{ perfil_rotinas_count }]] = [await ds.query(`SELECT count(*)::int AS perfil_rotinas_count FROM perfil_rotinas`)];
  const [[{ uf_count_final }]] = [await dsViacep.query(`SELECT count(*)::int AS uf_count_final FROM uf_ibge`)];
  const [[{ municipio_count_final }]] = [await dsViacep.query(`SELECT count(*)::int AS municipio_count_final FROM municipio_ibge`)];

  console.log(`\n[seed] ✓ Concluído — usuários: ${usuarios_count}, clientes: ${clientes_count_final}, planos: ${planos_count}`);
  console.log(`[seed] ✓ Menu — perfis: ${perfis_count}, módulos: ${modulos_count}, rotinas: ${rotinas_count}, vínculos: ${perfil_rotinas_count}`);
  console.log(`[seed] ✓ IBGE — UFs: ${uf_count_final}, municípios: ${municipio_count_final}`);

  process.exit(0);
}

main().catch((err) => {
  console.error('[seed] ERRO:', err);
  process.exit(1);
});
