import { Component, ViewChild } from '@angular/core';
import { PoNotificationService } from '@po-ui/ng-components';
import { PoPageDynamicTableActions, PoPageDynamicTableComponent, PoPageDynamicTableCustomTableAction } from '@po-ui/ng-templates';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-clientes-list',
  standalone: false,
  template: `
    <po-page-dynamic-table
      #dynamicTable
      p-title="Clientes"
      [p-breadcrumb]="breadcrumb"
      [p-service-api]="apiService"
      [p-actions]="actions"
      [p-fields]="fields"
      [p-table-custom-actions]="tableCustomActions"
      [p-hide-columns-manager]="true"
      p-keep-filters="true"
      p-concat-filters="true">
    </po-page-dynamic-table>
  `,
})
export class ClientesListComponent {
  @ViewChild('dynamicTable') dynamicTable!: PoPageDynamicTableComponent;

  apiService = `${environment.apiUrl}/admin/clientes-poui`;
  breadcrumb = { items: [{ label: 'Início', link: '/portal/dashboard' }, { label: 'Clientes', link: '/portal/clientes' }] };

  constructor(
    private adminService: AdminService,
    private notification: PoNotificationService,
    private router: Router,
  ) {}

  tableCustomActions: PoPageDynamicTableCustomTableAction[] = [
    {
      label: 'Visualizar',
      icon: 'an an-eye',
      action: (row: any) => this.router.navigate(['/portal/clientes/view', row.id]),
    },
    {
      label: 'Editar',
      icon: 'an an-pencil-simple',
      action: (row: any) => this.router.navigate(['/portal/clientes/edit', row.id]),
    },
    {
      label: 'Ativar',
      icon: 'an an-check-circle',
      visible: (row: any) => row.ativoStatus === 0,
      action: (row: any) => this.toggleAtivo(row.id, true),
    },
    {
      label: 'Bloquear',
      icon: 'an an-lock',
      visible: (row: any) => row.ativoStatus === 1,
      action: (row: any) => this.toggleAtivo(row.id, false),
    },
    {
      label: 'Reenviar Senha',
      icon: 'an an-key',
      visible: (row: any) => !!row.usuarioPrincipalId,
      action: (row: any) => this.reenviarSenhaPrincipal(row),
    },
    {
      label: 'Criar Usuário Principal',
      icon: 'an an-user-plus',
      visible: (row: any) => !row.usuarioPrincipalId,
      action: (row: any) => this.criarUsuarioPrincipal(row),
    },
    {
      label: 'Excluir',
      icon: 'an an-trash',
      action: (row: any) => this.excluirCliente(row),
    },
  ];

  private toggleAtivo(id: string, ativo: boolean) {
    this.adminService.ativarCliente(id, ativo).subscribe({
      next: () => {
        this.notification.success(ativo ? 'Cliente ativado.' : 'Cliente bloqueado.');
        this.dynamicTable?.updateDataTable();
      },
      error: () => this.notification.error('Erro ao alterar status do cliente.'),
    });
  }

  private reenviarSenhaPrincipal(row: any) {
    if (!row?.usuarioPrincipalId) {
      this.notification.warning('Cliente sem usuário principal vinculado.');
      return;
    }

    this.adminService.enviarResetSenhaCliente(row.usuarioPrincipalId).subscribe({
      next: () => this.notification.success('Link de definição de senha enviado ao usuário principal.'),
      error: () => this.notification.error('Erro ao enviar link de senha do usuário principal.'),
    });
  }

  private criarUsuarioPrincipal(row: any) {
    if (!window.confirm(`Criar usuário principal para ${row?.nome ?? 'este cliente'}?`)) return;

    this.adminService.criarUsuarioPrincipalCliente(row.id).subscribe({
      next: () => {
        this.notification.success('Usuário principal criado e link de definição de senha enviado.');
        this.dynamicTable?.updateDataTable();
      },
      error: (error) => {
        const mensagem = error?.error?.message || 'Erro ao criar usuário principal.';
        this.notification.error(mensagem);
      },
    });
  }

  private excluirCliente(row: any) {
    if (!window.confirm(`Confirma a exclusão do cliente ${row?.nome ?? ''}?`)) return;

    this.adminService.agendarExclusaoCliente(row.id, 'agora').subscribe({
      next: () => {
        this.notification.success('Solicitação de exclusão registrada.');
        this.dynamicTable?.updateDataTable();
      },
      error: () => this.notification.error('Erro ao excluir cliente.'),
    });
  }

  fields: any[] = [
    { property: 'id', key: true, visible: false },
    {
      property: 'tipoPessoa', label: 'Tipo', type: 'label',
      filter: true,
      forceOptionsComponentType: 'select',
      options: [{ label: 'Física', value: 'F' }, { label: 'Jurídica', value: 'J' }],
      labels: [
        { value: 'F', color: 'color-01', label: 'Física' },
        { value: 'J', color: 'color-08', label: 'Jurídica' },
      ],
    },
    { property: 'nome', label: 'Nome', filter: true },
    { property: 'email', label: 'E-mail de Contato', filter: true },
    { property: 'cpf', label: 'CPF', filter: true, visible: false },
    { property: 'cnpj', label: 'CNPJ', filter: true, visible: false },
    {
      property: 'ativoStatus', label: 'Status', type: 'label',
      filter: true,
      forceOptionsComponentType: 'select',
      options: [{ label: 'Ativo', value: 1 }, { label: 'Suspenso', value: 0 }],
      labels: [
        { value: 1, color: 'color-10', label: 'Ativo' },
        { value: 0, color: 'color-07', label: 'Suspenso' },
      ],
    },
    { property: 'plano', label: 'Plano' },
    { property: 'criadoEm', label: 'Cadastro', type: 'date', format: 'dd/MM/yyyy' },
  ];

  actions: PoPageDynamicTableActions = {
    new: '/portal/clientes/new',
  };
}
