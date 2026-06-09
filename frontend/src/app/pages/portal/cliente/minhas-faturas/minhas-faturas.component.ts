import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PoTableColumn } from '@po-ui/ng-components';
import { UsuarioPortalService } from '../usuario.service';

@Component({
  selector: 'app-minhas-faturas',
  standalone: false,
  templateUrl: './minhas-faturas.component.html',
})
export class MinhasFaturasComponent implements OnInit {
  faturas: any[] = [];
  carregando = true;

  colunas: PoTableColumn[] = [
    { property: 'competencia',   label: 'Competência', width: '14%' },
    { property: 'plano',         label: 'Plano',       width: '16%' },
    { property: 'valor',         label: 'Valor (R$)',  type: 'currency', format: 'BRL', width: '13%' },
    {
      property: 'status', label: 'Status', type: 'label', width: '12%',
      labels: [
        { value: 'pendente',  label: 'Pendente',  color: 'color-07' },
        { value: 'paga',      label: 'Paga',      color: 'color-10' },
        { value: 'vencida',   label: 'Vencida',   color: 'color-05' },
        { value: 'cancelada', label: 'Cancelada', color: 'color-03' },
      ],
    },
    { property: 'dataVencimento', label: 'Vencimento', type: 'date', format: 'dd/MM/yyyy', width: '13%' },
    { property: 'dataPagamento',  label: 'Pagamento',  type: 'date', format: 'dd/MM/yyyy', width: '13%' },
    { property: 'nf',             label: 'NF',          width: '12%', type: 'link' },
    { property: 'totalRequisicoes', label: 'Req.',      type: 'number', width: '7%' },
  ];

  constructor(private svc: UsuarioPortalService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.svc.minhasFaturas().subscribe({
      next: (f) => {
        this.faturas = f.map((fatura: any) => ({
          ...fatura,
          plano: fatura.assinatura?.plano?.nome ?? '—',
          competencia: `${String(fatura.mes).padStart(2, '0')}/${fatura.ano}`,
          nf: fatura.urlNf ? { label: fatura.numeroNf || 'Ver NF', value: fatura.urlNf } : null,
        }));
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => { this.carregando = false; this.cdr.detectChanges(); },
    });
  }

  get totalPago(): number {
    return this.faturas.filter(f => f.status === 'paga').reduce((s, f) => s + +f.valor, 0);
  }

  get faturasPendentes(): number {
    return this.faturas.filter(f => f.status === 'pendente' || f.status === 'vencida').length;
  }
}
