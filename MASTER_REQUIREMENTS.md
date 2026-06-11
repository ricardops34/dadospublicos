# MASTER REQUIREMENTS

## 1. Propósito do produto

O `dadospublicos` é uma plataforma para comercialização e consumo de dados públicos, com foco principal em consultas de CNPJ, enriquecimento cadastral e operação comercial de clientes assinantes.

O produto combina:

- API pública para consumo autenticado por token
- portal autenticado para clientes
- portal administrativo para operação interna
- landing page pública com planos, exemplos e documentação
- rotinas operacionais de ETL, billing, notificações e analytics

## 2. Objetivos principais

- Disponibilizar consultas de dados públicos de forma simples, estável e escalável
- Permitir gestão comercial completa de clientes, planos, assinaturas e faturas
- Oferecer ao cliente autonomia para acessar token, consumo, plano e cadastro
- Manter operação administrativa centralizada em um portal interno
- Preservar separação clara entre domínio público, domínio comercial e infraestrutura operacional

## 3. Perfis de acesso

### 3.1. Visitante público

Pode acessar:

- landing page
- documentação pública
- planos e exemplos de uso

Não pode acessar:

- portal autenticado
- funcionalidades administrativas

### 3.2. Cliente

Pode acessar apenas dados e operações do próprio contexto:

- dashboard
- meu plano
- minhas faturas
- minha conta
- meu token
- onboarding / primeiro acesso
- painel 360, quando aplicável ao plano

Regras:

- acesso autenticado por portal
- consumo da API via token do cliente
- permissões determinadas pelo plano contratado

### 3.3. Administrador da plataforma

Pode operar:

- clientes
- planos
- recursos e associação de recursos
- assinaturas
- faturas
- parâmetros
- ETL
- analytics
- notificações e configurações operacionais
- painel 360 administrativo

## 4. Regra estrutural de negócio

### 4.1. Cliente e usuário são entidades distintas

O sistema deve tratar:

- `Cliente` como contratante do serviço
- `Usuário` como operador que acessa o sistema em nome do cliente

Regras obrigatórias:

- um cliente pode possuir um ou vários usuários
- todo usuário pertence a um único cliente
- não existe usuário sem cliente
- o token de API pertence ao cliente, não ao usuário
- permissões de negócio são controladas pelo plano do cliente

### 4.2. Administrador do cliente

O primeiro usuário criado no fluxo de cadastro do cliente é o administrador do cliente.

Esse papel pode:

- gerenciar outros usuários do mesmo cliente
- visualizar dados do cliente
- gerenciar o token compartilhado do cliente

Esse papel não deve ser confundido com o administrador da plataforma.

## 5. Escopo funcional macro

### 5.1. Produto público

- consulta completa de CNPJ
- consulta por raiz de CNPJ
- pesquisa avançada
- geocode / CEP / apoio IBGE
- documentação pública da API
- exemplos de integração
- landing page comercial

### 5.2. Plataforma comercial

- cadastro e manutenção de clientes
- login e autenticação do portal
- gestão de planos
- gestão de recursos por plano
- assinaturas
- faturamento
- token de API
- notificações
- parâmetros operacionais

### 5.3. Operação interna

- ETL e histórico das cargas
- analytics da landing page
- configuração de e-mail
- integrações operacionais
- logs e suporte à operação

### 5.4. Funcionalidade vertical

- painel 360 para enriquecimento / importação / visão comercial

## 6. Arquitetura funcional esperada

O sistema é composto por:

- frontend Angular único
- backend NestJS modular
- PostgreSQL com múltiplos contextos
- Redis para cache e apoio operacional
- integrações externas como IBGE, SMTP, PIX e geocode

Diretrizes:

- frontend e backend devem permanecer desacoplados por API
- PO-UI é o padrão visual prioritário no frontend
- guards e autenticação devem controlar acesso por perfil e contexto
- novas regras de negócio devem respeitar a separação entre domínio público e domínio comercial

## 7. Módulos centrais do domínio

### 7.1. Backend

- `cnpj`
- `cnpj-raiz`
- `pesquisa`
- `geocode`
- `consumo`
- `health`
- `planos`
- `clientes`
- `assinaturas`
- `faturas`
- `portal`
- `notificacoes`
- `parametros`
- `inter-pix`
- `etl`
- `analytics-lp`
- `suporte`
- `email`
- `redis-cache`
- `access-log`
- `auth`
- `admin`
- `painel-360`

### 7.2. Frontend

- landing
- docs
- legal
- login
- portal-shell
- dashboard
- parâmetros
- áreas do cliente
- áreas do admin

## 8. Regras técnicas obrigatórias

- o frontend deve usar Angular `21.2.x`
- o frontend deve usar PO-UI v21
- ícones devem usar Animalia Icons (`an an-*`)
- em componentes standalone Angular com PO-UI, usar `PoModule`
- priorizar comportamento e layout padrão do PO-UI
- evitar customizações visuais quando houver componente padrão equivalente

## 9. Diretrizes de evolução

- preservar separação entre dados públicos, produto e base auxiliar
- documentar toda nova regra de negócio relevante
- manter consistência entre portal, billing e permissões por plano
- não mover regra crítica de negócio para a camada visual
- tratar integrações externas como adaptadores de borda

## 10. Documentos de apoio

Este documento deve ser lido em conjunto com:

- `PRD.md`
- `docs/frontend.md`
- `docs/modulos.md`
- `docs/arquitetura.md`
- `docs/regra-cliente-usuario.md`
