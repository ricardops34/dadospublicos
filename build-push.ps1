param(
  [string]$Tag = "latest",
  [switch]$NoCache,
  [string]$Ref
)

$ErrorActionPreference = "Stop"
$WorkflowFile = "docker-build-push.yml"

function Fail([string]$Message) {
  Write-Error $Message
  exit 1
}

function Require-Command([string]$CommandName, [string]$HelpMessage) {
  if (-not (Get-Command $CommandName -ErrorAction SilentlyContinue)) {
    Fail $HelpMessage
  }
}

function Get-RepositorySlug() {
  $remoteUrl = (git remote get-url origin).Trim()
  if (-not $remoteUrl) {
    Fail "Remote 'origin' não encontrado. Configure o repositório Git antes de disparar o build remoto."
  }

  if ($remoteUrl -match 'github\.com[:/](.+?)(?:\.git)?$') {
    return $matches[1]
  }

  Fail "Não foi possível identificar owner/repo a partir de '$remoteUrl'."
}

function Get-CurrentRef([string]$RequestedRef) {
  if ($RequestedRef) {
    return $RequestedRef
  }

  $branch = (git branch --show-current).Trim()
  if (-not $branch) {
    Fail "HEAD destacado detectado. Informe a ref explicitamente com -Ref <branch-ou-tag>."
  }

  return $branch
}

function Assert-CleanWorkingTree() {
  $status = git status --porcelain
  if ($status) {
    Fail "Há mudanças locais não commitadas. Faça commit ou stash antes de disparar o build remoto."
  }
}

function Assert-UpstreamPushed([string]$TargetRef) {
  $upstream = ""

  try {
    $upstream = (git rev-parse --abbrev-ref --symbolic-full-name "@{u}" 2>$null).Trim()
  } catch {
    $upstream = ""
  }

  if (-not $upstream) {
    Fail "A branch '$TargetRef' não possui upstream. Execute 'git push -u origin $TargetRef' antes do build remoto."
  }

  $ahead = [int](git rev-list --count "$upstream..HEAD")
  if ($ahead -gt 0) {
    Fail "Existem $ahead commit(s) local(is) sem push. Execute 'git push' antes de disparar o build remoto."
  }
}

Require-Command "git" "Git não encontrado no PATH."
Require-Command "gh" "GitHub CLI ('gh') não encontrado. Instale em https://cli.github.com/ e autentique com 'gh auth login'."

$repo = Get-RepositorySlug
$targetRef = Get-CurrentRef -RequestedRef $Ref

Assert-CleanWorkingTree
Assert-UpstreamPushed -TargetRef $targetRef

Write-Host "==> Validando autenticação do GitHub CLI"
gh auth status | Out-Null
if (-not $?) {
  Fail "GitHub CLI sem autenticação. Execute 'gh auth login' e tente novamente."
}

$noCacheValue = if ($NoCache) { "true" } else { "false" }

Write-Host "==> Disparando workflow remoto '$WorkflowFile'"
Write-Host "    Repo: $repo"
Write-Host "    Ref:  $targetRef"
Write-Host "    Tag:  $Tag"
Write-Host "    Cache desabilitado: $noCacheValue"

gh workflow run $WorkflowFile `
  --repo $repo `
  --ref $targetRef `
  --field image_tag=$Tag `
  --field no_cache=$noCacheValue

if (-not $?) {
  Fail "Falha ao disparar o workflow remoto."
}

Start-Sleep -Seconds 3

$runJson = gh run list `
  --repo $repo `
  --workflow $WorkflowFile `
  --branch $targetRef `
  --limit 1 `
  --json databaseId,displayTitle,status,conclusion,url 2>$null

if ($runJson) {
  $run = $runJson | ConvertFrom-Json | Select-Object -First 1

  if ($run) {
    Write-Host ""
    Write-Host "Workflow disparado com sucesso:"
    Write-Host "  Run ID: $($run.databaseId)"
    Write-Host "  Título: $($run.displayTitle)"
    Write-Host "  Status: $($run.status)"
    Write-Host "  URL:    $($run.url)"
    exit 0
  }
}

Write-Host ""
Write-Host "Workflow disparado com sucesso."
Write-Host "Acompanhe em: https://github.com/$repo/actions/workflows/$WorkflowFile"
