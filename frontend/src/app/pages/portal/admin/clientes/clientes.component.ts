import { NotifService } from '../../../../services/notif.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  PoModalComponent,
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
    {
      property: 'emailVerificado', label: 'E-mail', type: 'label', width: '10%',
      labels: [
        { value: 1, label: 'Verificado', color: 'color-10' },
        { value: 0, label: 'Pendente',   color: 'color-07' },
      ],
    },
    { property: 'criadoEm', label: 'Cadastro', type: 'date', format: 'dd/MM/yyyy', width: '12%' },
    { property: 'ultimoLogin', label: 'Último acesso', type: 'dateTime', width: '12%' },
  ];

  acoes: PoTableAction[] = [
    { label: 'Ver detalhe',        icon: 'an an-eye',          action: (row: any) => this.abrirDetalhe(row.id) },
    { label: 'Confirmar e-mail',   icon: 'an an-check-circle', action: (row: any) => this.confirmarEmail(row), disabled: (row: any) => row.emailVerificado },
    { label: 'Enviar reset senha', icon: 'an an-key',          action: (row: any) => this.enviarReset(row) },
    { label: 'Suspender',          icon: 'an an-lock',         action: (row: any) => this.alterarAtivo(row, false), disabled: (row: any) => !row.ativo },
    { label: 'Reativar',           icon: 'an an-lock-open',    action: (row: any) => this.alterarAtivo(row, true),  disabled: (row: any) => row.ativo },
  ];

  constructor(private svc: AdminService, private notif: NotifService) {}

  ngOnInit() { this.carregar(); }

  carregar() {
    this.carregando = true;
    this.svc.listarClientes(this.pagina, this.limite).subscribe({
      next: ([lista, count]: [any[], number]) => {
        this.clientes = lista.map((c: any) => ({
          ...c,
          ativoStatus: c.ativo ? 1 : 0,
          emailVerificado: c.emailVerificado ? 1 : 0,
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

  confirmarEmail(row: any) {
    this.svc.confirmarEmailCliente(row.id).subscribe({
      next: () => { row.emailVerificado = true; this.notif.success('E-mail confirmado com sucesso.'); },
      error: () => this.notif.error('Erro ao confirmar e-mail.'),
    });
  }

  enviarReset(row: any) {
    this.svc.enviarResetSenhaCliente(row.id).subscribe({
      next: () => this.notif.success(`Link de redefinição enviado para ${row.email}.`),
      error: () => this.notif.error('Erro ao enviar link de redefinição.'),
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
