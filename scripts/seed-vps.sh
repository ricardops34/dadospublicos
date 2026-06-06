#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

PORT="${PORT:-3001}"
API_BASE_URL="${API_BASE_URL:-http://localhost:${PORT}}"
DB_USER="${DB_USER:-rfb_user}"
DB_SISTEMA_NAME="${DB_SISTEMA_NAME:-buscadados}"
DB_VIACEP_NAME="${DB_VIACEP_NAME:-dados_viacep}"

ADMIN_EMAIL="${ADMIN_EMAIL:-admin@bjsoft.com.br}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-admin1234}"
ADMIN_NAME="${ADMIN_NAME:-Administrador}"
ADMIN_PLAN_SLUG="${ADMIN_PLAN_SLUG:-premium}"
ADMIN_PLAN_EXPIRY="${ADMIN_PLAN_EXPIRY:-2999-12-31}"
FORCE_IBGE_SYNC="${FORCE_IBGE_SYNC:-0}"

log() {
  printf '\n[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1"
}

fail() {
  printf '\n[ERRO] %s\n' "$1" >&2
  exit 1
}

sql_escape() {
  printf "%s" "$1" | sed "s/'/''/g"
}

psql_system() {
  docker compose exec -T postgres psql -U "$DB_USER" -d "$DB_SISTEMA_NAME" "$@"
}

psql_viacep() {
  docker compose exec -T postgres psql -U "$DB_USER" -d "$DB_VIACEP_NAME" "$@"
}

api_node() {
  docker compose exec -T api node - "$@"
}

ensure_dependencies() {
  command -v docker >/dev/null 2>&1 || fail "Docker não encontrado."
  command -v curl >/dev/null 2>&1 || fail "curl não encontrado."
}

wait_for_api() {
  local url="${API_BASE_URL}/health"
  local attempts=60

  log "Aguardando API em ${url}..."
  for ((i=1; i<=attempts; i++)); do
    if curl -fsS "$url" >/dev/null 2>&1; then
      log "API disponível."
      return 0
    fi
    sleep 2
  done

  fail "API não ficou disponível em ${url}."
}

upsert_admin() {
  log "Criando ou atualizando usuário admin..."

  local senha_hash
  senha_hash="$(docker compose exec -T -e SEED_ADMIN_PASSWORD="$ADMIN_PASSWORD" api sh -lc "node -e \"const bcrypt=require('bcrypt'); bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 10).then(v => console.log(v)).catch(err => { console.error(err); process.exit(1); });\"")"
  senha_hash="$(printf '%s' "$senha_hash" | tr -d '\r' | tail -n 1)"
  [[ -n "$senha_hash" ]] || fail "Falha ao gerar hash da senha do admin."

  local admin_email_esc admin_name_esc senha_hash_esc
  admin_email_esc="$(sql_escape "$ADMIN_EMAIL")"
  admin_name_esc="$(sql_escape "$ADMIN_NAME")"
  senha_hash_esc="$(sql_escape "$senha_hash")"

  psql_system -v ON_ERROR_STOP=1 <<SQL
INSERT INTO clientes_api (
  nome,
  email,
  senha_hash,
  perfil,
  ativo,
  email_verificado,
  onboarding_pendente,
  tipo_pessoa
) VALUES (
  '${admin_name_esc}',
  '${admin_email_esc}',
  '${senha_hash_esc}',
  'admin',
  true,
  true,
  false,
  'J'
)
ON CONFLICT (email) DO UPDATE
SET
  nome = EXCLUDED.nome,
  senha_hash = EXCLUDED.senha_hash,
  perfil = 'admin',
  ativo = true,
  email_verificado = true,
  onboarding_pendente = false;
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
  const service = app.get(PlanosService);
  const planos = await service.seed();
  console.log(JSON.stringify({ planos: planos.length }));
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
NODE
}

seed_ibge() {
  local uf_count
  uf_count="$(psql_viacep -At -c "select count(*) from uf_ibge;")"
  uf_count="${uf_count//$'\r'/}"

  if [[ "$FORCE_IBGE_SYNC" != "1" && "${uf_count:-0}" -gt 0 ]]; then
    log "UFs já carregadas (${uf_count}). Pulando sync do IBGE. Use FORCE_IBGE_SYNC=1 para forçar."
    return 0
  fi

  log "Sincronizando UFs e municípios do IBGE..."
  api_node <<'NODE'
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { GeocodeService } = require('./dist/modules/geocode/geocode.service');

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const service = app.get(GeocodeService);
  const result = await service.syncIbge();
  console.log(JSON.stringify(result));
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
NODE
}

