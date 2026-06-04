import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { PoChartType, PoChartSerie } from '@po-ui/ng-components';

interface Relatorio {
  periodo_dias: number;
  total_visitas: number;
  total_conversoes: number;
  taxa_conversao: string;
  por_fonte: { fonte: string; total: string }[];
  por_campanha: { campanha: string; total: string; conversoes: string }[];
  por_dispositivo: { dispositivo: string; total: string }[];
  secoes_vistas: { secao: string; total: string }[];
  scroll_medio_percent: number;
  por_dia: { dia: string; visitas: string; conversoes: string }[];
}

@Component({
  selector: 'app-portal-analytics',
  standalone: false,
  templateUrl: './analytics.component.html',
})
export class PortalAnalyticsComponent implements OnInit {
  relatorio: Relatorio | null = null;
  carregando = true;
  dias = 30;

  readonly chartTypePie = PoChartType.Pie;
  readonly chartTypeLine = PoChartType.Line;
  readonly chartTypeBar = PoChartType.Bar;

  chartFontes: PoChartSerie[] = [];
  chartDispositivos: PoChartSerie[] = [];
  chartDiario: PoChartSerie[] = [];
  chartSecoes: PoChartSerie[] = [];

  periodoOptions = [
    { label: '7 dias', value: 7 },
    { label: '30 dias', value: 30 },
    { label: '90 dias', value: 90 },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.http.get<Relatorio>(`${environment.apiUrl}/analytics-lp/relatorio?dias=${this.dias}`)
      .subscribe({
        next: (r) => {
          this.relatorio = r;
          this.montarGraficos(r);
          this.carregando = false;
        },
        error: () => { this.carregando = false; },
      });
  }

  private montarGraficos(r: Relatorio) {
    this.chartFontes = r.por_fonte.map((f) => ({ label: f.fonte, data: [+f.total] }));

    this.chartDispositivos = r.por_dispositivo.map((d) => ({ label: d.dispositivo, data: [+d.total] }));

    this.chartSecoes = r.secoes_vistas.map((s) => ({ label: s.secao, data: [+s.total] }));

    const dias = r.por_dia.map((d) => new Date(d.dia).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
    this.chartDiario = [
      { label: 'Visitas', data: r.por_dia.map((d) => +d.visitas) },
      { label: 'Conversões', data: r.por_dia.map((d) => +d.conversoes) },
    ];
  }

  onPeriodoChange(valor: number) {
    this.dias = valor;
    this.carregar();
  }
}
