import { NotifService } from '../../../../services/notif.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  PoModalComponent, PoModalAction,
  PoTableAction, PoTableColumn, PoSelectOption,
} from '@po-ui/ng-components';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-portal-faturas',
  standalone: false,
  templateUrl: './faturas.component.html',
})
export class PortalFaturasComponent implements OnInit {
  @ViewChild('modalPagamento') modalPagamento!: PoModalComponent;

  faturas: any[] = [];
  total = 0;
  pagina = 1;
  limite = 20;
  carregando = false;
  filtroStatus = '';

  // Campos do modal de pagamento
  faturaSelecionada: any = null;
  numeroNf = '';
  urlNf = '';
  salvando = false;

  statusOptions: PoSelectOption[] = [
    { label: 'Todas',     value: '' },
    { label: 'Pendente',  value: 'pendente' },
    { label: 'Paga',      value: 'paga' },
    { label: 'Vencida',   value: 'vencida' },
    { label: 'Cancelada', value: 'cancelada' },
  ];

  colunas: PoTableColumn[] = [
    { property: 'cliente',       label: 'Cliente',   width: '20%' },
    { property: 'plano',         label: 'Plano',     width: '12%' },
    { property: 'competencia',   label: 'Competência',width: '11%' },
    { property: 'valor',         label: 'Valor (R$)', type: 'currency', format: 'BRL', width: '10%' },
    {
      property: 'status', label: 'Status', type: 'label', width: '10%',
      labels: [
        { value: 'pendente',  label: 'Pendente',  color: 'color-07' },
        { value: 'paga',      label: 'Paga',      color: 'color-10' },
        { value: 'vencida',   label: 'Vencida',   color: 'color-05' },
        { value: 'cancelada', label: 'Cancelada', color: 'color-03' },
      ],
    },
    { property: 'dataVencimento', label: 'Vencimento', type: 'date', format: 'dd/MM/yyyy', width: '11%' },
    { property: 'dataPagamento',  label: 'Pagamento',  type: 'date', format: 'dd/MM/yyyy', width: '11%' },
    { property: 'numeroNf',       label: 'NF',          width: '8%' },
    { property: 'totalRequisicoes', label: 'Req.', type: 'number', width: '7%' },
  ];

  acoes: PoTableAction[] = [
    {
      label: 'Marcar como paga', icon: 'an an-check-circle',
      action: (row: any) => this.abrirModalPagamento(row),
      disabled: (row: any) => row.status === 'paga' || row.status === 'cancelada',
    },
  ];

  confirmacaoPagamento: PoModalAction = {
    label: 'Confirmar pagamento',
    action: () => this.confirmarPagamento(),
    loading: false,
  };

  cancelarPagamento: PoModalAction = {
    label: 'Cancelar',
    action: () => this.modalPagamento.close(),
  };

  constructor(private svc: AdminService, private notif: NotifService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.carregar(); }

  carregar() {
    this.carregando = true;
    this.svc.listarFaturas(this.filtroStatus || undefined, this.pagina, this.limite).subscribe({
      next: ([lista, count]: [any[], number]) => {
        this.faturas = lista.map(f => ({
          ...f,
          cliente:    f.assinatura?.cliente?.nome ?? '—',
          plano:      f.assinatura?.plano?.nome ?? '—',
          competencia: `${String(f.mes).padStart(2, '0')}/${f.ano}`,
        }));
        this.total = count;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => { this.carregando = false; this.cdr.detectChanges(); },
    });
  }

  abrirModalPagamento(row: any) {
    this.faturaSelecionada = row;
    this.numeroNf = '';
    this.urlNf = '';
    this.modalPagamento.open();
  }

  confirmarPagamento() {
    if (!this.faturaSelecionada) return;
    this.salvando = true;
    (this.confirmacaoPagamento as any).loading = true;
    this.svc.marcarFaturaPaga(this.faturaSelecionada.id, this.numeroNf, this.urlNf).subscribe({
      next: (faturaAtualizada) => {
        const idx = this.faturas.findIndex(f => f.id === this.faturaSelecionada.id);
        if (idx >= 0) Object.assign(this.faturas[idx], { status: 'paga', dataPagamento: faturaAtualizada.dataPagamento, numeroNf: this.numeroNf });
        this.notif.success('Fatura marcada como paga.');
        this.modalPagamento.close();
        this.salvando = false;
        (this.confirmacaoPagamento as any).loading = false;
      },
      error: () => {
        this.notif.error('Erro ao confirmar pagamento.');
        this.salvando = false;
        (this.confirmacaoPagamento as any).loading = false;
      },
    });
  }

  gerarMensais() {
    this.svc.gerarFaturasMensais().subscribe({
      next: (r) => { this.notif.success(`${r.geradas} fatura(s) gerada(s).`); this.carregar(); },
      error: () => this.notif.error('Erro ao gerar faturas.'),
    });
  }

  onFiltroChange() { this.pagina = 1; this.carregar(); }
  onPaginaChange(p: number) { this.pagina = p; this.carregar(); }
}
