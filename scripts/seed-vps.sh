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

psql_system() {
  docker compose exec -T postgres psql -U "$DB_USER" -d "$DB_SISTEMA_NAME" "$@"
}

psql_viacep() {
  docker compose exec -T postgres psql -U "$DB_USER" -d "$DB_VIACEP_NAME" "$@"
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

run_seed() {
  log "Executando seed canônico da aplicação..."
  docker compose exec -T \
    -e ADMIN_EMAIL="$ADMIN_EMAIL" \
    -e ADMIN_PASSWORD="$ADMIN_PASSWORD" \
    -e ADMIN_NAME="$ADMIN_NAME" \
    -e ADMIN_PLAN_SLUG="$ADMIN_PLAN_SLUG" \
    -e ADMIN_PLAN_EXPIRY="$ADMIN_PLAN_EXPIRY" \
    -e FORCE_IBGE_SYNC="$FORCE_IBGE_SYNC" \
    api node seed.js
}

show_summary() {
  log "Resumo final:"
  psql_system -c "select count(*) as usuarios from usuarios; select count(*) as clientes from clientes; select count(*) as parametros from parametros; select count(*) as planos from planos; select count(*) as recursos from recursos_plano; select count(*) as planos_recursos from planos_recursos; select count(*) as perfis from perfis; select count(*) as modulos from menu_modulos; select count(*) as rotinas from menu_rotinas; select count(*) as perfil_rotinas from perfil_rotinas;"
  psql_viacep -c "select count(*) as ufs from uf_ibge; select count(*) as municipios from municipio_ibge;"
  psql_system -v admin_email="$ADMIN_EMAIL" -c "select u.email, u.perfil, u.cliente_id, p.slug as plano, a.status, a.proximo_vencimento, a.data_fim from assinaturas a join usuarios u on u.id = a.usuario_id join planos p on p.id = a.plano_id where u.email = :'admin_email' and a.status = 'ativa' order by a.criado_em desc limit 1;"
}

main() {
  ensure_dependencies
  wait_for_api
  run_seed
  show_summary
  log "Seed concluído."
}

main "$@"
