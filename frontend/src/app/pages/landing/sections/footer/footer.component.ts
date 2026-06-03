import { Component } from '@angular/core';

interface LinkItem {
  label: string;
  href?: string;
  externo?: boolean;
  rota?: string;
}

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  anoAtual = new Date().getFullYear();

  links: { titulo: string; itens: LinkItem[] }[] = [
    {
      titulo: 'Produto',
      itens: [
        { label: 'Como funciona', href: '#como-funciona' },
        { label: 'Planos e preços', href: '#planos' },
        { label: 'Exemplos de uso', href: '#exemplos' },
        { label: 'Documentação', href: '/docs', externo: true },
      ],
    },
    {
      titulo: 'Conta',
      itens: [
        { label: 'Criar conta grátis', rota: '/cliente/cadastro' },
        { label: 'Entrar', rota: '/cliente/login' },
        { label: 'Dashboard', rota: '/cliente/dashboard' },
        { label: 'Meu token de API', rota: '/cliente/dashboard' },
      ],
    },
    {
      titulo: 'Dados',
      itens: [
        { label: 'Receita Federal', href: 'https://dados.gov.br/dados/conjuntos-dados/cadastro-nacional-da-pessoa-juridica---cnpj', externo: true },
        { label: 'Metadados RFB', href: 'https://www.gov.br/receitafederal/dados/cnpj-metadados.pdf', externo: true },
        { label: 'Atualização mensal', href: '#como-funciona' },
      ],
    },
  ];
}
