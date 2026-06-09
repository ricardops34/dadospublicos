import { Component } from '@angular/core';
import { PoPageDynamicTableActions } from '@po-ui/ng-templates';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-rotinas-list',
  standalone: false,
  template: `
    <po-page-dynamic-table
      p-title="Rotinas de Menu"
      [p-breadcrumb]="breadcrumb"
      [p-service-api]="apiService"
      [p-actions]="actions"
      [p-fields]="fields"
      [p-hide-columns-manager]="true"
      p-keep-filters="true">
    </po-page-dynamic-table>
  `,
})
export class RotinasListComponent {
  apiService = `${environment.apiUrl}/menu/rotinas`;

  breadcrumb = {
    items: [
      { label: 'Início', link: '/portal/dashboard' },
      { label: 'Rotinas de Menu', link: '/portal/rotinas' },
    ],
  };

  actions: PoPageDynamicTableActions = {
    new: '/portal/rotinas/new',
    edit: '/portal/rotinas/edit/:id',
    remove: true,
  };

  fields: any[] = [
    { property: 'id', key: true, visible: false },
    { property: 'nome', label: 'Nome', filter: true },
    { property: 'shortLabel', label: 'Label curto' },
    { property: 'icone', label: 'Ícone' },
    { property: 'rota', label: 'Rota' },
    {
      property: 'tipo',
      label: 'Tipo',
      type: 'label',
      labels: [
        { value: 'link', color: 'color-08', label: 'Link' },
        { value: 'danger', color: 'color-07', label: 'Danger' },
      ],
    },
    { property: 'ordem', label: 'Ordem' },
    { property: 'modulo.nome', label: 'Módulo' },
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
