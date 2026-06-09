import { Component } from '@angular/core';
import { PoPageDynamicTableActions } from '@po-ui/ng-templates';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-perfis-list',
  standalone: false,
  template: `
    <po-page-dynamic-table
      p-title="Perfis de Acesso"
      [p-breadcrumb]="breadcrumb"
      [p-service-api]="apiService"
      [p-actions]="actions"
      [p-fields]="fields"
      [p-hide-columns-manager]="true"
      p-keep-filters="true">
    </po-page-dynamic-table>
  `,
})
export class PerfisListComponent {
  apiService = `${environment.apiUrl}/menu/perfis`;

  breadcrumb = {
    items: [
      { label: 'Início', link: '/portal/dashboard' },
      { label: 'Perfis', link: '/portal/perfis' },
    ],
  };

  actions: PoPageDynamicTableActions = {
    new: '/portal/perfis/new',
    edit: '/portal/perfis/edit/:id',
    remove: true,
  };

  fields: any[] = [
    { property: 'id', key: true, visible: false },
    { property: 'codigo', label: 'Código', filter: true },
    { property: 'nome', label: 'Nome', filter: true },
    { property: 'descricao', label: 'Descrição', visible: false },
    {
      property: 'ativo',
      label: 'Status',
      type: 'label',
      labels: [
        { value: true, color: 'color-10', label: 'Ativo' },
        { value: false, color: 'color-07', label: 'Inativo' },
      ],
    },
  ];
}
