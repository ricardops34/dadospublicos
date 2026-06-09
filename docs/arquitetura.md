# Arquitetura do Projeto

Este documento descreve a arquitetura técnica do sistema como ela existe hoje, com foco em reaproveitamento para novos projetos.

## 1. Visão geral

O projeto é uma plataforma full stack para comercialização e consumo de dados públicos de CNPJ, com duas frentes acopladas:

- produto público: landing, API, documentação e planos
- plataforma operacional: portal, billing, ETL, analytics, suporte e administração

Arquitetura macro:

```text
Usuarios publicos / clientes / admins
            |
            v
Frontend Angular + PO-UI
            |
            v
Backend NestJS
   |         |         |
   v         v         v
PostgreSQL  Redis   Servicos externos
  (3 DBs)            (IBGE, SMTP, CRM, PIX, geocode)
```

## 2. Separação por contextos

### Dados públicos

Responsável por:

- consulta CNPJ
- consulta por raiz
- pesquisa avançada
- consumo por token
- geocode/CEP
- mapa de prospecção

Esse contexto opera sobre o banco `dados_rfb` e apoia a API vendida ao mercado.

### Plataforma comercial

Responsável por:

- cadastro de clientes
- login e portal
- planos e recursos
- assinaturas
- faturas
- parâmetros
- notificações
- analytics da landing

Esse contexto opera majoritariamente sobre o banco `buscadados`.

### Base auxiliar geográfica

Responsável por:

- UFs IBGE
- municípios IBGE
- apoio ao enriquecimento por CEP

Esse contexto usa `dados_viacep`.

## 3. Backend

O backend é um monólito modular em NestJS. A composição central está em [backend/src/app.module.ts](/C:/Ricardo/dadospublicos/backend/src/app.module.ts:1).

### Características arquiteturais

- módulos desacoplados por domínio
- TypeORM com `autoLoadEntities`
- múltiplas conexões PostgreSQL
- Redis para rate limit e cache operacional
- Swagger público e interno
- guards para autenticação, perfil e recurso
- seed operacional via contexto Nest

### Conexões de banco

- default: `dados_rfb`
- `buscadados`
- `viacep`

Essa decisão permite separar base de produto, base pública e base auxiliar sem quebrar o monólito.

## 4. Frontend

O frontend é uma SPA Angular única.

### Blocos principais

- landing pública
- páginas legais
- documentação
- login unificado
- portal autenticado

### Decisões

- um único app Angular reduz duplicação de autenticação, tema e serviços
- PO-UI é o padrão visual prioritário
- guards controlam acesso por autenticação, onboarding e perfil

## 5. Persistência

### Banco `dados_rfb`

Contém os dados públicos da Receita e tabelas relacionadas ao domínio de consulta.

### Banco `buscadados`

Contém as entidades do produto, como:

- `ClienteApi`
- `Plano`
- `Assinatura`
- `Fatura`
- `Token`
- `Parametro`
- `Notificacao`
- `EventoLp`
- `VisitaLp`
- `Painel360*`

### Banco `dados_viacep`

Contém as tabelas auxiliares de geografia e apoio ao enrich de CEP e IBGE.

## 6. Segurança e autenticação

Há dois modelos principais:

- token de API para consumo da API pública
- JWT para acesso ao portal

Além disso:

- `ADMIN_KEY` protege rotas administrativas específicas
- `docs-admin` exige chave administrativa
- módulos do portal usam guards próprios

## 7. Integrações externas

O projeto já nasce preparado para integrações com:

- IBGE
- SMTP
- CRM externo
- Inter PIX
- serviços de geocode/CEP

Ao reutilizar esta arquitetura em outro projeto, trate integrações como adaptadores de borda. O domínio interno deve continuar utilizável mesmo que uma integração mude.

## 8. Estratégia de containerização

### Local

`docker-compose.yml` sobe:

- banco
- redis
- api
- frontend
- pgadmin

### Produção

`docker-compose.portainer.yml` parte do princípio de:

- imagens já publicadas
- Traefik gerenciando TLS e roteamento
- redes externas pré-existentes

## 9. Armazenamento ETL

O ETL não vive apenas dentro do banco. Os artefatos de download e extração são persistidos em diretórios montados no host.

Essa é uma decisão arquitetural importante:

- evita perder insumos em rebuild
- facilita backup
- reduz custo de reprocessamento

## 10. Regras para replicação em novos projetos

Ao usar esta arquitetura como base:

- preserve a separação entre dados públicos, dados de produto e base auxiliar
- não acople frontend a endpoints administrativos improvisados
- mantenha seeds idempotentes
- documente toda variável de ambiente nova
- trate scripts operacionais como parte da arquitetura, não como detalhe
