import { Component } from '@angular/core';
import { PoPageDynamicEditActions } from '@po-ui/ng-templates';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-modulos-form',
  standalone: false,
  template: `
    <po-page-dynamic-edit
      p-title="Módulo de Menu"
      [p-breadcrumb]="breadcrumb"
      [p-service-api]="apiService"
      [p-fields]="fields"
      [p-actions]="actions">
    </po-page-dynamic-edit>
  `,
})
export class ModulosFormComponent {
  apiService = `${environment.apiUrl}/menu/modulos`;

  breadcrumb = {
    items: [
      { label: 'Início', link: '/portal/dashboard' },
      { label: 'Módulos de Menu', link: '/portal/modulos' },
      { label: 'Formulário' },
    ],
  };

  actions: PoPageDynamicEditActions = {
    cancel: '/portal/modulos',
    save: '/portal/modulos',
    saveNew: '/portal/modulos/new',
  };

  fields: any[] = [
    { property: 'id', key: true, visible: false },
    { property: 'nome', label: 'Nome', required: true, gridColumns: 6 },
    { property: 'shortLabel', label: 'Label curto', gridColumns: 6, help: 'Ex: Financeiro' },
    { property: 'icone', label: 'Ícone', gridColumns: 6, help: 'Ex: an an-gear' },
    { property: 'ordem', label: 'Ordem', type: 'number', gridColumns: 3 },
    { property: 'ativo', label: 'Ativo', type: 'boolean', booleanTrue: 'Sim', booleanFalse: 'Não', gridColumns: 3 },
  ];
}
