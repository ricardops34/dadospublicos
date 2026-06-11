# Regra de Negócio — Cadastro de Clientes e Usuários

> **IMPORTANTE:** O sistema deve tratar CLIENTE e USUÁRIO como entidades distintas.
> No código atual: **Cliente = tabela `clientes`** (tenant) e **Usuário = tabela `usuarios`**.

## Conceitos

### Cliente (`clientes`)
Cliente é a pessoa física ou jurídica que contrata os serviços da plataforma.

A entidade Cliente deve possuir:
- Identificador único
- Dados cadastrais (PF ou PJ) — incl. CNAE principal e secundários quando PJ
- Plano contratado
- Status do cliente
- Token de API único
- Data de cadastro
- Lista de usuários vinculados

### Usuário (`usuarios`)
Usuário é a pessoa que acessa o sistema em nome de um cliente.

A entidade Usuário deve possuir:
- Identificador único
- Nome
- E-mail
- Senha/credenciais de acesso
- Status (ativo/inativo)
- Cliente ao qual pertence (`cliente_id`)
- Data de criação

## Relacionamento

- Um Cliente pode possuir um ou vários Usuários.
- Todo Cliente deve possuir pelo menos um Usuário.
- Um Usuário pertence obrigatoriamente a um único Cliente.
- Não existe Usuário sem Cliente.
- Não existe compartilhamento de Usuários entre Clientes.

```
Cliente (1) ──► (N) Usuários
```

## Token de API

- Cada Cliente possui exatamente um Token de API.
- O Token pertence ao Cliente, não aos Usuários.
- Todos os Usuários vinculados ao Cliente utilizam o mesmo Token.
- A regeneração do Token afeta todos os Usuários daquele Cliente.

## Controle de Acesso

- As permissões são definidas pelo plano contratado pelo Cliente.
- Todos os Usuários do mesmo Cliente possuem acesso às funcionalidades permitidas pelo plano.
- O sistema deve sempre validar os limites e recursos do plano do Cliente.
- Os recursos disponíveis não são controlados individualmente por Usuário.

## Usuário Administrador

- O primeiro Usuário criado durante o cadastro do Cliente será marcado como Administrador.
- O Administrador pode:
  - Criar novos Usuários para o Cliente.
  - Editar Usuários do Cliente.
  - Ativar ou desativar Usuários.
  - Visualizar informações do Cliente.
  - Gerenciar o Token de API.
- Usuários comuns não podem gerenciar outros Usuários.

> Obs.: não confundir com `usuarios.perfil = 'admin'`, que é o administrador **da plataforma**.
> O Administrador do Cliente é um papel dentro do cliente (hoje representado por `clientes.proprietario_id`).

## Fluxo de Cadastro

1. Criar Cliente.
2. Definir plano contratado.
3. Gerar Token de API do Cliente.
4. Criar primeiro Usuário Administrador.
5. Permitir que o Administrador crie Usuários adicionais.

## Exemplo de Estrutura

```
Cliente: Empresa ABC Ltda
Plano: Profissional
Token API: XYZ123

Usuários:
- João (Administrador)
- Maria
- Pedro
- Ana
```

Todos os Usuários pertencem ao mesmo Cliente, compartilham o mesmo Token de API e
possuem acesso aos recursos disponibilizados pelo plano contratado.

## Diretriz para Implementação

- Sempre modelar Cliente e Usuário como entidades independentes.
- **NUNCA** armazenar informações de negócio do Cliente dentro da entidade Usuário.
- O Cliente é o contratante dos serviços.
- O Usuário é apenas um operador autorizado a utilizar o sistema em nome do Cliente.
- Novos campos de negócio (endereço, documentos, CNAE, inscrições) vão em `clientes`, nunca em `usuarios`.
