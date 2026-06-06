import { Component } from '@angular/core';

@Component({
  selector: 'app-como-funciona',
  standalone: false,
  templateUrl: './como-funciona.component.html',
  styleUrl: './como-funciona.component.scss',
})
export class ComoFuncionaComponent {
  passos = [
    { icone: 'an an-user-plus', titulo: 'Crie sua conta', descricao: 'Cadastro gratuito em menos de 1 minuto. Sem cartao de credito.' },
    { icone: 'an an-key', titulo: 'Ative seu token', descricao: 'Conclua o primeiro acesso e gere o token no plano Free ou em um plano pago.' },
    { icone: 'an an-code', titulo: 'Integre a sua aplicacao', descricao: 'Faca requisicoes REST em qualquer linguagem. Resposta em JSON.' },
    { icone: 'an an-chart-line', titulo: 'Acompanhe a evolucao', descricao: 'Comece com CEP e CNPJ no plano Free e avance conforme o seu volume.' },
  ];

  fontes = [
    { icone: 'an an-buildings', nome: 'Receita Federal', descricao: 'Dados cadastrais, socios, CNAE e situacao cadastral' },
    { icone: 'an an-receipt', nome: 'Simples Nacional', descricao: 'Opcao pelo Simples Nacional e MEI' },
    { icone: 'an an-map-pin', nome: 'ViaCEP + OSM', descricao: 'Geocodificacao de enderecos' },
  ];
}
