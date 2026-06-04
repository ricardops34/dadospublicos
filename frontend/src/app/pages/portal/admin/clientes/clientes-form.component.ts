import { Component, ViewChild } from '@angular/core';
import { PoPageDynamicEditActions, PoPageDynamicEditField, PoPageDynamicEditComponent } from '@po-ui/ng-templates';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-clientes-form',
  standalone: false,
  template: `
    <po-page-dynamic-edit
      p-title="Cliente"
      [p-breadcrumb]="breadcrumb"
      [p-service-api]="apiService"
      [p-fields]="fields"
      [p-actions]="actions"
      [p-load]="onLoad.bind(this)"
      [p-load-data]="onLoadData.bind(this)">
    </po-page-dynamic-edit>
  `
})
export class ClientesFormComponent {
  @ViewChild(PoPageDynamicEditComponent, { static: true }) pageEdit!: PoPageDynamicEditComponent;

  apiService = `${environment.apiUrl}/admin/clientes-poui`;

  constructor(private http: HttpClient) {}

  validarCep = (changedValue: any) => {
    return this.http.post(`${environment.apiUrl}/admin/clientes-poui/validate-cep`, changedValue).pipe(
      map((res: any) => {
        console.log('CEP Validado - Resposta da API:', res);
        
        // Forçar o preenchimento no formulário usando o NgForm do componente filho, pois
        // o validate às vezes não mescla automaticamente o objeto `value` no PO UI
        if (res.value && this.pageEdit && (this.pageEdit as any).dynamicForm) {
          
          // Injetar a opção no campo para que o combo a reconheça imediatamente 
          // sem precisar aguardar a API, evitando que o valor seja perdido ao salvar.
          this.fields = this.fields.map(f => {
            if (f.property === 'uf' && res.value.uf) {
              f.options = [{ label: res.value.uf, value: res.value.uf }];
            }
            if (f.property === 'municipio' && res.value.municipio) {
              f.options = [{ label: res.value.municipio, value: res.value.municipio }];
            }
            return f;
          });

          // Primeiro atualizamos os campos para habilitar o município
          if (res.value.uf) {
            this.mudarUf({ value: res.value.uf });
          }
          
          // Damos um pequeno atraso para o PO UI processar a habilitação do campo
          // antes de preenchê-lo, garantindo que o valor fique retido para gravação.
          setTimeout(() => {
            const ngForm = (this.pageEdit as any).dynamicForm.form;
            if (ngForm && ngForm.control) {
              ngForm.control.patchValue(res.value);
            }
          }, 50);
        }

        return res;
      }),
      catchError(err => {
        console.error('Erro na validação do CEP:', err);
        return of({ value: {}, fields: [{ property: 'cep', message: 'Erro ao validar CEP' }] });
      })
    );
  };

  mudarTipoPessoa = (changedValue: any) => {
    const tipo = changedValue.value;
    
    this.fields = this.fields.map(f => {
      if (f.property === 'cpf' || f.property === 'dataNascimento') {
        f.visible = tipo === 'F';
        f.required = tipo === 'F';
      }
      if (f.property === 'cnpj' || f.property === 'razaoSocial') {
        f.visible = tipo === 'J';
        f.required = tipo === 'J';
      }
      return f;
    });

    return { value: tipo };
  };

  onLoad = () => {
    return {};
  };

  onLoadData = (item: any) => {
    this.mudarTipoPessoa({ value: item.tipoPessoa || 'F' });
    if (item.uf) {
      this.mudarUf({ value: item.uf });
    }
    return {};
  };

  mudarUf = (changedValue: any) => {
    const uf = changedValue.value;
    
    this.fields = this.fields.map(f => {
      if (f.property === 'municipio') {
        if (uf) {
          f.optionsService = `${environment.apiUrl}/admin/clientes-poui/municipios/${uf}`;
          f.disabled = false;
        } else {
          f.optionsService = undefined;
          f.disabled = true;
        }
      }
      return f;
    });

    return { value: uf };
  };

  breadcrumb = { items: [{ label: 'Início', link: '/portal/dashboard' }, { label: 'Clientes', link: '/portal/clientes' }, { label: 'Formulário' }] };

  actions: PoPageDynamicEditActions = {
    cancel: '/portal/clientes',
    save: '/portal/clientes',
    saveNew: '/portal/clientes/new'
  };

  fields: any[] = [
    { property: 'id', key: true, visible: false },
    { property: 'nome', label: 'Nome', required: true, gridColumns: 6 },
    { property: 'email', label: 'E-mail', required: true, gridColumns: 6 },
    { property: 'senha', label: 'Senha', secret: true, minLength: 8, gridColumns: 6, help: 'Preencha apenas se quiser alterar a senha' },
    { property: 'tipoPessoa', label: 'Tipo de Pessoa', required: true, options: [{label: 'Física', value: 'F'}, {label: 'Jurídica', value: 'J'}], gridColumns: 6, validate: this.mudarTipoPessoa.bind(this) },
    { property: 'telefone', label: 'Telefone', required: true, gridColumns: 6 },
    { property: 'cpf', label: 'CPF', mask: '999.999.999-99', gridColumns: 6, visible: false },
    { property: 'dataNascimento', label: 'Data de Nascimento', type: 'date', format: 'dd/MM/yyyy', gridColumns: 6, visible: false },
    { property: 'cnpj', label: 'CNPJ', mask: '99.999.999/9999-99', gridColumns: 6, visible: false },
    { property: 'razaoSocial', label: 'Razão Social', gridColumns: 12, visible: false },
    { property: 'cep', label: 'CEP', required: true, mask: '99999-999', divider: 'Endereço', gridColumns: 3, validate: this.validarCep.bind(this) },
    { property: 'logradouro', label: 'Logradouro', required: true, gridColumns: 5 },
    { property: 'numero', label: 'Número', required: true, gridColumns: 2 },
    { property: 'complemento', label: 'Complemento', gridColumns: 2 },
    { property: 'bairro', label: 'Bairro', required: true, gridColumns: 4 },
    { property: 'uf', label: 'UF', required: true, gridColumns: 4, type: 'combo', optionsService: `${environment.apiUrl}/admin/clientes-poui/ufs`, validate: this.mudarUf.bind(this) },
    { property: 'municipio', label: 'Município', required: true, gridColumns: 4, type: 'combo', disabled: true }
  ];
}
