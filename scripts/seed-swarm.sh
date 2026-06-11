#!/usr/bin/env bash
set -Eeuo pipefail

# Seed para ambiente Swarm/Portainer

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

log() { printf '\n[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1"; }
fail() { printf '\n[ERRO] %s\n' "$1" >&2; exit 1; }

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

wait_for_api() {
  local cid; cid="$(find_container "rfb_api")"
  [[ -n "$cid" ]] || fail "Container api não encontrado."

  log "Aguardando API em ${API_BASE_URL}/health..."
  for i in $(seq 1 60); do
    if docker exec "$cid" wget -qO- http://localhost:3001/health >/dev/null 2>&1; then
      log "API disponível."
      return 0
    fi
    sleep 2
  done

  fail "API não ficou disponível."
}

run_seed() {
  local cid; cid="$(find_container "rfb_api")"
  [[ -n "$cid" ]] || fail "Container api não encontrado. Verifique se está rodando."

  log "Executando seed canônico da aplicação..."
  docker exec -i \
    -e ADMIN_EMAIL="$ADMIN_EMAIL" \
    -e ADMIN_PASSWORD="$ADMIN_PASSWORD" \
    -e ADMIN_NAME="$ADMIN_NAME" \
    -e ADMIN_PLAN_SLUG="$ADMIN_PLAN_SLUG" \
    -e ADMIN_PLAN_EXPIRY="$ADMIN_PLAN_EXPIRY" \
    -e FORCE_IBGE_SYNC="$FORCE_IBGE_SYNC" \
    "$cid" node seed.js
}

show_summary() {
  log "Resumo final:"
  psql_system -c "select count(*) as usuarios from usuarios; select count(*) as clientes from clientes; select count(*) as planos from planos; select count(*) as recursos from recursos_plano; select count(*) as perfis from perfis; select count(*) as modulos from menu_modulos; select count(*) as rotinas from menu_rotinas; select count(*) as perfil_rotinas from perfil_rotinas;"
  psql_viacep -c "select count(*) as ufs from uf_ibge; select count(*) as municipios from municipio_ibge;"
  psql_system -v admin_email="$ADMIN_EMAIL" -c "select u.email, u.perfil, u.cliente_id, p.slug as plano, a.status, a.proximo_vencimento, a.data_fim from assinaturas a join usuarios u on u.id = a.usuario_id join planos p on p.id = a.plano_id where u.email = :'admin_email' and a.status = 'ativa' order by a.criado_em desc limit 1;"
}

main() {
  wait_for_api
  run_seed
  show_summary
  log "Seed concluído."
}

main "$@"
