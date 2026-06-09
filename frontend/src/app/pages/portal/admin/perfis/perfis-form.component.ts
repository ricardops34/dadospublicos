import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-perfis-form',
  standalone: false,
  template: `
    <po-page-default
      [p-title]="titulo"
      [p-breadcrumb]="breadcrumb"
      [p-actions]="pageActions">

      <po-tabs>
        <po-tab p-label="Dados do Perfil" [p-active]="true">
          <po-container>
            <div class="po-row">
              <po-input
                class="po-md-6"
                name="codigo"
                p-label="Código"
                p-help="Identificador único (ex: admin, cliente)"
                [(ngModel)]="form.codigo"
                p-required="true"
                [p-disabled]="isEdit ? 'true' : 'false'">
              </po-input>
              <po-input
                class="po-md-6"
                name="nome"
                p-label="Nome"
                [(ngModel)]="form.nome"
                p-required="true">
              </po-input>
            </div>
            <div class="po-row">
              <po-textarea
                class="po-md-12"
                name="descricao"
                p-label="Descrição"
                [(ngModel)]="form.descricao">
              </po-textarea>
            </div>
            <div class="po-row">
              <po-switch
                class="po-md-6"
                name="ativo"
                p-label="Ativo"
                p-label-on="Sim"
                p-label-off="Não"
                [(ngModel)]="form.ativo">
              </po-switch>
            </div>
          </po-container>
        </po-tab>

        <po-tab p-label="Rotinas de Acesso" [p-disabled]="!isEdit">
          <po-container>
            <po-button
              p-label="Salvar Acesso"
              p-icon="an an-floppy-disk"
              p-kind="primary"
              (p-click)="salvarRotinas()">
            </po-button>
            <br><br>
            <po-table
              [p-columns]="rotinasColunas"
              [p-items]="todasRotinas"
              [p-selectable]="true"
              [p-sort]="true"
              (p-selected)="onRotinaSelected($event)"
              (p-unselected)="onRotinaUnselected($event)"
              (p-all-selected)="onTodasSelecionadas($event)"
              (p-all-unselected)="onTodasDesselecionadas()">
            </po-table>
          </po-container>
        </po-tab>
      </po-tabs>
    </po-page-default>
  `,
})
export class PerfisFormComponent implements OnInit {
  isEdit = false;
  perfilId = '';
  titulo = 'Novo Perfil';

  form: any = {
    codigo: '',
    nome: '',
    descricao: '',
    ativo: true,
  };

  todasRotinas: any[] = [];
  rotinasSelected: any[] = [];

  rotinasColunas: PoTableColumn[] = [
    { property: 'nome', label: 'Nome' },
    { property: 'rota', label: 'Rota' },
    { property: 'tipo', label: 'Tipo' },
    { property: 'moduloNome', label: 'Módulo' },
  ];

  breadcrumb = {
    items: [
      { label: 'Início', link: '/portal/dashboard' },
      { label: 'Perfis', link: '/portal/perfis' },
      { label: 'Formulário' },
    ],
  };

  pageActions: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private notification: PoNotificationService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.perfilId = this.route.snapshot.paramMap.get('id') ?? '';
    this.isEdit = !!this.perfilId;
    this.titulo = this.isEdit ? 'Editar Perfil' : 'Novo Perfil';

    this.pageActions = [
      { label: 'Salvar', action: () => this.salvar(), icon: 'an an-floppy-disk' },
      { label: 'Cancelar', action: () => this.router.navigate(['/portal/perfis']) },
    ];

    this.carregarRotinas();

    if (this.isEdit) {
      this.http.get<any>(`${environment.apiUrl}/menu/perfis/${this.perfilId}`).subscribe({
        next: (p) => {
          this.form = { ...p };
          this.cdr.detectChanges();
        },
        error: () => this.notification.error('Erro ao carregar perfil.'),
      });
    }
  }

  private carregarRotinas() {
    this.http
      .get<{ items: any[] }>(`${environment.apiUrl}/menu/rotinas?pageSize=200`)
      .subscribe({
        next: (res) => {
          const base = (res.items ?? []).map((r) => ({
            ...r,
            moduloNome: r['modulo.nome'] ?? r.modulo?.nome ?? '—',
            $selected: false,
          }));

          if (this.isEdit) {
            this.http
              .get<string[]>(`${environment.apiUrl}/menu/perfis/${this.perfilId}/rotinas`)
              .subscribe({
                next: (ids) => {
                  this.todasRotinas = base.map((r) => ({ ...r, $selected: ids.includes(r.id) }));
                  this.rotinasSelected = this.todasRotinas.filter((r) => r.$selected);
                  this.cdr.detectChanges();
                },
              });
          } else {
            this.todasRotinas = base;
          }
        },
      });
  }

  onRotinaSelected(row: any) {
    if (!this.rotinasSelected.find((r) => r.id === row.id)) {
      this.rotinasSelected = [...this.rotinasSelected, row];
    }
  }

  onRotinaUnselected(row: any) {
    this.rotinasSelected = this.rotinasSelected.filter((r) => r.id !== row.id);
  }

  onTodasSelecionadas(rows: any[]) {
    this.rotinasSelected = [...rows];
  }

  onTodasDesselecionadas() {
    this.rotinasSelected = [];
  }

  salvar() {
    if (!this.form.codigo || !this.form.nome) {
      this.notification.warning('Preencha os campos obrigatórios.');
      return;
    }

    const req = this.isEdit
      ? this.http.put(`${environment.apiUrl}/menu/perfis/${this.perfilId}`, this.form)
      : this.http.post(`${environment.apiUrl}/menu/perfis`, this.form);

    req.subscribe({
      next: () => {
        this.notification.success('Perfil salvo com sucesso.');
        this.router.navigate(['/portal/perfis']);
      },
      error: () => this.notification.error('Erro ao salvar perfil.'),
    });
  }

  salvarRotinas() {
    const rotinaIds = this.rotinasSelected.map((r) => r.id);
    this.http
      .put(`${environment.apiUrl}/menu/perfis/${this.perfilId}/rotinas`, { rotinaIds })
      .subscribe({
        next: () => this.notification.success('Acesso às rotinas atualizado.'),
        error: () => this.notification.error('Erro ao salvar rotinas.'),
      });
  }
}
