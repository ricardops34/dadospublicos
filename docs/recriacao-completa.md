# Recriação Completa do Projeto

Este documento é a base para recriar o projeto de forma funcional e completa, usando este repositório como referência de arquitetura, stack, estrutura e operação.

O objetivo aqui não é apenas "subir a aplicação", mas permitir que outro time recrie:

- a infraestrutura local e de produção
- a estrutura de bancos
- a API NestJS
- o frontend Angular com PO-UI
- o fluxo ETL
- os seeds e dados mínimos de operação
- os fluxos de build, deploy e teste

Use este guia em conjunto com os documentos específicos já existentes em [database.md](/C:/Ricardo/dadospublicos/docs/database.md), [api.md](/C:/Ricardo/dadospublicos/docs/api.md), [etl.md](/C:/Ricardo/dadospublicos/docs/etl.md), [frontend.md](/C:/Ricardo/dadospublicos/docs/frontend.md), [planos.md](/C:/Ricardo/dadospublicos/docs/planos.md), [cep.md](/C:/Ricardo/dadospublicos/docs/cep.md), [pix-inter.md](/C:/Ricardo/dadospublicos/docs/pix-inter.md) e [vps-setup.md](/C:/Ricardo/dadospublicos/docs/vps-setup.md).

## 1. Resultado esperado

Ao final da recriação, o projeto precisa entregar:

- API pública de consulta de dados CNPJ
- portal autenticado para clientes e admins
- gerenciamento de planos, assinaturas, faturas e consumo
- ETL para ingestão e atualização de dados
- suporte a geolocalização por CEP e mapa de prospecção
- landing page comercial integrada ao backend
- documentação Swagger pública e interna
- deploy via Docker para ambiente local e via imagens/Traefik para produção

## 2. Stack oficial do projeto

| Camada | Tecnologia |
|---|---|
| Backend | NestJS 11 + TypeScript |
| ORM | TypeORM 0.3.x |
| Frontend | Angular 21.2.x |
| UI | PO-UI v21 |
| Banco relacional | PostgreSQL 16 |
| Cache / rate limit | Redis 7 |
| Runtime | Node.js 20 |
| Containerização | Docker + Docker Compose |
| Deploy produção | Docker Swarm/Portainer + Traefik |

## 3. Estrutura de alto nível do repositório

```text
dadospublicos/
|-- backend/                  # API NestJS
|-- frontend/                 # SPA Angular + PO-UI
|-- docs/                     # Documentação funcional e técnica
|-- etl-data/                 # Downloads e extrações do ETL no host
|-- nginx/                    # Artefatos de proxy quando aplicável
|-- scripts/                  # Scripts operacionais
|-- docker-compose.yml        # Ambiente local completo
|-- docker-compose.portainer.yml
|-- init-db.sh                # Criação dos bancos auxiliares
|-- build-push.sh / .ps1      # Build e push de imagens
```

## 4. Arquitetura que deve ser recriada

Este projeto usa três bancos PostgreSQL separados dentro do mesmo servidor:

- `dados_rfb`: base principal dos dados públicos da Receita
- `buscadados`: base da aplicação comercial e do portal
- `dados_viacep`: base auxiliar para UFs, municípios IBGE e cache/apoio de CEP

O backend conecta nos três bancos em paralelo por meio do [backend/src/app.module.ts](/C:/Ricardo/dadospublicos/backend/src/app.module.ts:1).

O frontend é uma SPA única Angular com:

- landing page pública
- documentação pública
- login unificado
- portal autenticado para cliente e admin

As rotas principais estão centralizadas em [frontend/src/app/app-routing-module.ts](/C:/Ricardo/dadospublicos/frontend/src/app/app-routing-module.ts:1).

## 5. Ordem recomendada de recriação

Siga esta ordem. Ela reduz retrabalho e evita subir a aplicação sem dependências prontas.

1. Preparar pré-requisitos da máquina
2. Clonar o repositório e revisar a documentação
3. Configurar variáveis de ambiente
4. Subir PostgreSQL e Redis
5. Garantir criação dos três bancos
6. Subir backend
7. Executar seed inicial de planos, admin e IBGE
8. Subir frontend
9. Validar endpoints, Swagger e login
10. Validar testes
11. Configurar imagens e deploy de produção

