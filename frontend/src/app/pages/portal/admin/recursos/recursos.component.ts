import { NotifService } from '../../../../services/notif.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PoModalComponent, PoModalAction, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-portal-recursos',
  standalone: false,
  templateUrl: './recursos.component.html',
})
export class PortalRecursosComponent implements OnInit {
  @ViewChild('modal') modal!: PoModalComponent;

  recursos: any[] = [];
  carregando = false;
  modoEdicao = false;
  form = { id: '', nome: '', slug: '', ativo: true };

  colunas: PoTableColumn[] = [
    { property: 'nome',  label: 'Nome',  width: '35%' },
    { property: 'slug',  label: 'Slug',  width: '35%' },
    {
      property: 'ativo', label: 'Status', type: 'label', width: '15%',
      labels: [
        { value: 1, label: 'Ativo',   color: 'color-10' },
        { value: 0, label: 'Inativo', color: 'color-05' },
      ],
    },
    { property: 'criadoEm', label: 'Criado em', type: 'date', format: 'dd/MM/yyyy', width: '15%' },
  ];

  acoes: PoTableAction[] = [
    { label: 'Editar',    icon: 'an an-pencil', action: (row: any) => this.editar(row) },
    { label: 'Desativar', icon: 'an an-trash',  action: (row: any) => this.desativar(row), disabled: (row: any) => !row.ativo },
  ];

  acaoSalvar: PoModalAction = {
    label: 'Salvar', loading: false,
    action: () => this.salvar(),
  };
  acaoCancelar: PoModalAction = { label: 'Cancelar', action: () => this.modal.close() };

  constructor(private svc: AdminService, private notif: NotifService) {}

  ngOnInit() { this.carregar(); }

  carregar() {
    this.carregando = true;
    this.svc.listarRecursos().subscribe({
      next: (r) => {
        this.recursos = r.map((rc: any) => ({ ...rc, ativo: rc.ativo ? 1 : 0 }));
        this.carregando = false;
      },
      error: () => { this.carregando = false; },
    });
  }

  novo() {
    this.modoEdicao = false;
    this.form = { id: '', nome: '', slug: '', ativo: true };
    this.modal.open();
  }

  editar(row: any) {
    this.modoEdicao = true;
    this.form = { id: row.id, nome: row.nome, slug: row.slug, ativo: row.ativo };
    this.modal.open();
  }

  salvar() {
    (this.acaoSalvar as any).loading = true;
    const obs = this.modoEdicao
      ? this.svc.atualizarRecurso(this.form.id, { nome: this.form.nome, ativo: this.form.ativo })
      : this.svc.criarRecurso({ nome: this.form.nome, slug: this.form.slug });

    obs.subscribe({
      next: () => {
        this.notif.success(this.modoEdicao ? 'Recurso atualizado.' : 'Recurso criado.');
        this.modal.close();
        this.carregar();
        (this.acaoSalvar as any).loading = false;
      },
      error: (err: any) => {
        this.notif.error(err.error?.message ?? 'Erro ao salvar.');
        (this.acaoSalvar as any).loading = false;
      },
    });
  }

  desativar(row: any) {
    this.svc.desativarRecurso(row.id).subscribe({
      next: () => { row.ativo = false; this.notif.success('Recurso desativado.'); },
      error: () => this.notif.error('Erro ao desativar.'),
    });
  }

  autoSlug() {
    if (!this.modoEdicao) {
      this.form.slug = this.form.nome
        .toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }
  }
}
