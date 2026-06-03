import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-planos',
  standalone: false,
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.scss',
})
export class PlanosComponent implements OnInit {
  planos: any[] = [];

  // Fallback enquanto carrega da API
  planosFallback = [
    {
      nome: 'Gratuito', precoMensal: 0, rateLimitPorMinuto: 3, limiteMensal: null,
      descricao: 'Perfeito para testar e integrar',
      acessoCnpj: true, acessoCnpjRaiz: false, acessoPesquisa: false, acessoGeocode: false, acessoMapa: false,
      destaque: false,
    },
    {
      nome: 'Básico', precoMensal: 49.90, rateLimitPorMinuto: 120, limiteMensal: 5000,
      descricao: 'Para aplicações em produção',
      acessoCnpj: true, acessoCnpjRaiz: true, acessoPesquisa: false, acessoGeocode: true, acessoMapa: false,
      destaque: false,
    },
    {
      nome: 'Profissional', precoMensal: 149.90, rateLimitPorMinuto: 600, limiteMensal: 30000,
      descricao: 'Volume médio com mapa',
      acessoCnpj: true, acessoCnpjRaiz: true, acessoPesquisa: false, acessoGeocode: true, acessoMapa: true,
      destaque: true,
    },
    {
      nome: 'Premium', precoMensal: 349.90, rateLimitPorMinuto: 2000, limiteMensal: 100000,
      descricao: 'Pesquisa avançada e alto volume',
      acessoCnpj: true, acessoCnpjRaiz: true, acessoPesquisa: true, acessoGeocode: true, acessoMapa: true,
      destaque: false,
    },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/planos`).subscribe({
      next: data => this.planos = data.map((p, i) => ({ ...p, destaque: i === 2 })),
      error: () => this.planos = this.planosFallback,
    });
    this.planos = this.planosFallback;
  }

  formatarPreco(valor: number): string {
    if (valor === 0) return 'Grátis';
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  }
}
