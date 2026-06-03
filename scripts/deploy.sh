#!/bin/bash
# ============================================================
# deploy.sh — BuscaDados / RFB Data Service
# Uso: bash deploy.sh
# Branch padrão: refs/heads/master
# Para outra branch: BRANCH=refs/heads/develop bash deploy.sh
# Para uma tag:      BRANCH=refs/tags/v1.0.0 bash deploy.sh
# Pré-requisitos no VPS: Docker, Docker Compose, Nginx, Certbot, Node 20
# ============================================================
set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_OUT="/var/www/buscadados/frontend"
NGINX_CONF="/etc/nginx/sites-available/buscadados.conf"
NGINX_LINK="/etc/nginx/sites-enabled/buscadados.conf"
BRANCH="${BRANCH:-refs/heads/master}"

echo "════════════════════════════════════════════"
echo "  BuscaDados — Deploy"
echo "════════════════════════════════════════════"

# ── 1. Build do frontend Angular ─────────────────────────────
echo ""
echo "▶ [1/4] Build do frontend..."
cd "$REPO_DIR/frontend"
npm ci --silent
npm run build -- --configuration production
echo "  ✔ Build concluído"

# ── 2. Copiar dist para /var/www ──────────────────────────────
echo ""
echo "▶ [2/4] Copiando frontend para $FRONTEND_OUT..."
mkdir -p "$FRONTEND_OUT"
rm -rf "$FRONTEND_OUT"/*
cp -r dist/frontend/browser/* "$FRONTEND_OUT"/
echo "  ✔ Frontend copiado"

# ── 3. Subir API + Postgres via Docker Compose ────────────────
echo ""
echo "▶ [3/4] Subindo API e banco de dados..."
cd "$REPO_DIR"
docker compose pull --quiet
docker compose up -d --build
echo "  ✔ Containers rodando"

# ── 4. Configurar nginx ───────────────────────────────────────
echo ""
echo "▶ [4/4] Configurando nginx..."
cp "$REPO_DIR/nginx/buscadados.conf" "$NGINX_CONF"

if [ ! -L "$NGINX_LINK" ]; then
  ln -s "$NGINX_CONF" "$NGINX_LINK"
fi

nginx -t && systemctl reload nginx
echo "  ✔ Nginx recarregado"

echo ""
echo "════════════════════════════════════════════"
echo "  Deploy concluído!"
echo "  Frontend: https://buscadados.bjsoft.com.br"
echo "  API:      https://api.buscadados.bjsoft.com.br"
echo "  Docs:     https://api.buscadados.bjsoft.com.br/docs"
echo "════════════════════════════════════════════"