## 6. Pré-requisitos

### Ambiente local

- Docker
- Docker Compose Plugin
- Node.js 20
- npm
- Git

### Ambiente de produção

- Docker Engine
- rede reversa com Traefik ou equivalente
- DNS apontando para frontend e API
- volume persistente para banco e ETL

## 7. Variáveis de ambiente

A base está em [.env.example](/C:/Ricardo/dadospublicos/.env.example:1). Ao recriar o projeto, copie para `.env` e substitua todos os valores por dados do novo ambiente.

```bash
cp .env.example .env
```

Grupos principais:

- Banco: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_SISTEMA_NAME`, `DB_VIACEP_NAME`, `DB_USER`, `DB_PASSWORD`
- API: `PORT`, `ADMIN_KEY`, `JWT_SECRET`
- ETL: `ETL_DATA_DIR`
- Suporte: `SUPORTE_WHATSAPP`, `SUPORTE_ATENDENTE`, `SUPORTE_MSG`, `SUPORTE_EMAIL`
- SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`
- Integração externa: `CRM_API_URL`, `CRM_API_TOKEN`

## 8. Subida local com Docker Compose

O ambiente local de referência está em [docker-compose.yml](/C:/Ricardo/dadospublicos/docker-compose.yml:1).

### Serviços previstos

- `postgres`
- `redis`
- `api`
- `frontend`
- `pgadmin`

### Subida padrão

```bash
docker compose up -d --build
```

### Portas padrão

| Serviço | Porta |
|---|---|
| Frontend | `4200` |
| API | `3001` |
| PostgreSQL | `5433` no host |
| Redis | `6379` |
| PgAdmin | `5050` |

## 9. Criação dos bancos auxiliares

O PostgreSQL sobe inicialmente com `dados_rfb`, e o script [init-db.sh](/C:/Ricardo/dadospublicos/init-db.sh:1) cria:

- `buscadados`
- `dados_viacep`

Sem isso, a aplicação não inicializa corretamente, porque o backend assume as três conexões ativas.

## 10. Backend

### Objetivo

Expor:

- API pública comercializável
- endpoints internos administrativos
- autenticação do portal
- ETL e rotinas de apoio
- documentação Swagger pública e interna

### Comandos de desenvolvimento

```bash
cd backend
npm install
npm run start:dev
```

### Build

```bash
cd backend
npm run build
```

### Container

O build oficial está em [backend/Dockerfile](/C:/Ricardo/dadospublicos/backend/Dockerfile:1).

### Swagger

Configurado em [backend/src/main.ts](/C:/Ricardo/dadospublicos/backend/src/main.ts:1):

- `/docs`: documentação pública
- `/docs-admin`: documentação interna protegida por `x_admin_key`

## 11. Seed inicial

O projeto depende de dados mínimos para ficar funcional:

- planos
- recursos
- admin
- assinatura do admin
- UFs e municípios do IBGE

Há dois fluxos principais:

- script Node: [backend/seed.js](/C:/Ricardo/dadospublicos/backend/seed.js:1)
- script operacional de ambiente Docker: [scripts/seed-vps.sh](/C:/Ricardo/dadospublicos/scripts/seed-vps.sh:1)

### Quando usar cada um

- `backend/seed.js`: seed direto pela aplicação
- `scripts/seed-vps.sh`: seed operacional em ambiente com `docker compose`

### Resultado mínimo esperado do seed

- usuário admin ativo
- plano premium associado ao admin
- planos seeded
- dados IBGE carregados no banco auxiliar

## 12. Frontend

### Objetivo

Entregar em uma SPA:

- landing page
- login
- área do cliente
- área administrativa
- páginas legais
- documentação pública

### Desenvolvimento

```bash
cd frontend
npm install
npm start
```

### Build

```bash
cd frontend
npm run build
```

### Container de produção

Usa [frontend/Dockerfile.prod](/C:/Ricardo/dadospublicos/frontend/Dockerfile.prod:1), com build Angular e entrega estática por Nginx.

