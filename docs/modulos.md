# Mapa de Módulos

Este documento descreve os módulos existentes e o papel de cada um dentro da plataforma.

## 1. Backend

Os módulos abaixo estão registrados em [backend/src/app.module.ts](/C:/Ricardo/dadospublicos/backend/src/app.module.ts:1).

### API de dados públicos

| Módulo | Papel |
|---|---|
| `cnpj` | Consulta completa de um CNPJ |
| `cnpj-raiz` | Consulta paginada por raiz de CNPJ |
| `pesquisa` | Pesquisa avançada com filtros |
| `geocode` | CEP, coordenadas e sync IBGE |
| `consumo` | Monitoramento de consumo por token |
| `health` | Health check da API |

### Plataforma comercial

| Módulo | Papel |
|---|---|
| `planos` | Catálogo de planos e seed inicial |
| `clientes` | Cadastro, manutenção e onboarding do cliente |
| `assinaturas` | Ciclo de assinatura e token associado |
| `faturas` | Gestão financeira e histórico |
| `portal` | Login, JWT, troca de senha e experiência autenticada |
| `notificacoes` | Avisos do sistema e do portal |
| `parametros` | Configurações operacionais persistidas |
| `inter-pix` | Integração PIX |

### Operação e suporte

| Módulo | Papel |
|---|---|
| `etl` | Orquestração e histórico das cargas |
| `analytics-lp` | Eventos e visitas da landing page |
| `suporte` | Fluxos de suporte e contato |
| `email` | Envio de e-mails transacionais e diagnósticos |
| `redis-cache` | Acesso ao Redis |
| `access-log` | Registro de acessos da API |

### Autorização e infraestrutura

| Módulo | Papel |
|---|---|
| `auth` | Guards e regras de acesso da API |
| `admin` | Proteção administrativa por chave |

### Funcionalidade vertical

| Módulo | Papel |
|---|---|
| `painel-360` | Fluxos de enriquecimento/importação para visão comercial |

## 2. Frontend

O frontend é um app único com contextos distintos.

### Público

| Área | Papel |
|---|---|
| `landing` | Marketing, hero, planos, exemplos e CTA |
| `docs` | Página de documentação pública |
| `legal` | Termos e privacidade |

### Autenticação

| Área | Papel |
|---|---|
| `login` | Login unificado para admin e cliente |

### Portal

| Área | Papel |
|---|---|
| `portal-shell` | Casca principal do portal |
| `dashboard` | Visão inicial autenticada |
| `parametros` | Gestão de parâmetros |

### Portal do cliente

| Área | Papel |
|---|---|
| `consumo` | Consumo do plano/token |
| `meu-plano` | Plano atual |
| `minhas-faturas` | Histórico financeiro |
| `minha-conta` | Dados cadastrais |
| `meu-token` | Token de API |
| `verificar-email` | Validação de e-mail |
| `primeiro-acesso` | Conclusão de onboarding |
| `painel-360` | Visão 360 do cliente |

### Portal do admin

| Área | Papel |
|---|---|
| `clientes` | Gestão completa de clientes |
| `planos` | Gestão de planos |
| `recurso-planos` | Associação entre planos e recursos |
| `recursos` | Gestão de recursos |
| `assinaturas` | Gestão de assinaturas |
| `faturas` | Gestão de cobrança |
| `config-email` | Diagnóstico e configuração de e-mail |
| `etl` | Operação das cargas |
| `analytics` | Métricas da landing |
| `consumo-admin` | Consumo sob ótica administrativa |
| `painel-360-admin` | Operação administrativa do painel 360 |

## 3. Serviços frontend relevantes

| Serviço | Papel |
|---|---|
| `auth.service.ts` | Sessão e autenticação |
| `theme.service.ts` | Tema visual |
| `lp-analytics.service.ts` | Eventos da landing |
| `lp-registro.service.ts` | Registro de leads/eventos da LP |
| `notificacoes.service.ts` | Consumo de notificações do portal |

## 4. Entidades centrais do domínio

### Dados públicos

- `EmpresaRfb`
- `Estabelecimento`
- `Socio`
- `Simples`
- `Cnae`
- `Municipio`
- `Pais`
- `NaturezaJuridica`
- `Motivo`
- `Qualificacao`

### Produto/plataforma

- `ClienteApi`
- `Plano`
- `RecursoPlano`
- `PlanoRecurso`
- `Assinatura`
- `Fatura`
- `Token`
- `TokenHistorico`
- `Parametro`
- `Notificacao`
- `Consumo`

### Operação e analytics

- `AccessLog`
- `EtlLog`
- `EventoLp`
- `VisitaLp`
- `Painel360Lote`
- `Painel360Item`

## 5. Dependências críticas entre módulos

- `portal` depende do contexto de `clientes`, `assinaturas` e `tokens`
- `planos` alimenta `assinaturas`
- `assinaturas` influencia `consumo`, `portal` e limitações da API
- `parametros` influencia módulos operacionais como rate limit e e-mail
- `geocode` e `painel-360` dependem de bases auxiliares e insumos externos
- `etl` impacta diretamente o valor da API pública

## 6. Módulos que exigem atenção em novos projetos

Se este repositório for usado como base para novos produtos, estes módulos devem ser revisitados primeiro:

- `planos`
- `clientes`
- `portal`
- `assinaturas`
- `faturas`
- `parametros`
- `inter-pix`
- `analytics-lp`
- `painel-360`

São os pontos onde a regra de negócio mais tende a variar entre clientes e produtos.
