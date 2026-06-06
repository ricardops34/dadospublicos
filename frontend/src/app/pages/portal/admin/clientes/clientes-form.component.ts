import { Component, HostListener, ViewChild } from '@angular/core';
import { PoPageDynamicEditActions, PoPageDynamicEditComponent } from '@po-ui/ng-templates';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
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
      [p-load-data]="onLoadData.bind(this)">
    </po-page-dynamic-edit>
  `,
})
export class ClientesFormComponent {
  @ViewChild(PoPageDynamicEditComponent, { static: true }) pageEdit!: PoPageDynamicEditComponent;

  @HostListener('mousedown', ['$event'])
  onHostMousedown(event: MouseEvent) {
    const btn = (event.target as HTMLElement).closest('button');
    if (btn?.textContent?.trim() !== 'Cancelar') return;
    const form = (this.pageEdit as any)?.dynamicForm?.form;
    if (form?.dirty) form.markAsPristine();
  }

  apiService = `${environment.apiUrl}/admin/clientes-poui`;

  constructor(private http: HttpClient) {}

  private atualizarCampo(property: string, changes: Record<string, any>) {
    this.fields = this.fields.map((field) =>
      field.property === property ? { ...field, ...changes } : field,
    );
  }

  // Prepara o combo de município e retorna a lista de opções para incluir no retorno do validate
  private prepararMunicipio(uf: string, municipio: string): void {
    this.mudarUf({ value: uf });
    this.http
      .get<{ items?: Array<{ label: string; value: string }> }>(
        `${environment.apiUrl}/admin/clientes-poui/municipios/${uf}`,
      )
      .pipe(
        map((res) => res.items ?? []),
        catchError(() => of([{ label: municipio, value: municipio }])),
      )
      .subscribe((items) => {
        const options = items.length ? items : [{ label: municipio, value: municipio }];
        this.atualizarCampo('municipio', { options, disabled: false });
      });
  }

  // Converte objeto de dados de endereço em array de fields para o retorno do validate PO-UI
  private enderecoParaFields(d: Record<string, any>): any[] {
    const campos: Array<[string, string | null]> = [
      ['logradouro',  d['logradouro']],
      ['complemento', d['complemento']],
      ['bairro',      d['bairro']],
      ['uf',          d['uf']],
      ['municipio',   d['municipio']],
      ['cep',         d['cep']],
      ['numero',      d['numero']],
      ['razaoSocial', d['razaoSocial']],
    ];
    return campos
      .filter(([, val]) => val !== undefined && val !== null && val !== '')
      .map(([property, value]) => ({ property, value }));
  }

  validarCpf = (changedValue: any) => {
    return this.http.post(`${environment.apiUrl}/admin/clientes-poui/validate-cpf`, changedValue).pipe(
      catchError(() => of({ value: changedValue })),
    );
  };

  validarCep = (changedValue: any) => {
    return this.http.post(`${environment.apiUrl}/admin/clientes-poui/validate-cep`, changedValue).pipe(
      map((res: any) => {
        if (res?.fields?.length) {
          return { value: changedValue?.value ?? changedValue, fields: res.fields };
        }
        const d = res?.value ?? {};
        if (d.uf && d.municipio) this.prepararMunicipio(d.uf, d.municipio);
        else if (d.uf)           this.mudarUf({ value: d.uf });

        return {
          value: changedValue?.value ?? changedValue,
          fields: this.enderecoParaFields(d),
        };
      }),
      catchError(() => of({
        value: changedValue?.value ?? changedValue,
        fields: [{ property: 'cep', message: 'CEP não encontrado ou inválido' }],
      })),
    );
  };

  validarCnpj = (changedValue: any) => {
    const cnpj = (changedValue.value ?? '').replace(/\D/g, '');
    if (cnpj.length !== 14) return of({ value: changedValue.value });

    return this.http.post<any>(`${environment.apiUrl}/admin/clientes-poui/validate-cnpj`, changedValue).pipe(
      map((res: any) => {
        if (res?.fields?.length) {
          return { value: changedValue.value, fields: res.fields };
        }
        const d = res?.value ?? {};
        if (d.uf && d.municipio) this.prepararMunicipio(d.uf, d.municipio);
        else if (d.uf)           this.mudarUf({ value: d.uf });

        return {
          value: changedValue.value,
          fields: this.enderecoParaFields(d),
        };
      }),
      catchError(() => of({
        value: changedValue.value,
        fields: [{ property: 'cnpj', message: 'CNPJ inválido ou não encontrado' }],
      })),
    );
  };

  mudarTipoPessoa = (changedValue: any) => {
    const tipo = changedValue.value;

    this.fields = this.fields.map((field) => {
      if (field.property === 'cpf' || field.property === 'dataNascimento') {
        field.visible = tipo === 'F';
        field.required = tipo === 'F';
      }
      if (field.property === 'cnpj') {
        field.visible = tipo === 'J';
        field.required = tipo === 'J';
      }
      if (field.property === 'razaoSocial') {
        field.visible = tipo === 'J';
      }
      return field;
    });

    return { value: tipo };
  };

  onLoadData = (item: any) => {
    this.mudarTipoPessoa({ value: item.tipoPessoa || 'J' });
    if (item.uf) {
      this.mudarUf({ value: item.uf });
    }
    return item;
  };

  mudarUf = (changedValue: any) => {
    const uf = changedValue.value;

    this.fields = this.fields.map((field) => {
      if (field.property === 'municipio') {
        if (uf) {
          field.optionsService = `${environment.apiUrl}/admin/clientes-poui/municipios/${uf}`;
          field.disabled = false;
        } else {
          field.optionsService = undefined;
          field.disabled = true;
        }
      }
      return field;
    });

    return { value: uf };
  };

  breadcrumb = { items: [
    { label: 'Início', link: '/portal/dashboard' },
    { label: 'Clientes', link: '/portal/clientes' },
    { label: 'Formulário' },
  ]};

  actions: PoPageDynamicEditActions = {
    cancel: '/portal/clientes',
    save: '/portal/clientes',
    saveNew: '/portal/clientes/new',
  };

  fields: any[] = [
    { property: 'id', key: true, visible: false },
    {
      property: 'tipoPessoa',
      label: 'Tipo de Pessoa',
      required: true,
      options: [{ label: 'Física', value: 'F' }, { label: 'Jurídica', value: 'J' }],
      gridColumns: 6,
      validate: this.mudarTipoPessoa.bind(this),
    },
    { property: 'cnpj', label: 'CNPJ', mask: '99.999.999/9999-99', gridColumns: 6, visible: true, required: true, validate: this.validarCnpj.bind(this) },
    { property: 'razaoSocial', label: 'Razão Social', gridColumns: 6, visible: true },
    { property: 'cpf', label: 'CPF', mask: '999.999.999-99', gridColumns: 6, visible: false, required: false, validate: this.validarCpf.bind(this) },
    { property: 'dataNascimento', label: 'Data de Nascimento', type: 'date', format: 'dd/MM/yyyy', gridColumns: 6, visible: false },
    { property: 'nome', label: 'Nome', required: true, gridColumns: 6 },
    { property: 'email', label: 'E-mail', required: true, gridColumns: 6 },
    { property: 'telefone', label: 'Telefone', required: true, gridColumns: 6 },
    { property: 'whatsapp', label: 'WhatsApp', type: 'boolean', booleanTrue: 'Sim', booleanFalse: 'Não', gridColumns: 6 },
    { property: 'senha', label: 'Senha', secret: true, minLength: 8, gridColumns: 6, help: 'Preencha apenas se quiser alterar a senha' },
    { property: 'cep', label: 'CEP', required: true, mask: '99999-999', divider: 'Endereço', gridColumns: 3, validate: this.validarCep.bind(this) },
    { property: 'logradouro', label: 'Rua', required: true, gridColumns: 5 },
    { property: 'numero', label: 'Número', required: true, gridColumns: 2 },
    { property: 'bairro', label: 'Bairro', required: true, gridColumns: 4 },
    { property: 'uf', label: 'Estado', required: true, gridColumns: 4, type: 'combo', optionsService: `${environment.apiUrl}/admin/clientes-poui/ufs`, validate: this.mudarUf.bind(this) },
    { property: 'municipio', label: 'Município', required: true, gridColumns: 4, type: 'combo', disabled: true },
    { property: 'complemento', label: 'Complemento', gridColumns: 4 },
  ];
}
