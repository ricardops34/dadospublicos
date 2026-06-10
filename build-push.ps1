param(
  [string]$Tag = "latest",
  [switch]$NoCache
)

$Registry  = "bjsoftware"
$CacheFlag = if ($NoCache) { "--no-cache" } else { "" }

Write-Host "==> Build rfb-api:$Tag$(if ($NoCache) { ' (sem cache)' })"
docker build $CacheFlag -t "$Registry/rfb-api:$Tag" ./backend
if (-not $?) { exit 1 }

Write-Host "==> Build rfb-frontend:$Tag$(if ($NoCache) { ' (sem cache)' })"
docker build $CacheFlag -f ./frontend/Dockerfile.prod -t "$Registry/rfb-frontend:$Tag" ./frontend
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
