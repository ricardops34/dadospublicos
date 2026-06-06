import { Component, ViewChild } from '@angular/core';
import { PoNotificationService } from '@po-ui/ng-components';
import { PoPageDynamicTableComponent, PoPageDynamicTableActions, PoPageDynamicTableCustomTableAction } from '@po-ui/ng-templates';
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
  ) {}

  tableCustomActions: PoPageDynamicTableCustomTableAction[] = [
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
      label: 'Validar E-mail',
      icon: 'an an-envelope-simple-check',
      visible: (row: any) => row.emailVerificado === 0,
      action: (row: any) => this.validarEmail(row.id),
    },
    {
      label: 'Reenviar Senha',
      icon: 'an an-key',
      action: (row: any) => this.reenviarSenha(row.id),
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

  private validarEmail(id: string) {
    this.adminService.confirmarEmailCliente(id).subscribe({
      next: () => {
        this.notification.success('E-mail validado com sucesso.');
        this.dynamicTable?.updateDataTable();
      },
      error: () => this.notification.error('Erro ao validar e-mail.'),
    });
  }

  private reenviarSenha(id: string) {
    this.adminService.enviarResetSenhaCliente(id).subscribe({
      next: () => this.notification.success('Link de definição de senha enviado.'),
      error: () => this.notification.error('Erro ao enviar link de senha.'),
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
    { property: 'email', label: 'E-mail', filter: true },
    { property: 'cpf', label: 'CPF', filter: true, visible: false },
    { property: 'cnpj', label: 'CNPJ', filter: true, visible: false },
    {
      property: 'emailVerificado', label: 'E-mail Verificado', type: 'label',
      filter: true,
      forceOptionsComponentType: 'select',
      options: [{ label: 'Verificado', value: 1 }, { label: 'Pendente', value: 0 }],
      labels: [
        { value: 1, color: 'color-10', label: 'Verificado' },
        { value: 0, color: 'color-07', label: 'Pendente' },
      ],
    },
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
    edit: '/portal/clientes/edit/:id',
    detail: '/portal/clientes/view/:id',
    remove: true,
  };
}
