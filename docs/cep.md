# Consulta de CEP

## Regras da API de CEP

### Fluxo de Consulta

Ao receber uma solicitação de consulta de CEP:

1. Validar o CEP informado.
2. Consultar o CEP na base local.
3. Se o CEP existir e estiver atualizado:
   * Retornar os dados da base local.
4. Se o CEP não existir:
   * Consultar serviços externos.
5. Se o CEP existir, mas os dados estiverem desatualizados:
   * Consultar serviços externos.
   * Atualizar os dados na base local.
   * Retornar os dados atualizados.

---

## Critério de Atualização

Os dados de um CEP serão considerados desatualizados quando a data da última atualização for superior ao período definido em parâmetro do sistema.

Parâmetro:

```
CEP_CACHE_VALIDITY_DAYS
```

Valor padrão: **180 dias**

A API utiliza este parâmetro para determinar quando um CEP precisa ser atualizado.

---

## Fontes Externas

A API consulta as fontes externas nesta ordem:

### 1. ViaCEP

Consulta principal dos dados do CEP (logradouro, bairro, município, UF).

### 2. Nominatim (OpenStreetMap)

Utilizado para complementar informações geográficas:
- Latitude
- Longitude

---

## Persistência

Banco: conexão `viacep` → tabela `ceps_geo`

### Inserção

Se o CEP não existir: criar registro com `origemDados = 'viacep'` e `criadoEm = now()`.

### Atualização

Se o CEP já existir e estiver desatualizado:
- Atualizar os dados.
- Atualizar `atualizadoEm`.
- Atualizar `origemDados`.

---

## Campos da Base de CEP (`ceps_geo`)

| Campo | Tipo | Descrição |
|---|---|---|
| `cep` | varchar(8) PK | CEP sem formatação |
| `logradouro` | varchar(150) | Nome do logradouro |
| `complemento` | varchar(100) | Complemento do logradouro |
| `bairro` | varchar(80) | Bairro |
| `municipio` | varchar(100) | Nome do município |
| `municipio_ibge` | integer | Código IBGE do município |
| `uf_sigla` | varchar(2) | Sigla da UF |
| `lat` | decimal(9,6) | Latitude |
| `lng` | decimal(9,6) | Longitude |
| `criado_em` | timestamp | Data de cadastro |
| `atualizado_em` | timestamp | Data da última atualização |
| `geocodificado_em` | timestamp | Data da geocodificação |
| `origem_dados` | varchar(20) | Fonte dos dados (viacep, manual) |

---

## Integração com Cadastro de Clientes

No cadastro de clientes, ao sair do campo CEP (evento `blur`) ou após digitação de CEP válido:

- Consumir exclusivamente nossa API de CEP (`POST /admin/clientes-poui/validate-cep`).
- **Não** realizar consultas diretas ao ViaCEP ou qualquer outro serviço externo pelo front-end.

No portal do cliente, as telas devem consumir a **API pública de venda** usando o `x_api_token` do cliente autenticado:

- `GET /geocode/cep/:cep` para CEP
- `GET /cnpj/:cnpj` para CNPJ

As APIs `/portal/*` devem existir apenas para necessidades específicas das telas do portal que não façam parte da superfície pública comercializada.

### Preenchimento Automático dos Campos

Após retorno da API, preencher automaticamente:
- Logradouro
- Bairro
- Município
- UF
- Complemento (quando existir)

### Regra de não sobrescrever

**Preencher apenas campos que estejam vazios.**

Não sobrescrever informações já digitadas pelo usuário.

Exemplo: se o usuário informou manualmente o Bairro ou Logradouro, estes campos não devem ser alterados pelo retorno da API.

---

## Experiência do Usuário

- Indicador de carregamento durante a consulta (`p-loading` no campo CEP).
- Tratamento amigável de erros.
- Mensagem quando o CEP não for encontrado.
- Máscara de CEP (`99999-999`).
- Validação do formato antes da consulta (8 dígitos numéricos).

---

## Requisitos Técnicos

### Backend — Fluxo único (`buscarCep`)

Todos os endpoints usam o mesmo comportamento de **população sob demanda**:

1. **Redis** → se existir, retorna imediatamente (TTL 7 dias)
2. **Banco local** → se existir e estiver dentro da validade, armazena no Redis e retorna
3. **ViaCEP + Nominatim** → se não existir ou estiver desatualizado → salva no banco → armazena no Redis → retorna

A base começa vazia e cresce organicamente. O Redis evita repetir a consulta ao banco e às fontes externas nas requisições seguintes.

A base começa vazia e cresce organicamente conforme os CEPs são consultados.

| Endpoint | Guarda | Uso |
|---|---|---|
| `GET /geocode/cep/:cep` | API token (plano free) | Clientes pagantes |
| `POST /admin/clientes-poui/validate-cep` | JWT portal (admin) | Formulário admin de clientes |

- Validade dos dados: parâmetro `CEP_CACHE_VALIDITY_DAYS` (padrão: 180 dias)
- **Não usar Redis para cache de CEP** — Redis é reservado para rate limit das APIs de consulta paga.
- Logs de todas as consultas externas (ViaCEP e Nominatim).

### Frontend Angular + PO-UI

- Consulta via campo `validate` do `po-page-dynamic-edit` (hook no blur/change do campo CEP).
- Preenchimento via `aplicarValoresDinamicos()` com guarda de não-sobrescrita (`!current[key]`).
- Campos UF e Município com tratamento especial (combo dependente).
- No portal do cliente, a consulta deve usar a API pública autenticada com `x_api_token`, enviada automaticamente pelo interceptor Angular.
