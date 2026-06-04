import { Component, OnInit, ViewChild } from '@angular/core';
import {
  PoModalComponent, PoNotificationService,
  PoTableAction, PoTableColumn,
} from '@po-ui/ng-components';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-portal-clientes',
  standalone: false,
  templateUrl: './clientes.component.html',
})
export class PortalClientesComponent implements OnInit {
  @ViewChild('modalDetalhe') modalDetalhe!: PoModalComponent;

  clientes: any[] = [];
  total = 0;
  pagina = 1;
  limite = 20;
  carregando = false;

  clienteSelecionado: any = null;

  colunas: PoTableColumn[] = [
    { property: 'nome',  label: 'Nome',  width: '22%' },
    { property: 'email', label: 'E-mail', width: '28%' },
    {
      property: 'ativoStatus', label: 'Status', type: 'label', width: '10%',
      labels: [
        { value: 1, label: 'Ativo', color: 'color-10' },
        { value: 0, label: 'Suspenso', color: 'color-07' },
      ],
    },
    {
      property: 'plano', label: 'Plano', width: '14%',
      type: 'cellTemplate',
    },
    { property: 'criadoEm', label: 'Cadastro', type: 'date', format: 'dd/MM/yyyy', width: '13%' },
    { property: 'ultimoLogin', label: 'Último acesso', type: 'dateTime', width: '13%' },
  ];

  acoes: PoTableAction[] = [
    { label: 'Ver detalhe', icon: 'an an-eye', action: (row: any) => this.abrirDetalhe(row.id) },
    { label: 'Suspender', icon: 'an an-lock', action: (row: any) => this.alterarAtivo(row, false), disabled: (row: any) => !row.ativo },
    { label: 'Reativar', icon: 'an an-lock-open', action: (row: any) => this.alterarAtivo(row, true), disabled: (row: any) => row.ativo },
  ];

  constructor(private svc: AdminService, private notif: PoNotificationService) {}

  ngOnInit() { this.carregar(); }

  carregar() {
    this.carregando = true;
    this.svc.listarClientes(this.pagina, this.limite).subscribe({
      next: ([lista, count]: [any[], number]) => {
        this.clientes = lista.map((c: any) => ({
          ...c,
          ativoStatus: c.ativo ? 1 : 0,
          plano: c.assinaturas?.find((a: any) => a.status === 'ativa')?.plano?.nome ?? '—',
        }));
        this.total = count;
        this.carregando = false;
      },
      error: () => { this.carregando = false; },
    });
  }

  abrirDetalhe(id: string) {
    this.clienteSelecionado = null;
    this.svc.detalheCliente(id).subscribe(c => {
      this.clienteSelecionado = c;
      this.modalDetalhe.open();
    });
  }

  alterarAtivo(row: any, ativo: boolean) {
    this.svc.ativarCliente(row.id, ativo).subscribe({
      next: () => {
        row.ativo = ativo;
        this.notif.success(ativo ? 'Cliente reativado.' : 'Cliente suspenso.');
      },
      error: () => this.notif.error('Erro ao alterar status.'),
    });
  }

  onPaginaChange(p: number) {
    this.pagina = p;
    this.carregar();
  }

  planoAtivo(c: any): any {
    return c?.assinaturas?.find((a: any) => a.status === 'ativa') ?? null;
  }
}
