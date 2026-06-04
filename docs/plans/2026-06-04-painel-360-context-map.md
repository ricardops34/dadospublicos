# Context Map: Painel 360

## Context Map

### Files to Modify
| File | Purpose | Changes Needed |
|------|---------|----------------|
| `backend/src/app.module.ts` | Registro global de módulos e middleware | Importar `Painel360Module` e decidir se rotas novas entram no `AccessLogMiddleware`. |
| `backend/src/modules/clientes/clientes.service.ts` | Payload do portal do cliente | Expor recursos efetivos do plano ativo ou relação suficiente para guard de recurso no frontend. |
| `backend/src/modules/assinaturas/assinaturas.service.ts` | Assinatura ativa e acessos do cliente | Incluir recursos por `slug` no retorno de `minhaAssinatura()` ou criar payload equivalente para autorização de UI. |
| `backend/src/modules/pesquisa/pesquisa.service.ts` | Base real de filtros sobre estabelecimentos | Extrair ou reaproveitar a montagem do `QueryBuilder` para filtros do Painel 360 sem duplicação excessiva. |
| `frontend/src/app/pages/portal/portal.module.ts` | Rotas lazy do portal | Adicionar rotas para `painel-360-admin` e `painel-360`, com guards compatíveis com perfil/recurso. |
| `frontend/src/app/pages/portal/portal-shell.component.ts` | Menu lateral por perfil | Adicionar item de menu do Painel 360 para admin e cliente autorizado. |
| `frontend/src/app/pages/portal/admin/admin.service.ts` | Cliente HTTP do admin | Adicionar métodos de upload, status, resultados, download e GeoJSON do Painel 360. |
| `frontend/src/app/pages/portal/cliente/cliente.service.ts` | Cliente HTTP do portal do cliente | Adicionar métodos equivalentes do Painel 360 para o escopo do cliente. |
| `frontend/package.json` | Dependências do frontend | Adicionar `leaflet`, `leaflet.markercluster` e tipos necessários. |
| `frontend/angular.json` ou estilos locais do módulo | Estilos do mapa | Garantir carregamento correto do CSS do Leaflet sem vazar estilo global indevido. |

### Files to Create
| File | Purpose | Changes Needed |
|------|---------|----------------|
| `backend/src/modules/painel-360/painel-360.module.ts` | Módulo isolado do backend | Importar entidades, guards e serviços necessários para upload, processamento e consulta. |
| `backend/src/modules/painel-360/painel-360.controller.ts` | API do Painel 360 | Expor endpoints de criação de lote, status, resultados, download e GeoJSON. |
| `backend/src/modules/painel-360/painel-360.service.ts` | Orquestração de lotes | Criar lote, validar arquivo, persistir execução, chamar processamento assíncrono. |
| `backend/src/modules/painel-360/painel-360-processamento.service.ts` | Processamento em background | Normalizar planilha, consultar base RFB em lote, aplicar filtros, geocodificar, gerar saída. |
| `backend/src/modules/painel-360/dto/painel-360-filtros.dto.ts` | Contrato de filtros | Receber filtros compatíveis com `PesquisaDto` e parâmetros adicionais do lote. |
| `backend/src/modules/portal/recurso.guard.ts` | Guard por recurso no portal | Permitir acesso a admin e clientes com recurso `painel-360`. |
| `backend/src/modules/portal/recurso.decorator.ts` | Decorator de recurso | Declarar `@RecursoPortal('painel-360')` ou equivalente nas rotas protegidas. |
| `backend/src/entities/painel-360-lote.entity.ts` | Cabeçalho da execução | Persistir lote, arquivo original, filtros, formato de saída, status e progresso. |
| `backend/src/entities/painel-360-item.entity.ts` | Itens processados | Persistir linha, CNPJ, status, match, dados enriquecidos e coordenadas. |
| `frontend/src/app/guards/cliente-recurso.guard.ts` | Guard de rota por recurso | Bloquear rota do cliente sem o recurso liberado. |
| `frontend/src/app/pages/portal/painel-360/painel-360.service.ts` | Serviço compartilhado do módulo | Centralizar chamadas HTTP do Painel 360 para admin e cliente. |
| `frontend/src/app/pages/portal/painel-360/painel-360.types.ts` | Tipos do módulo | Consolidar contratos de lote, resultado, contadores e GeoJSON. |
| `frontend/src/app/pages/portal/admin/painel-360-admin/painel-360-admin.module.ts` | Módulo admin | Registrar rota e imports PO-UI do Painel 360 admin. |
| `frontend/src/app/pages/portal/admin/painel-360-admin/painel-360-admin.component.ts` | Página admin | Upload, histórico, resultados e download no contexto administrativo. |
| `frontend/src/app/pages/portal/admin/painel-360-admin/painel-360-admin.component.html` | Template admin | Layout com `po-page-default`, `po-upload`, tabelas e mapa. |
| `frontend/src/app/pages/portal/admin/painel-360-admin/painel-360-admin.component.scss` | Estilos admin | Estilo local do painel. |
| `frontend/src/app/pages/portal/cliente/painel-360/painel-360.module.ts` | Módulo cliente | Registrar rota e imports PO-UI do Painel 360 do cliente. |
| `frontend/src/app/pages/portal/cliente/painel-360/painel-360.component.ts` | Página cliente | Histórico, resultados, download e mapa para cliente autorizado. |
| `frontend/src/app/pages/portal/cliente/painel-360/painel-360.component.html` | Template cliente | Layout da área do cliente para o painel. |
| `frontend/src/app/pages/portal/cliente/painel-360/painel-360.component.scss` | Estilos cliente | Estilo local do painel. |
| `frontend/src/app/pages/portal/painel-360/mapa/painel-360-mapa.component.ts` | Wrapper Leaflet | Inicializar mapa, clusters, camadas e atualização do GeoJSON. |
| `frontend/src/app/pages/portal/painel-360/mapa/painel-360-mapa.component.html` | Template do mapa | Container do mapa e estados vazios/carregamento. |
| `frontend/src/app/pages/portal/painel-360/mapa/painel-360-mapa.component.scss` | Estilos do mapa | Altura, legenda, responsividade e CSS específico do Leaflet. |

