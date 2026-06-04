import { Component } from '@angular/core';
import { PoPageDynamicTableActions } from '@po-ui/ng-templates';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-clientes-list',
  standalone: false,
  template: `
    <po-page-dynamic-table
      p-title="Clientes"
      [p-breadcrumb]="breadcrumb"
      [p-service-api]="apiService"
      [p-actions]="actions"
      [p-fields]="fields"
      [p-hide-columns-manager]="true">
    </po-page-dynamic-table>
  `
})
export class ClientesListComponent {
  apiService = `${environment.apiUrl}/admin/clientes-poui`;
  breadcrumb = { items: [{ label: 'Início', link: '/portal/dashboard' }, { label: 'Clientes', link: '/portal/clientes' }] };

  fields: any[] = [
    { property: 'id', key: true, visible: false },
    {
      property: 'tipoPessoa', label: 'Tipo', type: 'label', labels: [
        { value: 'F', color: 'color-01', label: 'Física' },
        { value: 'J', color: 'color-08', label: 'Jurídica' }
      ]
    },
    { property: 'nome', label: 'Nome' },
    { property: 'email', label: 'E-mail' },
    {
      property: 'ativoStatus', label: 'Status', type: 'label', labels: [
        { value: 1, color: 'color-10', label: 'Ativo' },
        { value: 0, color: 'color-07', label: 'Suspenso' }
      ]
    },
    { property: 'plano', label: 'Plano' },
    { property: 'criadoEm', label: 'Cadastro', type: 'date', format: 'dd/MM/yyyy' }
  ];

  actions: PoPageDynamicTableActions = {
    new: '/portal/clientes/new',
    edit: '/portal/clientes/edit/:id',
    detail: '/portal/clientes/view/:id'
  };
}
