import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PoTableColumn } from '@po-ui/ng-components';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-consumo-admin',
  standalone: false,
  templateUrl: './consumo-admin.component.html',
})
export class ConsumoAdminComponent implements OnInit {
  registros: any[] = [];
  carregando = false;
  mesAtual = new Date().getMonth() + 1;
  anoAtual = new Date().getFullYear();

  colunas: PoTableColumn[] = [
    { property: 'cliente',    label: 'Cliente',       width: '30%' },
    { property: 'plano',      label: 'Plano',         width: '15%' },
    { property: 'quantidade', label: 'Requisições',   type: 'number', width: '15%' },
    { property: 'limite',     label: 'Limite/mês',    type: 'number', width: '15%' },
    { property: 'percentual', label: '% Usado',       width: '12%' },
    { property: 'mes',        label: 'Mês',           type: 'number', width: '7%' },
    { property: 'ano',        label: 'Ano',           type: 'number', width: '6%' },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() { this.carregar(); }

  carregar() {
    this.carregando = true;
    this.http.get<any[]>(`${environment.apiUrl}/consumo/admin?mes=${this.mesAtual}&ano=${this.anoAtual}`)
      .subscribe({
        next: (r) => {
          this.registros = r.map((c) => ({
            ...c,
            percentual: c.limite ? ((c.quantidade / c.limite) * 100).toFixed(1) + '%' : '—',
          }));
          this.carregando = false;
        },
        error: () => { this.carregando = false; },
      });
  }
}
