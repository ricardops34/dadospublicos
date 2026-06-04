import { Component, OnInit } from '@angular/core';
import { PoNotificationService, PoTableAction, PoTableColumn, PoSelectOption } from '@po-ui/ng-components';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-portal-assinaturas',
  standalone: false,
  templateUrl: './assinaturas.component.html',
})
export class PortalAssinaturasComponent implements OnInit {
  assinaturas: any[] = [];
  total = 0;
  pagina = 1;
  limite = 20;
  carregando = false;
  filtroStatus = '';

  statusOptions: PoSelectOption[] = [
    { label: 'Todas',    value: '' },
    { label: 'Ativa',    value: 'ativa' },
    { label: 'Suspensa', value: 'suspensa' },
    { label: 'Cancelada',value: 'cancelada' },
    { label: 'Trial',    value: 'trial' },
  ];

  colunas: PoTableColumn[] = [
    { property: 'cliente', label: 'Cliente', width: '22%' },
    { property: 'email',   label: 'E-mail',  width: '22%' },
    { property: 'plano',   label: 'Plano',   width: '12%' },
    {
      property: 'status', label: 'Status', type: 'label', width: '11%',
      labels: [
        { value: 'ativa',     label: 'Ativa',     color: 'color-10' },
        { value: 'suspensa',  label: 'Suspensa',  color: 'color-07' },
        { value: 'cancelada', label: 'Cancelada', color: 'color-05' },
        { value: 'trial',     label: 'Trial',     color: 'color-08' },
      ],
    },
    { property: 'dataInicio',        label: 'Início',     type: 'date', format: 'dd/MM/yyyy', width: '11%' },
    { property: 'proximoVencimento', label: 'Vencimento', type: 'date', format: 'dd/MM/yyyy', width: '11%' },
    { property: 'token',  label: 'Token ativo', width: '11%' },
  ];

  acoes: PoTableAction[] = [
    {
      label: 'Suspender', icon: 'an an-lock',
      action: (row: any) => this.suspender(row),
      disabled: (row: any) => row.status !== 'ativa',
    },
    {
      label: 'Reativar', icon: 'an an-lock-open',
      action: (row: any) => this.reativar(row),
      disabled: (row: any) => row.status !== 'suspensa',
    },
  ];

  constructor(private svc: AdminService, private notif: PoNotificationService) {}

  ngOnInit() { this.carregar(); }

  carregar() {
    this.carregando = true;
    this.svc.listarAssinaturas(this.pagina, this.limite).subscribe({
      next: ([lista, count]: [any[], number]) => {
        this.assinaturas = lista
          .filter(a => !this.filtroStatus || a.status === this.filtroStatus)
          .map(a => ({
            ...a,
            cliente: a.cliente?.nome ?? '—',
            email:   a.cliente?.email ?? '—',
            plano:   a.plano?.nome ?? '—',
            token:   a.token?.ativo ? 'Sim' : 'Não',
          }));
        this.total = count;
        this.carregando = false;
      },
      error: () => { this.carregando = false; },
    });
  }

  suspender(row: any) {
    this.svc.suspenderAssinatura(row.id).subscribe({
      next: () => { row.status = 'suspensa'; row.token = 'Não'; this.notif.success('Assinatura suspensa.'); },
      error: () => this.notif.error('Erro ao suspender.'),
    });
  }

  reativar(row: any) {
    this.svc.reativarAssinatura(row.id).subscribe({
      next: () => { row.status = 'ativa'; row.token = 'Sim'; this.notif.success('Assinatura reativada.'); },
      error: () => this.notif.error('Erro ao reativar.'),
    });
  }

  onFiltroChange() { this.pagina = 1; this.carregar(); }
  onPaginaChange(p: number) { this.pagina = p; this.carregar(); }
}
