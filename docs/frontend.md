# Frontend — Definições

## Estrutura de páginas

```
/ (Landing Page pública)
├── /docs          — Documentação da API (Swagger embed ou docs custom)
├── /precos        — Tabela de planos e preços
├── /exemplos      — Exemplos de uso (cURL, Node.js, PHP, Excel)
│
/admin             — Ambiente administrativo (SPA Angular)
├── /admin/login
├── /admin/dashboard      — ADMIN: visão geral (clientes, receita, consumo)
├── /admin/clientes       — ADMIN: listagem e detalhe de clientes
├── /admin/assinaturas    — ADMIN: assinaturas ativas/suspensas/canceladas
├── /admin/faturas        — ADMIN: faturas, baixa de pagamento, emissão NF
├── /admin/planos         — ADMIN: CRUD de planos e preços
├── /admin/etl            — ADMIN: status e histórico de cargas RFB
│
/cliente           — Área do cliente (SPA Angular)
├── /cliente/login
├── /cliente/cadastro
├── /cliente/dashboard    — CLIENTE: gráfico de consumo, token, plano ativo
├── /cliente/assinatura   — CLIENTE: upgrade/downgrade/cancelamento
├── /cliente/faturas      — CLIENTE: histórico de faturas e NFs
└── /cliente/perfil       — CLIENTE: dados cadastrais
```

---

## Perfis de acesso

### ADMIN
- Acesso: header `x_admin_key` (variável `ADMIN_KEY` no .env)
- Permissões: tudo — CRUD de planos, listagem de clientes, baixa de faturas,
  disparo de ETL, visualização de consumo por cliente

### CLIENTE
- Acesso: header `x_cliente_id` (ID do cliente após login)
- Permissões: apenas seus próprios dados:
  - Ver e atualizar cadastro
  - Ver assinatura ativa e token de API
  - Upgradar / cancelar plano
  - Ver histórico de faturas e NFs
  - Gráfico de consumo mensal (próprio)

---

## Landing Page — seções

1. **Hero** — headline, subheadline, CTA "Começar grátis"
2. **O que é** — dados públicos da Receita Federal via API REST
3. **Planos** — tabela de preços (GET /planos via API)
4. **Exemplos de uso** — tabs com cURL / Node.js / PHP / Excel / ADVPL
5. **Documentação** — link para /docs (Swagger) + docs customizado
6. **CTA final** — "Crie sua conta" / "Fale conosco"

---

## Stack frontend

| Parte | Tecnologia |
|---|---|
| Landing Page | Angular 21 + PO-UI (mesmo padrão do CRM) |
| Admin SPA | Angular 21 + PO-UI |
| Área do Cliente | Angular 21 + PO-UI |
| Gráficos | PO-UI Charts ou ngx-charts |
| Build | Servido pelo NestJS (ServeStaticModule) ou CDN separado |

---

## Decisões técnicas

- Landing Page, Admin e Área do Cliente serão um único projeto Angular
  com rotas protegidas por guards locais
- O Admin usa `x_admin_key` no localStorage (nunca em URL)
- O Cliente usa `x_cliente_id` no localStorage após login
- Temas: seguir padrão do CRM (Animalia Icons `an an-*`, PoModule)