ensure_admin_plan() {
  log "Garantindo plano ${ADMIN_PLAN_SLUG} para ${ADMIN_EMAIL}..."

  local admin_email_esc plan_slug_esc admin_id plano_id plano_limited active_plan
  admin_email_esc="$(sql_escape "$ADMIN_EMAIL")"
  plan_slug_esc="$(sql_escape "$ADMIN_PLAN_SLUG")"

  admin_id="$(psql_system -At -c "select id from clientes_api where email = '${admin_email_esc}' limit 1;")"
  admin_id="${admin_id//$'\r'/}"
  [[ -n "$admin_id" ]] || fail "Admin ${ADMIN_EMAIL} não encontrado após upsert."

  plano_id="$(psql_system -At -c "select id from planos where slug = '${plan_slug_esc}' and ativo = true limit 1;")"
  plano_id="${plano_id//$'\r'/}"
  [[ -n "$plano_id" ]] || fail "Plano ${ADMIN_PLAN_SLUG} não encontrado."

  active_plan="$(psql_system -At -c "select p.slug from assinaturas a join planos p on p.id = a.plano_id where a.cliente_id = '${admin_id}' and a.status = 'ativa' order by a.criado_em desc limit 1;")"
  active_plan="${active_plan//$'\r'/}"

  if [[ "$active_plan" != "$ADMIN_PLAN_SLUG" ]]; then
    docker compose exec -T -e SEED_CLIENTE_ID="$admin_id" -e SEED_PLANO_SLUG="$ADMIN_PLAN_SLUG" api sh -lc "node - <<'NODE'
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');
const { AssinaturasService } = require('./dist/modules/assinaturas/assinaturas.service');

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const service = app.get(AssinaturasService);
  const result = await service.assinar(process.env.SEED_CLIENTE_ID, process.env.SEED_PLANO_SLUG);
  console.log(JSON.stringify(result));
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
NODE"
  fi

  local expiry_esc
  expiry_esc="$(sql_escape "$ADMIN_PLAN_EXPIRY")"

  psql_system -v ON_ERROR_STOP=1 <<SQL
UPDATE assinaturas
SET
  plano_id = '${plano_id}',
  status = 'ativa',
  data_fim = '${expiry_esc}',
  proximo_vencimento = '${expiry_esc}',
  cancelado_em = NULL,
  agendar_cancelamento_em = NULL,
  motivo_cancelamento = NULL
WHERE id = (
  SELECT a.id
  FROM assinaturas a
  WHERE a.cliente_id = '${admin_id}' AND a.status = 'ativa'
  ORDER BY a.criado_em DESC
  LIMIT 1
);

UPDATE tokens
SET
  plano = '${plan_slug_esc}',
  limite_mensal = p.limite_mensal,
  ativo = true
FROM planos p
WHERE
  p.id = '${plano_id}'
  AND tokens.id = (
    SELECT a.token_id
    FROM assinaturas a
    WHERE a.cliente_id = '${admin_id}' AND a.status = 'ativa'
    ORDER BY a.criado_em DESC
    LIMIT 1
  );
SQL
}

show_summary() {
  log "Resumo final:"
  psql_system -c "select count(*) as clientes from clientes_api; select count(*) as parametros from parametros; select count(*) as planos from planos; select count(*) as recursos from recursos_plano; select count(*) as planos_recursos from planos_recursos;"
  psql_viacep -c "select count(*) as ufs from uf_ibge; select count(*) as municipios from municipio_ibge;"
  psql_system -c "select c.email, p.slug as plano, a.status, a.proximo_vencimento, a.data_fim from assinaturas a join clientes_api c on c.id = a.cliente_id join planos p on p.id = a.plano_id where c.email = '$(sql_escape "$ADMIN_EMAIL")' and a.status = 'ativa' order by a.criado_em desc limit 1;"
}

main() {
  ensure_dependencies
  wait_for_api
  upsert_admin
  seed_planos
  seed_ibge
  ensure_admin_plan
  show_summary
  log "Seed concluído."
}

main "$@"
