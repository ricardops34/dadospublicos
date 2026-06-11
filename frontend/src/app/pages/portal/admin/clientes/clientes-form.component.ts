import { HttpClient } from '@angular/common/http';
import { Component, HostListener, ViewChild } from '@angular/core';
import { PoPageDynamicEditActions, PoPageDynamicEditComponent } from '@po-ui/ng-templates';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

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
    this.fields = this.fields.map((field) => field.property === property ? { ...field, ...changes } : field);
  }

  private prepararMunicipio(uf: string, municipio: string): void {
    this.mudarUf({ value: uf });
    this.http
      .get<{ items?: Array<{ label: string; value: string }> }>(`${environment.apiUrl}/admin/clientes-poui/municipios/${uf}`)
      .pipe(
        map((res) => res.items ?? []),
        catchError(() => of([{ label: municipio, value: municipio }])),
      )
      .subscribe((items) => {
        const options = items.length ? items : [{ label: municipio, value: municipio }];
        this.atualizarCampo('municipio', { options, disabled: false });
      });
  }

  private enderecoParaFields(d: Record<string, any>): any[] {
    const campos: Array<[string, any]> = [
      ['logradouro', d['logradouro']],
      ['complemento', d['complemento']],
      ['bairro', d['bairro']],
      ['uf', d['uf']],
      ['municipio', d['municipio']],
      ['cep', d['cep']],
      ['numero', d['numero']],
      ['razaoSocial', d['razaoSocial']],
      ['nomeFantasia', d['nomeFantasia']],
      ['porteEmpresa', d['porteEmpresa']],
      ['situacaoCadastral', d['situacaoCadastral']],
      ['naturezaJuridicaCodigo', d['naturezaJuridicaCodigo']],
      ['naturezaJuridicaDescricao', d['naturezaJuridicaDescricao']],
      ['telefone', d['telefone']],
      ['email', d['email']],
      ['cnaePrincipal', d['cnaePrincipal']],
      ['cnaePrincipalDescricao', d['cnaePrincipalDescricao']],
    ];

    const fields: any[] = campos
      .filter(([, val]) => val !== undefined && val !== null && val !== '')
      .map(([property, value]) => ({ property, value }));

    if (Array.isArray(d['cnaesSecundarios']) && d['cnaesSecundarios'].length) {
      fields.push({ property: 'cnaesSecundarios', value: d['cnaesSecundarios'] });
    }
    return fields;
  }

  validarCpf = (changedValue: any) =>
    this.http.post(`${environment.apiUrl}/admin/clientes-poui/validate-cpf`, changedValue).pipe(
      catchError(() => of({ value: changedValue })),
    );

  validarCep = (changedValue: any) =>
    this.http.post(`${environment.apiUrl}/admin/clientes-poui/validate-cep`, changedValue).pipe(
      map((res: any) => {
        if (res?.fields?.length) {
          return { value: changedValue?.value ?? changedValue, fields: res.fields };
        }
        const d = res?.value ?? {};
        if (d.uf && d.municipio) this.prepararMunicipio(d.uf, d.municipio);
        else if (d.uf) this.mudarUf({ value: d.uf });
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
        else if (d.uf) this.mudarUf({ value: d.uf });
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
      if (['cpf', 'nome', 'dataNascimento'].includes(field.property)) {
        field.visible = tipo === 'F';
        field.required = tipo === 'F';
      }
      if (field.property === 'cnpj') {
        field.visible = tipo === 'J';
        field.required = tipo === 'J';
      }
      if (['razaoSocial', 'nomeFantasia', 'porteEmpresa', 'situacaoCadastral', 'cnaePrincipal', 'cnaesSecundarios', 'naturezaJuridicaCodigo', 'naturezaJuridicaDescricao'].includes(field.property)) {
        field.visible = tipo === 'J';
      }
      return field;
    });
    return { value: tipo };
  };

  onLoadData = (item: any) => {
    this.mudarTipoPessoa({ value: item.tipoPessoa || 'J' });
    if (item.uf) this.mudarUf({ value: item.uf });
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
  ] };

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
    { property: 'cpf', label: 'CPF', mask: '999.999.999-99', gridColumns: 4, visible: false, required: false, divider: 'Identificação', validate: this.validarCpf.bind(this) },
    { property: 'nome', label: 'Nome', required: true, gridColumns: 4, visible: false },
    { property: 'dataNascimento', label: 'Data Nascimento', type: 'date', format: 'dd/MM/yyyy', gridColumns: 4, visible: false },
    { property: 'cnpj', label: 'CNPJ', mask: '99.999.999/9999-99', gridColumns: 4, visible: true, required: true, divider: 'Identificação', validate: this.validarCnpj.bind(this) },
    { property: 'razaoSocial', label: 'Nome Empresarial (Razão Social)', gridColumns: 8, visible: true },
    { property: 'nomeFantasia', label: 'Título do Estabelecimento (Nome Fantasia)', gridColumns: 6, visible: true },
    { property: 'porteEmpresa', label: 'Porte da Empresa', gridColumns: 3, visible: true },
    { property: 'situacaoCadastral', label: 'Situação Cadastral', gridColumns: 3, visible: true },
    { property: 'cep', label: 'CEP', required: true, mask: '99999-999', divider: 'Endereço', gridColumns: 3, validate: this.validarCep.bind(this) },
    { property: 'logradouro', label: 'Logradouro', required: true, gridColumns: 5 },
    { property: 'numero', label: 'Número', required: true, gridColumns: 2 },
    { property: 'bairro', label: 'Bairro/Distrito', required: true, gridColumns: 4 },
    { property: 'uf', label: 'UF', required: true, gridColumns: 4, type: 'combo', optionsService: `${environment.apiUrl}/admin/clientes-poui/ufs`, validate: this.mudarUf.bind(this) },
    { property: 'municipio', label: 'Município', required: true, gridColumns: 4, type: 'combo', disabled: true },
    { property: 'complemento', label: 'Complemento', gridColumns: 4 },
    { property: 'telefone', label: 'Telefone', required: true, divider: 'Contatos', gridColumns: 6 },
    { property: 'email', label: 'Endereço de E-mail', required: true, gridColumns: 6 },
    { property: 'cnaePrincipal', label: 'Código e Descrição da Atividade Econômica Principal (CNAE Principal)', type: 'combo', gridColumns: 6, visible: true, divider: 'Atividade Econômica', optionsService: `${environment.apiUrl}/admin/clientes-poui/cnaes` },
    { property: 'cnaesSecundarios', label: 'Código e Descrição das Atividades Econômicas Secundárias (CNAEs Secundários)', gridColumns: 6, visible: true, optionsMulti: true, optionsService: `${environment.apiUrl}/admin/clientes-poui/cnaes` },
    { property: 'naturezaJuridicaCodigo', label: 'Natureza Jurídica', gridColumns: 4, visible: true },
    { property: 'naturezaJuridicaDescricao', label: 'Descrição da Natureza Jurídica', gridColumns: 8, visible: true },
  ];
}
