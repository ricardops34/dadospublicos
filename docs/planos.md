# Planos e Rate Limiting

---

## Planos

| Plano | Rate limit | Limite mensal | Após limite |
|---|---|---|---|
| **Gratuito** | 3 req/min por IP | Ilimitado* | — |
| **Básico** | 2000 req/min | Definido por plano | 4 req/min |
| **Premium** | 2000 req/min | Definido por plano | 4 req/min |

> *O plano gratuito não tem limite mensal, mas IPs com padrão abusivo (>360 req/hora) são bloqueados por 1 hora.

---

## Endpoints por plano

| Endpoint | Gratuito | Básico | Premium |
|---|:---:|:---:|:---:|
| `GET /cnpj/:cnpj` | ✅ | ✅ | ✅ |
| `GET /health` | ✅ | ✅ | ✅ |
| `GET /cnpj-raiz/:cnpj_raiz` | ❌ | ✅ | ✅ |
| `POST /suframa` | ❌ | ✅ | ✅ |
| `GET /consumo` | ❌ | ✅ | ✅ |
| `GET /cep/:cep` | ❌ | ✅ | ✅ |
| `GET /v2/pesquisa` | ❌ | ❌ | ✅ |
| `GET /mapa` | ❌ | ❌ | ✅ |

---

## Autenticação e tokens

- Tokens gerados via painel do usuário (a implementar)
- Passados via header `x_api_token` ou query `?token=`
- Tokens vinculados a um plano — a troca de plano atualiza as permissões imediatamente
- Tokens sem validade definida — revogação manual pelo painel

---

## Rate limiting — implementação

Usar `@nestjs/throttler` com Redis como store para contagem distribuída.

```typescript
// Gratuito: 3 req/min por IP
ThrottlerModule.forRoot([{ ttl: 60000, limit: 3 }])

// Pago: 2000 req/min por token (guard customizado)
```

**Resposta ao exceder o limite:**

```json
HTTP 429
{
  "status": 429,
  "titulo": "Rate limit excedido",
  "detalhes": "Limite de 3 requisições por minuto atingido.",
  "validacao": []
}
```

---

## Monetização

- Faturamento mensal
- Nota Fiscal de Serviço emitida após pagamento
- Limites mensais não acumulam entre períodos
- Após esgotar cota mensal: fallback para 4 req/min até próximo ciclo
