import { Component, ViewChild } from '@angular/core';
import { PoNotificationService } from '@po-ui/ng-components';
import { PoPageDynamicTableComponent, PoPageDynamicTableActions, PoPageDynamicTableCustomTableAction } from '@po-ui/ng-templates';
import { environment } from '../../../../../environments/environment';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-usuarios-admin-list',
  standalone: false,
  template: `
    <po-page-dynamic-table
      #dynamicTable
      p-title="Usuários"
      [p-breadcrumb]="breadcrumb"
      [p-service-api]="apiService"
      [p-actions]="actions"
      [p-fields]="fields"
      [p-table-custom-actions]="tableCustomActions"
      [p-hide-columns-manager]="false"
      p-keep-filters="true"
      p-concat-filters="true">
    </po-page-dynamic-table>
  `,
})
export class UsuariosAdminListComponent {
  @ViewChild('dynamicTable') dynamicTable!: PoPageDynamicTableComponent;

  apiService = `${environment.apiUrl}/admin/usuarios-poui`;
  breadcrumb = { items: [{ label: 'Início', link: '/portal/dashboard' }, { label: 'Usuários', link: '/portal/usuarios-admin' }] };

  constructor(
    private adminService: AdminService,
    private notification: PoNotificationService,
  ) {}

  tableCustomActions: PoPageDynamicTableCustomTableAction[] = [
    {
      label: 'Desbloquear',
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
        this.notification.success(ativo ? 'Usuário desbloqueado.' : 'Usuário bloqueado.');
        this.dynamicTable?.updateDataTable();
      },
      error: () => this.notification.error('Erro ao alterar status do usuário.'),
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
    { property: 'nome', label: 'Nome', filter: true, sortable: true },
    { property: 'email', label: 'E-mail', filter: true, sortable: true },
    { property: 'cliente', label: 'Cliente', filter: true, sortable: false },
    {
      property: 'perfil', label: 'Perfil', type: 'label',
      filter: true,
      forceOptionsComponentType: 'select',
      options: [{ label: 'Cliente', value: 'cliente' }, { label: 'Administrador', value: 'admin' }],
      labels: [
        { value: 'cliente', color: 'color-02', label: 'Cliente' },
        { value: 'admin', color: 'color-08', label: 'Admin' },
      ],
    },
    {
      property: 'principal', label: 'Função', type: 'label',
      labels: [
        { value: 1, color: 'color-08', label: 'Principal' },
        { value: 0, color: 'color-02', label: 'Usuário' },
      ],
    },
    {
      property: 'ativoStatus', label: 'Status', type: 'label',
      filter: true,
      forceOptionsComponentType: 'select',
      options: [{ label: 'Ativo', value: 1 }, { label: 'Bloqueado', value: 0 }],
      labels: [
        { value: 1, color: 'color-10', label: 'Ativo' },
        { value: 0, color: 'color-07', label: 'Bloqueado' },
      ],
    },
    {
      property: 'emailVerificado', label: 'E-mail Verificado', type: 'label',
      filter: true,
      visible: false,
      forceOptionsComponentType: 'select',
      options: [{ label: 'Verificado', value: 1 }, { label: 'Pendente', value: 0 }],
      labels: [
        { value: 1, color: 'color-10', label: 'Verificado' },
        { value: 0, color: 'color-07', label: 'Pendente' },
      ],
    },
    { property: 'ultimoLogin', label: 'Último acesso', type: 'dateTime', format: 'dd/MM/yyyy HH:mm', sortable: true },
    { property: 'criadoEm', label: 'Cadastro', type: 'date', format: 'dd/MM/yyyy', sortable: true },
  ];

  // Manutenção de usuário não exclui — apenas bloqueia (regra cliente × usuário)
  actions: PoPageDynamicTableActions = {
    edit: '/portal/clientes/edit/:id',
    detail: '/portal/clientes/view/:id',
  };
}
