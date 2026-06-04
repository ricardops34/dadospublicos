# Integração PIX - Banco Inter

Esta documentação descreve a arquitetura de integração do sistema BuscaDados com a API do Banco Inter para cobranças PIX (Pix Cobrança).

## 1. Parâmetros Necessários

A API do Banco Inter exige autenticação via OAuth2 com certificado digital (mTLS). Os seguintes parâmetros foram previstos na tabela de configurações do sistema:

- `INTER_CLIENT_ID`: Client ID gerado no painel do banco.
- `INTER_CLIENT_SECRET`: Client Secret gerado no banco.
- `INTER_CERT_PATH`: Caminho absoluto ou relativo para o arquivo de certificado `.crt`.
- `INTER_KEY_PATH`: Caminho absoluto ou relativo para o arquivo de chave privada `.key`.
- `PIX_CHAVE`: A chave PIX da conta bancária (CNPJ, E-mail, Celular ou Chave Aleatória).

## 2. Modelagem do Banco de Dados

A entidade `Fatura` foi expandida para suportar as transações:
- `pixTxid`: O identificador único da transação gerado pelo Banco Central (e repassado pelo Banco Inter).
- `pixCopiaECola`: A string no padrão EMV (`000201...`) gerada para criação do QR Code.

## 3. Fluxo de Cobrança

1. O cliente assina um plano ou o CRON vira o mês da fatura.
2. O serviço `FaturasService` se comunica com o `InterPixService` (futuro).
3. O `InterPixService` consome `INTER_CERT_PATH` e as credenciais, realiza a troca por um token Bearer, e faz um POST para `/pix/v2/cob`.
4. O Inter responde com a string do PIX Copia e Cola e o `txid`.
5. Salvamos esses dados na tabela `Fatura`.
6. O frontend exibe a string Copia e Cola / QR Code para o usuário.

## 4. Webhook (Confirmação Automática)

A aplicação deve expor o endpoint:
`POST /api/webhooks/inter/pix`

Este webhook deverá ser registrado na API do Banco Inter (via rota `PUT /pix/v2/webhook/{chave}`).
Toda vez que uma cobrança é paga pelo usuário final, o banco chama esse endpoint. O sistema localizará a fatura pelo `txid` informado no JSON e mudará o status para `paga`, liberando o acesso ou limite do usuário instantaneamente.
