# Setup do VPS — BuscaDados

> **Domínios:** `buscadados.bjsoft.com.br` · `api.buscadados.bjsoft.com.br`
> **Stack:** Ubuntu 22.04 LTS recomendado

---

## Passo 1 — Pré-requisitos no VPS

```bash
# Atualizar o sistema
sudo apt update && sudo apt upgrade -y

# Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Docker Compose Plugin
sudo apt install -y docker-compose-plugin

# Node.js 20 (para build do Angular no servidor, opcional)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Nginx + Certbot
sudo apt install -y nginx certbot python3-certbot-nginx
```

---

## Passo 2 — DNS (no painel da Bjsoft / registrador)

Configure dois registros **A** apontando para o IP do VPS:

| Nome | Tipo | Valor |
|---|---|---|
| `buscadados` | A | `<IP_DO_VPS>` |
| `api.buscadados` | A | `<IP_DO_VPS>` |

> Aguardar propagação DNS (5–30 min) antes de continuar.

---

## Passo 3 — Clonar o repositório

```bash
cd /opt

sudo git clone \
  --branch master \
  --single-branch \
  https://github.com/ricardops34/dadospublicos.git \
  buscadados

sudo chown -R $USER:$USER /opt/buscadados
cd /opt/buscadados
```

> **Branch de referência:** `refs/heads/master`
> Para usar uma tag específica (ex: v1.0.0): substitua `--branch master` por `--branch refs/tags/v1.0.0`

---

## Passo 4 — Configurar variáveis de ambiente

```bash
cp .env.example .env
nano .env
```

Preencher:
```env
DB_HOST=postgres
DB_PORT=5432
DB_NAME=dados_rfb
DB_USER=rfb_user
DB_PASSWORD=SENHA_FORTE_AQUI
PORT=3001
ADMIN_KEY=CHAVE_ADMIN_FORTE_AQUI
ETL_DOWNLOAD_DIR=/app/etl-data/downloads
ETL_EXTRACT_DIR=/app/etl-data/extraidos
```

---

## Passo 5 — Certificados SSL (Let's Encrypt)

```bash
# Primeiro, subir nginx SEM SSL para validar o domínio
sudo certbot certonly --nginx \
  -d buscadados.bjsoft.com.br \
  -d api.buscadados.bjsoft.com.br \
  --email SEU@EMAIL.COM \
  --agree-tos \
  --non-interactive
```

---

## Passo 6 — Deploy

```bash
cd /opt/buscadados
bash scripts/deploy.sh
```

O script faz automaticamente:
1. Build do Angular com `--configuration production`
2. Copia os arquivos para `/var/www/buscadados/frontend`
3. Sobe API + Postgres via `docker compose up -d --build`
4. Instala e recarrega a configuração do nginx

---

## Passo 7 — Verificar

```bash
# Status dos containers
docker compose ps

# Health da API
curl https://api.buscadados.bjsoft.com.br/health

# Teste de consulta CNPJ (gratuito, sem token)
curl https://api.buscadados.bjsoft.com.br/cnpj/27865757000102
```

---

## Atualização depois do deploy inicial

```bash
cd /opt/buscadados

# Atualiza a branch master (padrão)
git pull origin refs/heads/master
bash scripts/deploy.sh

# --- Alternativas ---
# Para fazer deploy de uma branch específica:
# git fetch origin refs/heads/develop:refs/heads/develop
# git checkout develop && bash scripts/deploy.sh

# Para fazer deploy de uma tag (release):
# git fetch --tags
# git checkout refs/tags/v1.0.0 && bash scripts/deploy.sh
```

---

## Renovação automática do SSL

```bash
# Certbot já instala um cron/timer, mas verifique:
sudo certbot renew --dry-run
```

---

## Estrutura final no VPS

```
/opt/buscadados/           ← repositório
/var/www/buscadados/
  └── frontend/            ← dist Angular (servido pelo nginx)
/etc/nginx/sites-available/
  └── buscadados.conf      ← configuração dos dois domínios
/etc/letsencrypt/live/
  ├── buscadados.bjsoft.com.br/
  └── api.buscadados.bjsoft.com.br/
```
