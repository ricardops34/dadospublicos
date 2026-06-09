import { Component } from '@angular/core';
import { PoPageDynamicTableActions } from '@po-ui/ng-templates';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-modulos-list',
  standalone: false,
  template: `
    <po-page-dynamic-table
      p-title="Módulos de Menu"
      [p-breadcrumb]="breadcrumb"
      [p-service-api]="apiService"
      [p-actions]="actions"
      [p-fields]="fields"
      [p-hide-columns-manager]="true"
      p-keep-filters="true">
    </po-page-dynamic-table>
  `,
})
export class ModulosListComponent {
  apiService = `${environment.apiUrl}/menu/modulos`;

  breadcrumb = {
    items: [
      { label: 'Início', link: '/portal/dashboard' },
      { label: 'Módulos de Menu', link: '/portal/modulos' },
    ],
  };

  actions: PoPageDynamicTableActions = {
    new: '/portal/modulos/new',
    edit: '/portal/modulos/edit/:id',
    remove: true,
  };

  fields: any[] = [
    { property: 'id', key: true, visible: false },
    { property: 'nome', label: 'Nome', filter: true },
    { property: 'shortLabel', label: 'Label curto' },
    { property: 'icone', label: 'Ícone' },
    { property: 'ordem', label: 'Ordem' },
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
