import { Component } from '@angular/core';
import { PoPageDynamicDetailActions } from '@po-ui/ng-templates';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-clientes-detail',
  standalone: false,
  template: `
    <po-page-dynamic-detail
      p-title="Detalhes do Cliente"
      [p-breadcrumb]="breadcrumb"
      [p-service-api]="apiService"
      [p-fields]="fields"
      [p-actions]="actions">
    </po-page-dynamic-detail>
  `
})
export class ClientesDetailComponent {
  apiService = `${environment.apiUrl}/admin/clientes-poui`;
  breadcrumb = { items: [{ label: 'Início', link: '/portal/dashboard' }, { label: 'Clientes', link: '/portal/clientes' }, { label: 'Detalhes' }] };

  actions: PoPageDynamicDetailActions = {
    back: '/portal/clientes',
    edit: '/portal/clientes/edit/:id',
    remove: '/portal/clientes'
  };

  fields: any[] = [
    { property: 'id', key: true, visible: false },
    { property: 'nome', label: 'Nome', gridColumns: 6 },
    { property: 'email', label: 'E-mail', gridColumns: 6 },
    {
      property: 'tipoPessoa', label: 'Tipo', gridColumns: 6, type: 'label', labels: [
        { value: 'F', color: 'color-01', label: 'Física' },
        { value: 'J', color: 'color-08', label: 'Jurídica' }
      ]
    },
    { property: 'telefone', label: 'Telefone', gridColumns: 6 },
    { property: 'cpf', label: 'CPF', gridColumns: 6 },
    { property: 'dataNascimento', label: 'Data de Nascimento', type: 'date', format: 'dd/MM/yyyy', gridColumns: 6 },
    { property: 'cnpj', label: 'CNPJ', gridColumns: 6 },
    { property: 'razaoSocial', label: 'Razão Social', gridColumns: 12 },
    { property: 'cep', label: 'CEP', divider: 'Endereço', gridColumns: 3 },
    { property: 'uf', label: 'UF', gridColumns: 4 },
    { property: 'municipio', label: 'Município', gridColumns: 4 },
    { property: 'logradouro', label: 'Logradouro', gridColumns: 5 },
    { property: 'numero', label: 'Número', gridColumns: 2 },
    { property: 'complemento', label: 'Complemento', gridColumns: 2 },
    { property: 'bairro', label: 'Bairro', gridColumns: 4 }
  ];
}