### Dependencies (may need updates)
| File | Relationship |
|------|--------------|
| `backend/src/modules/geocode/geocode.module.ts` | Reuso direto do cache `ceps_geo` para coordenadas. |
| `backend/src/modules/geocode/geocode.service.ts` | Reuso do geocoding por CEP, com cuidado para evitar N+1 e rate limit externo. |
| `backend/src/modules/cnpj/cnpj.module.ts` | Possível injeção do `CnpjService` para detalhe pontual. |
| `backend/src/modules/cnpj/cnpj.service.ts` | Fonte de enriquecimento individual; não deve ser o caminho principal para lote grande. |
| `backend/src/modules/auth/auth.guard.ts` | Guarda de plano mínimo para endpoints técnicos; não resolve autorização fina por recurso do portal. |
| `backend/src/modules/portal/jwt-portal.guard.ts` | Base de autenticação JWT do portal para admin e cliente. |
| `backend/src/modules/etl/etl.service.ts` | Referência de processamento assíncrono e também risco de concorrência com carga RFB. |
| `backend/src/entities/estabelecimento.entity.ts` | Tabela-base para filtros, CNPJ e dados geográficos. |
| `backend/src/entities/empresa-rfb.entity.ts` | Fonte de razão social, porte e natureza jurídica para resultado do lote. |
| `backend/src/entities/simples.entity.ts` | Fonte de filtros Simples/MEI. |
| `backend/src/entities/municipio.entity.ts` | Apoio a cidade/IBGE em filtros e resposta. |
| `backend/src/entities/cep-geo.entity.ts` | Cache persistente de latitude/longitude. |
| `frontend/src/app/interceptors/auth.interceptor.ts` | Já injeta JWT nas chamadas ao backend do portal. |
| `frontend/src/app/services/notif.service.ts` | Padrão de feedback visual para upload/processamento/erro. |
| `docs/mapa-prospeccao.md` | Referência de desenho do mapa Leaflet e formato GeoJSON esperado. |
| `docs/api.md` | Referência de contrato da futura resposta de mapa e coerência de nomenclatura. |

### Test Files
| Test | Coverage |
|------|----------|
| `frontend/src/app/app.spec.ts` | Único spec identificado no repositório; não cobre o portal nem o Painel 360. |
| `backend` | Nenhum teste relevante encontrado para módulos de planos, portal, upload, mapa ou processamento em lote. |

### Reference Patterns
| File | Pattern |
|------|---------|
| `backend/src/modules/etl/etl.controller.ts` | Endpoints de início/status de processo assíncrono. |
| `backend/src/modules/etl/etl.service.ts` | Job em background com persistência de progresso. |
| `backend/src/modules/pesquisa/pesquisa.service.ts` | QueryBuilder com filtros sobre base RFB. |
| `backend/src/modules/geocode/geocode.service.ts` | Reuso de cache e fallback externo por CEP. |
| `backend/src/modules/planos/planos.service.ts` | Catálogo de recursos por `slug` e associação plano x recurso. |
| `frontend/src/app/pages/portal/admin/etl/etl.component.html` | Página administrativa com status/processamento. |
| `frontend/src/app/pages/portal/admin/recurso-planos/recurso-planos.component.ts` | Gestão admin de recurso associado ao plano. |
| `frontend/src/app/pages/portal/cliente/meu-plano/meu-plano.component.html` | Exibição de capacidades do plano do cliente. |
| `frontend/src/app/pages/portal/portal-shell.component.ts` | Construção de menu lateral por perfil. |
| `docs/po-ui/doc/llms-generated/po-upload.md` | API local do `po-upload` para fluxo de planilha. |

### Risk Assessment
- [x] Breaking changes to public API
  O mapa documentado em `docs/api.md` ainda não existe no backend; criar `/painel-360/*` evita colisão com rotas públicas atuais.
- [x] Database migrations needed
  Novas entidades de lote/item do Painel 360 exigem novas tabelas; hoje o projeto usa `synchronize: true`, o que é frágil para produção.
- [x] Configuration changes required
  Upload de planilha, geração de arquivo e dependências do Leaflet exigem configuração adicional no backend e frontend.
- [x] Authorization divergence risk
  O portal hoje diferencia `admin` e `cliente`, mas não possui guard genérico por recurso no cliente.
- [x] Performance risk
  Processar linha a linha com `CnpjService` ou geocodificação externa causará gargalo; o caminho deve ser consulta em lote + cache.
- [x] Concurrency risk
  O ETL mensal trunca tabelas-base da RFB; o Painel 360 pode ler base inconsistente se processar ao mesmo tempo.

### Recommended Scope Boundary
- V1 do Painel 360 deve aceitar uma planilha por lote.
- V1 deve priorizar `lista de CNPJ` e filtros associados ao lote.
- V1 deve gerar CSV como formato mínimo obrigatório; XLSX pode entrar como extensão posterior.
- V1 deve manter o mapa como leitura do resultado persistido, não como consulta live na base a cada navegação.
