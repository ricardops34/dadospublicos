#!/usr/bin/env bash
set -Eeuo pipefail

# Seed para ambiente Swarm/Portainer
# Rodar na VPS: bash seed-swarm.sh

DB_USER="${DB_USER:-rfb_user}"
DB_SISTEMA_NAME="${DB_SISTEMA_NAME:-buscadados}"
DB_VIACEP_NAME="${DB_VIACEP_NAME:-dados_viacep}"
API_BASE_URL="${API_BASE_URL:-http://localhost:3001}"

ADMIN_EMAIL="${ADMIN_EMAIL:-admin@bjsoft.com.br}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-admin1234}"
ADMIN_NAME="${ADMIN_NAME:-Administrador}"
ADMIN_PLAN_SLUG="${ADMIN_PLAN_SLUG:-premium}"
ADMIN_PLAN_EXPIRY="${ADMIN_PLAN_EXPIRY:-2999-12-31}"
FORCE_IBGE_SYNC="${FORCE_IBGE_SYNC:-0}"

log()  { printf '\n[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1"; }
fail() { printf '\n[ERRO] %s\n' "$1" >&2; exit 1; }
sql_escape() { printf "%s" "$1" | sed "s/'/''/g"; }

find_container() {
  local service="$1"
  docker ps --filter "name=${service}" --filter "status=running" -q | head -1
}

psql_system() {
  local cid; cid="$(find_container "rfb_postgres")"
  [[ -n "$cid" ]] || fail "Container postgres não encontrado. Verifique se está rodando."
  docker exec -i "$cid" psql -U "$DB_USER" -d "$DB_SISTEMA_NAME" "$@"
}

psql_viacep() {
  local cid; cid="$(find_container "rfb_postgres")"
  [[ -n "$cid" ]] || fail "Container postgres não encontrado."
  docker exec -i "$cid" psql -U "$DB_USER" -d "$DB_VIACEP_NAME" "$@"
}

api_node() {
  local cid; cid="$(find_container "rfb_api")"
  [[ -n "$cid" ]] || fail "Container api não encontrado. Verifique se está rodando."
  docker exec -i "$cid" node - "$@"
}

wait_for_api() {
  log "Aguardando API em ${API_BASE_URL}/health..."
  local cid; cid="$(find_container "rfb_api")"
  [[ -n "$cid" ]] || fail "Container api não encontrado."
  for i in $(seq 1 60); do
    if docker exec "$cid" wget -qO- http://localhost:3001/health >/dev/null 2>&1; then
      log "API disponível."; return 0
    fi
    sleep 2
  done
  fail "API não ficou disponível."
}

upsert_admin() {
  log "Criando ou atualizando usuário admin..."
  local cid; cid="$(find_container "rfb_api")"
  local senha_hash
  senha_hash="$(docker exec -i -e SEED_ADMIN_PASSWORD="$ADMIN_PASSWORD" "$cid" \
    node -e "const b=require('bcrypt'); b.hash(process.env.SEED_ADMIN_PASSWORD,10).then(v=>console.log(v)).catch(e=>{console.error(e);process.exit(1);})")"
  senha_hash="$(printf '%s' "$senha_hash" | tr -d '\r' | tail -n 1)"
  [[ -n "$senha_hash" ]] || fail "Falha ao gerar hash da senha."

  local ae an sh
  ae="$(sql_escape "$ADMIN_EMAIL")"
  an="$(sql_escape "$ADMIN_NAME")"
  sh="$(sql_escape "$senha_hash")"

  psql_system -v ON_ERROR_STOP=1 <<SQL
INSERT INTO clientes_api (nome, email, senha_hash, perfil, ativo, email_verificado, onboarding_pendente, tipo_pessoa)
VALUES ('${an}', '${ae}', '${sh}', 'admin', true, true, false, 'J')
ON CONFLICT (email) DO UPDATE
SET nome = EXCLUDED.nome, senha_hash = EXCLUDED.senha_hash,
    perfil = 'admin', ativo = true, email_verificado = true, onboarding_pendente = false;
SQL
}

seed_planos() {
  log "Semeando planos e recursos..."
  api_node <<'NODE'
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { PlanosService } = require('./dist/modules/planos/planos.service');
(async () => {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const svc = app.get(PlanosService);
  const planos = await svc.seed();
  console.log(JSON.stringify({ planos: planos.length }));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
NODE
}

seed_ibge() {
  local uf_count
  uf_count="$(psql_viacep -At -c "select count(*) from uf_ibge;")"
  uf_count="${uf_count//$'\r'/}"
  if [[ "$FORCE_IBGE_SYNC" != "1" && "${uf_count:-0}" -gt 0 ]]; then
    log "UFs já carregadas (${uf_count}). Pulando. Use FORCE_IBGE_SYNC=1 para forçar."; return 0
  fi
  log "Sincronizando UFs e municípios do IBGE..."
  api_node <<'NODE'
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { GeocodeService } = require('./dist/modules/geocode/geocode.service');
(async () => {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const svc = app.get(GeocodeService);
  const result = await svc.syncIbge();
  console.log(JSON.stringify(result));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
NODE
}

ensure_admin_plan() {
  log "Garantindo plano ${ADMIN_PLAN_SLUG} para ${ADMIN_EMAIL}..."
  local ae ps cid
  ae="$(sql_escape "$ADMIN_EMAIL")"
  ps="$(sql_escape "$ADMIN_PLAN_SLUG")"
  cid="$(find_container "rfb_api")"

  local admin_id plano_id active_plan
  admin_id="$(psql_system -At -c "select id from clientes_api where email='${ae}' limit 1;")"
  admin_id="${admin_id//$'\r'/}"
  [[ -n "$admin_id" ]] || fail "Admin não encontrado após upsert."

  plano_id="$(psql_system -At -c "select id from planos where slug='${ps}' and ativo=true limit 1;")"
  plano_id="${plano_id//$'\r'/}"
  [[ -n "$plano_id" ]] || fail "Plano ${ADMIN_PLAN_SLUG} não encontrado."

  active_plan="$(psql_system -At -c "select p.slug from assinaturas a join planos p on p.id=a.plano_id where a.cliente_id='${admin_id}' and a.status='ativa' order by a.criado_em desc limit 1;")"
  active_plan="${active_plan//$'\r'/}"

  if [[ "$active_plan" != "$ADMIN_PLAN_SLUG" ]]; then
    docker exec -i -e SEED_CLIENTE_ID="$admin_id" -e SEED_PLANO_SLUG="$ADMIN_PLAN_SLUG" "$cid" node - <<'NODE'
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { AssinaturasService } = require('./dist/modules/assinaturas/assinaturas.service');
(async () => {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const svc = app.get(AssinaturasService);
  await svc.assinar(process.env.SEED_CLIENTE_ID, process.env.SEED_PLANO_SLUG);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
NODE
  fi

  local expiry_esc; expiry_esc="$(sql_escape "$ADMIN_PLAN_EXPIRY")"
  psql_system -v ON_ERROR_STOP=1 <<SQL
UPDATE assinaturas SET plano_id='${plano_id}', status='ativa', data_fim='${expiry_esc}',
  proximo_vencimento='${expiry_esc}', cancelado_em=NULL, agendar_cancelamento_em=NULL, motivo_cancelamento=NULL
WHERE id=(SELECT a.id FROM assinaturas a WHERE a.cliente_id='${admin_id}' AND a.status='ativa' ORDER BY a.criado_em DESC LIMIT 1);

UPDATE tokens SET plano='${ps}', limite_mensal=p.limite_mensal, ativo=true
FROM planos p WHERE p.id='${plano_id}'
  AND tokens.id=(SELECT a.token_id FROM assinaturas a WHERE a.cliente_id='${admin_id}' AND a.status='ativa' ORDER BY a.criado_em DESC LIMIT 1);
SQL
}

show_summary() {
  log "Resumo final:"
  psql_system -c "select count(*) as clientes from clientes_api; select count(*) as planos from planos; select count(*) as recursos from recursos_plano;"
  psql_viacep -c "select count(*) as ufs from uf_ibge; select count(*) as municipios from municipio_ibge;"
}

main() {
  wait_for_api
  upsert_admin
  seed_planos
  seed_ibge
  ensure_admin_plan
  show_summary
  log "Seed concluído."
}

main "$@"
