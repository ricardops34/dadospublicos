import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PoChartSerie, PoChartType } from '@po-ui/ng-components';
import { ClientePortalService } from '../cliente.service';

@Component({
  selector: 'app-consumo',
  standalone: false,
  templateUrl: './consumo.component.html',
})
export class ConsumoComponent implements OnInit {
  historico: any[] = [];
  assinatura: any = null;
  carregando = true;

  readonly chartTypeLine = PoChartType.Line;
  chartSeries: PoChartSerie[] = [];
  chartCategories: string[] = [];

  constructor(private svc: ClientePortalService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.svc.minhaAssinatura().subscribe({ next: (a) => { this.assinatura = a; }, error: () => {} });

    this.svc.meuConsumo().subscribe({
      next: (rows) => {
        this.historico = rows.map(r => ({
          ...r,
          competencia: `${String(r.mes).padStart(2, '0')}/${r.ano}`,
        })).reverse();

        this.chartCategories = this.historico.map(r => r.competencia);
        this.chartSeries = [{ label: 'Requisições', data: this.historico.map(r => r.quantidade) }];
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => { this.carregando = false; this.cdr.detectChanges(); },
    });
  }

  get mesAtual(): any {
    const now = new Date();
    return this.historico.find(r => r.mes === now.getMonth() + 1 && r.ano === now.getFullYear());
  }

  get percentualUso(): number {
    if (!this.mesAtual || !this.assinatura?.limite_mensal) return 0;
    return Math.min(100, Math.round((this.mesAtual.quantidade / this.assinatura.limite_mensal) * 100));
  }
}
