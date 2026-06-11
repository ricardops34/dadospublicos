import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

interface DocsSection {
  titulo: string;
  paragrafos?: string[];
  bullets?: string[];
  codigo?: string;
}

@Component({
  selector: 'app-docs',
  standalone: false,
  templateUrl: './docs.component.html',
  styleUrl: './docs.component.scss',
})
export class DocsComponent {
  swaggerUrl = `${environment.apiUrl}/docs`;
  ultimaAtualizacao = '03 de junho de 2026';

  constructor(private router: Router) {}

  abrirSwagger() { window.open(this.swaggerUrl, '_blank', 'noopener'); }
  irParaCadastro() { this.router.navigateByUrl('/cliente/cadastro'); }

  destaques = [
    'Base local do frontend: /docs.',
    'Swagger técnico da API disponível em link separado.',
    'Autenticação via x_api_token nos endpoints protegidos.',
    'Planos e recursos controlam limites, consumo e acesso.',
  ];

  secoes: DocsSection[] = [
    {
      titulo: '1. Visão geral',
      paragrafos: [
        'A API BuscaDados fornece acesso estruturado a dados públicos empresariais, com endpoints para consulta de CNPJ, consulta por raiz, pesquisa avançada, consumo, geocodificação por CEP e serviços complementares vinculados ao plano contratado.',
        'Esta página resume a forma de uso da plataforma no frontend. Para detalhes técnicos de schemas, exemplos de resposta, validações e testes interativos, utilize também o Swagger técnico da API.',
      ],
    },
    {
      titulo: '2. Autenticação',
      paragrafos: [
        'Endpoints públicos podem ser acessados sem token, conforme as regras da plataforma. Endpoints protegidos exigem o envio do token do cliente no header x_api_token.',
        'O envio por header deve ser o padrão. Quando suportado por endpoint legado, também pode existir envio por query string, mas a recomendação operacional é usar sempre o header.',
      ],
      codigo: `curl -H "x_api_token: SEU_TOKEN" \\
  https://api.buscadados.bjsoft.com.br/cnpj-raiz/27865757`,
    },
    {
      titulo: '3. Endpoints principais',
      bullets: [
        'GET /cnpj/:cnpj: consulta detalhada de um CNPJ.',
        'GET /cnpj-raiz/:cnpj_raiz: retorna matriz e filiais com paginação.',
        'GET /v2/pesquisa: pesquisa avançada com filtros comerciais.',
        'POST /suframa: validação de inscrição Suframa.',
        'GET /consumo: consulta do consumo do token autenticado.',
        'GET /cep/:cep: geocodificação por CEP.',
        'GET /mapa: retorno GeoJSON para mapa e prospecção.',
        'GET /health: health check do serviço.',
      ],
    },
    {
      titulo: '4. Fluxo recomendado de integração',
      bullets: [
        'Gerar ou obter o token da conta do cliente.',
        'Validar o plano ativo e os recursos liberados.',
        'Consumir os endpoints com x_api_token no header.',
        'Monitorar o uso periodicamente em GET /consumo.',
        'Tratar respostas 401, 403 e 429 de forma explícita na integração.',
      ],
    },
    {
      titulo: '5. Exemplo rápido de uso',
      paragrafos: [
        'O exemplo abaixo mostra a consulta direta de um CNPJ com retorno JSON. A partir dele, a integração pode extrair razão social, endereço, CNAE, sócios e indicadores cadastrais.',
      ],
      codigo: `const res = await fetch('https://api.buscadados.bjsoft.com.br/cnpj/27865757000102', {
  headers: { 'x_api_token': 'SEU_TOKEN' }
});

const empresa = await res.json();
console.log(empresa.razao_social);`,
    },
    {
      titulo: '6. Limites, consumo e planos',
      paragrafos: [
        'Os limites técnicos e comerciais dependem do plano contratado. O backend controla consumo mensal, autorização de funcionalidades e restrições por recurso disponível no plano ativo.',
        'Quando um endpoint exigir recurso não disponível, a API pode responder com 403. Quando o limite técnico for excedido, a resposta esperada é 429.',
      ],
    },
    {
      titulo: '7. Códigos de erro',
      bullets: [
        '400: parâmetro inválido ou mal formatado.',
        '401: token ausente, expirado ou inválido.',
        '403: plano insuficiente para o recurso solicitado.',
        '404: registro não localizado.',
        '429: rate limit ou limite operacional excedido.',
        '500: erro interno do serviço.',
      ],
    },
  ];
}
