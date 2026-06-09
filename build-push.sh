#!/usr/bin/env bash
# Build e push das imagens para Docker Hub (bjsoftware)
# Uso: ./build-push.sh [tag]   (default: latest)

set -e

TAG=${1:-latest}
REGISTRY="bjsoftware"

echo "==> Build rfb-api:$TAG"
docker build -t $REGISTRY/rfb-api:$TAG ./backend

echo "==> Build rfb-frontend:$TAG"
docker build -t $REGISTRY/rfb-frontend:$TAG ./frontend

echo "==> Push rfb-api:$TAG"
docker push $REGISTRY/rfb-api:$TAG

echo "==> Push rfb-frontend:$TAG"
docker push $REGISTRY/rfb-frontend:$TAG

echo ""
echo "Imagens publicadas:"
echo "  docker.io/$REGISTRY/rfb-api:$TAG"
echo "  docker.io/$REGISTRY/rfb-frontend:$TAG"
