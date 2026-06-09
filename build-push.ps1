param([string]$Tag = "latest")

$Registry = "bjsoftware"

Write-Host "==> Build rfb-api:$Tag"
docker build -t "$Registry/rfb-api:$Tag" ./backend
if (-not $?) { exit 1 }

Write-Host "==> Build rfb-frontend:$Tag"
docker build -f ./frontend/Dockerfile.prod -t "$Registry/rfb-frontend:$Tag" ./frontend
if (-not $?) { exit 1 }

Write-Host "==> Push rfb-api:$Tag"
docker push "$Registry/rfb-api:$Tag"
if (-not $?) { exit 1 }

Write-Host "==> Push rfb-frontend:$Tag"
docker push "$Registry/rfb-frontend:$Tag"
if (-not $?) { exit 1 }

Write-Host ""
Write-Host "Imagens publicadas:"
Write-Host "  docker.io/$Registry/rfb-api:$Tag"
Write-Host "  docker.io/$Registry/rfb-frontend:$Tag"
