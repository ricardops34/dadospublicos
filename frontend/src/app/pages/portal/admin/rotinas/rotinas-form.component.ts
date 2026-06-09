import { Component } from '@angular/core';
import { PoPageDynamicEditActions } from '@po-ui/ng-templates';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-rotinas-form',
  standalone: false,
  template: `
    <po-page-dynamic-edit
      p-title="Rotina de Menu"
      [p-breadcrumb]="breadcrumb"
      [p-service-api]="apiService"
      [p-fields]="fields"
      [p-actions]="actions">
    </po-page-dynamic-edit>
  `,
})
export class RotinasFormComponent {
  apiService = `${environment.apiUrl}/menu/rotinas`;

  breadcrumb = {
    items: [
      { label: 'Início', link: '/portal/dashboard' },
      { label: 'Rotinas de Menu', link: '/portal/rotinas' },
      { label: 'Formulário' },
    ],
  };

  actions: PoPageDynamicEditActions = {
    cancel: '/portal/rotinas',
    save: '/portal/rotinas',
    saveNew: '/portal/rotinas/new',
  };

  fields: any[] = [
    { property: 'id', key: true, visible: false },
    { property: 'nome', label: 'Nome', required: true, gridColumns: 6 },
    { property: 'shortLabel', label: 'Label curto', gridColumns: 6 },
    { property: 'icone', label: 'Ícone', gridColumns: 6, help: 'Ex: an an-house' },
    { property: 'rota', label: 'Rota', gridColumns: 6, help: 'Ex: /portal/dashboard' },
    {
      property: 'tipo',
      label: 'Tipo',
      gridColumns: 4,
      options: [
        { label: 'Link', value: 'link' },
        { label: 'Danger', value: 'danger' },
      ],
    },
    { property: 'ordem', label: 'Ordem', type: 'number', gridColumns: 4 },
    { property: 'ativo', label: 'Ativo', type: 'boolean', booleanTrue: 'Sim', booleanFalse: 'Não', gridColumns: 4 },
    {
      property: 'moduloId',
      label: 'Módulo',
      gridColumns: 6,
      type: 'combo',
      optionsService: `${environment.apiUrl}/menu/modulos?pageSize=100`,
      fieldLabel: 'nome',
      fieldValue: 'id',
    },
    { property: 'recurso', label: 'Recurso (feature gate)', gridColumns: 6, help: 'Ex: painel-360' },
  ];
}