### Regras obrigatórias de UI

- usar PO-UI v21
- usar `PoModule` em componentes standalone
- usar ícones Animalia `an an-*`
- priorizar componentes nativos do PO-UI antes de customizar layout

## 13. ETL

O projeto reserva armazenamento persistente para ETL em `etl-data/`, com subpastas `downloads/` e `extraidos/`.

No `docker-compose.yml`, isso é mapeado do host para o container da API:

- `/app/etl-data/downloads`
- `/app/etl-data/extraidos`

Ao recriar este projeto, mantenha esse desacoplamento entre container e armazenamento físico. O ETL é volumoso e não deve depender do filesystem efêmero do container.

Detalhes completos do pipeline estão em [etl.md](/C:/Ricardo/dadospublicos/docs/etl.md).

## 14. Produção com Portainer / Swarm

O deploy de referência em produção está em [docker-compose.portainer.yml](/C:/Ricardo/dadospublicos/docker-compose.portainer.yml:1).

Características:

- imagens publicadas separadamente para `api` e `frontend`
- exposição via Traefik
- redes externas `network_db` e `network_public`
- TLS automatizado por resolver do Traefik
- volumes persistentes para ETL

Use esse arquivo como modelo para um novo projeto, ajustando:

- nomes das imagens
- hostnames
- redes
- variáveis de ambiente
- volumes

## 15. Build e publicação de imagens

Os scripts [build-push.sh](/C:/Ricardo/dadospublicos/build-push.sh:1) e [build-push.ps1](/C:/Ricardo/dadospublicos/build-push.ps1:1) devem ser tratados como referência para o fluxo de CI/CD ou publicação manual.

Ao recriar o projeto:

- padronize tags de imagem
- separe frontend e backend
- mantenha consistência entre `docker-compose.portainer.yml` e registry

## 16. Testes

### Backend

```bash
cd backend
npm test
```

O backend usa `node:test` com `ts-node/register/transpile-only`.

### Frontend

```bash
cd frontend
npm test
```

Ao recriar o projeto, o mínimo esperado é manter cobertura para:

- regras de negócio críticas
- guards
- controllers sensíveis
- seed e utilitários operacionais

## 17. Checklist de validação funcional

Depois da recriação, valide:

- `GET /health` responde
- `/docs` abre corretamente
- `/docs-admin` exige `x_admin_key`
- landing page carrega
- login funciona
- admin existe
- planos estão visíveis
- seed associou o plano do admin
- Redis está acessível
- bancos `dados_rfb`, `buscadados` e `dados_viacep` existem
- diretórios ETL persistem fora do ciclo de rebuild

## 18. Checklist de adaptação para novos projetos

Ao usar esta base para um novo produto, revise obrigatoriamente:

- nome do projeto e domínio
- branding, tema e textos da landing
- rotas e módulos expostos
- modelo de planos e recursos
- integrações externas
- política de autenticação
- variáveis SMTP e suporte
- estratégia ETL e retenção de dados
- regras de faturamento e PIX

## 19. Documentos de apoio recomendados

- [arquitetura.md](/C:/Ricardo/dadospublicos/docs/arquitetura.md)
- [modulos.md](/C:/Ricardo/dadospublicos/docs/modulos.md)
- [database.md](/C:/Ricardo/dadospublicos/docs/database.md)
- [api.md](/C:/Ricardo/dadospublicos/docs/api.md)
- [frontend.md](/C:/Ricardo/dadospublicos/docs/frontend.md)
- [etl.md](/C:/Ricardo/dadospublicos/docs/etl.md)
- [vps-setup.md](/C:/Ricardo/dadospublicos/docs/vps-setup.md)

## 20. Decisão de manutenção

Para que esta documentação continue útil como base de novos projetos:

- o guia de recriação deve refletir a arquitetura real
- os documentos específicos devem ser atualizados quando um módulo mudar
- mudanças de infraestrutura devem atualizar `docker-compose*.yml`, scripts e docs ao mesmo tempo

Se isso não for mantido, a documentação deixa de ser uma base de recriação e passa a ser apenas material histórico.
