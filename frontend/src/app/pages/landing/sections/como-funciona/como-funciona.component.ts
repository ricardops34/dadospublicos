import { Component } from '@angular/core';

@Component({
  selector: 'app-como-funciona',
  standalone: false,
  templateUrl: './como-funciona.component.html',
  styleUrl: './como-funciona.component.scss',
})
export class ComoFuncionaComponent {
  passos = [
    { icone: 'an an-user-plus', titulo: 'Crie sua conta', descricao: 'Cadastro gratuito em menos de 1 minuto. Sem cartão de crédito.' },
    { icone: 'an an-key',       titulo: 'Receba seu token', descricao: 'Após assinar um plano, seu token de API é gerado automaticamente.' },
    { icone: 'an an-code',      titulo: 'Integre na sua aplicação', descricao: 'Faça requisições REST em qualquer linguagem. Resposta em JSON.' },
    { icone: 'an an-chart-line',titulo: 'Monitore o consumo', descricao: 'Acompanhe suas requisições mensais no painel do cliente.' },
  ];

  fontes = [
    { icone: 'an an-buildings',  nome: 'Receita Federal',  descricao: 'Dados cadastrais, sócios, CNAE, situação' },
    { icone: 'an an-receipt',    nome: 'Simples Nacional', descricao: 'Opção pelo Simples e MEI' },
    { icone: 'an an-map-pin',    nome: 'ViaCEP + OSM',     descricao: 'Geocodificação de endereços' },
  ];
}
