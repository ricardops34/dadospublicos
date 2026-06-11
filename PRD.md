# PRD - V1

## 1. Visão do produto

A V1 do `dadospublicos` entrega uma plataforma funcional para vender, operar e consumir dados públicos por assinatura, com experiência web unificada para visitantes, clientes e administradores.

O foco da V1 é colocar em produção um fluxo completo e utilizável, cobrindo:

- aquisição e apresentação comercial
- autenticação
- assinatura e cobrança
- consumo da API por token
- autosserviço básico do cliente
- operação administrativa essencial

## 2. Problema que a V1 resolve

Empresas precisam consultar e consumir dados públicos de forma prática, com previsibilidade comercial e acesso controlado por plano.

A V1 resolve isso oferecendo:

- uma API consumível por token
- uma área do cliente para acompanhar conta, plano e uso
- uma área administrativa para operar clientes, planos, faturas e cargas

## 3. Público-alvo

### 3.1. Cliente assinante

Empresa ou profissional que contrata acesso à API e precisa:

- consultar dados públicos
- obter e regenerar token
- acompanhar consumo
- visualizar plano e cobranças
- manter dados cadastrais

### 3.2. Operação interna

Time administrativo/comercial que precisa:

- cadastrar e manter clientes
- definir planos e recursos
- acompanhar assinaturas e faturas
- operar ETL e parâmetros

## 4. Objetivos da V1

- publicar uma jornada funcional de assinatura e uso da plataforma
- permitir consumo autenticado da API por cliente
- permitir operação administrativa do negócio sem depender de ajustes manuais no banco
- centralizar portal do cliente e administração em um frontend único

## 5. Escopo incluído na V1

### 5.1. Landing pública

- hero e proposta de valor
- seção de planos
- seção de exemplos de uso
- documentação pública
- CTA de cadastro / contratação

### 5.2. Autenticação e acesso

- login do portal
- controle de acesso por perfil
- recuperação / troca de senha
- verificação de e-mail quando aplicável

### 5.3. Portal do cliente

- dashboard inicial
- primeiro acesso / onboarding
- minha conta
- meu plano
- minhas faturas
- meu token
- notificações
- painel 360, quando liberado por recurso/plano

### 5.4. Portal administrativo

- gestão de clientes
- gestão de planos
- gestão de recursos e recursos por plano
- gestão de assinaturas
- gestão de faturas
- parâmetros operacionais
- ETL
- configuração de e-mail
- analytics essenciais
- operação administrativa do painel 360

### 5.5. API e backend operacional

- consultas de CNPJ
- consulta por raiz
- pesquisa avançada
- geocode / CEP / apoio IBGE
- autenticação do portal
- emissão e uso de token por cliente
- monitoramento de consumo

## 6. Fora de escopo da V1

Itens explicitamente fora da V1:

- leads como módulo de produto
- atendimentos como módulo de produto
- diretor comercial como perfil dedicado de negócio

Também ficam fora da V1, salvo necessidade já implementada e indispensável à operação:

- expansões grandes de CRM
- workflows comerciais complexos além do necessário para operar clientes e assinaturas
- customizações visuais fora do padrão PO-UI

## 7. Regras de negócio críticas

- cliente e usuário são entidades distintas
- token de API pertence ao cliente
- permissões são controladas pelo plano do cliente
- usuários do mesmo cliente compartilham o mesmo contexto de acesso do plano
- administrador da plataforma é diferente de administrador do cliente

## 8. Requisitos não funcionais

- frontend em Angular 21 + PO-UI v21
- backend em NestJS 11 + TypeORM
- PostgreSQL 16
- Redis 7
- Node.js 20.x
- uso prioritário de componentes padrão PO-UI
- uso obrigatório de Animalia Icons (`an an-*`)

## 9. Critérios de sucesso da V1

A V1 é considerada bem-sucedida quando:

- um visitante consegue entender o produto e acessar a documentação
- um cliente consegue autenticar, visualizar conta, plano, token e consumo
- a API responde ao consumo autenticado por token
- a operação interna consegue administrar clientes, planos, assinaturas e faturas
- o sistema mantém separação consistente entre cliente, usuário e permissões por plano

## 10. Referências

- `MASTER_REQUIREMENTS.md`
- `docs/frontend.md`
- `docs/modulos.md`
- `docs/arquitetura.md`
- `docs/regra-cliente-usuario.md`
