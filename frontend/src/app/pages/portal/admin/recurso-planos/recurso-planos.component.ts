import { NotifService } from '../../../../services/notif.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PoModalComponent, PoModalAction, PoTableAction, PoTableColumn, PoSelectOption } from '@po-ui/ng-components';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-recurso-planos',
  standalone: false,
  templateUrl: './recurso-planos.component.html',
})
export class RecursosPlanosComponent implements OnInit {
  @ViewChild('modalAdd') modalAdd!: PoModalComponent;
  @ViewChild('modalEdit') modalEdit!: PoModalComponent;

  planos: any[] = [];
  planosOptions: PoSelectOption[] = [];
  recursosOptions: PoSelectOption[] = [];
  planoSelecionadoId = '';
  planoSelecionadoNome = '';
  associacoes: any[] = [];
  carregando = false;

  formAdd = { recursoId: '', descricaoExibicao: '', ordem: 0 };
  formEdit = { id: '', descricaoExibicao: '', ordem: 0 };

  colunas: PoTableColumn[] = [
    { property: 'recurso.nome',        label: 'Recurso',    width: '30%' },
    { property: 'recurso.slug',        label: 'Slug',       width: '22%' },
    { property: 'descricaoExibicao',   label: 'Exibição na LP', width: '30%' },
    { property: 'ordem',               label: 'Ordem', type: 'number', width: '8%' },
  ];

  acoes: PoTableAction[] = [
    { label: 'Editar',  icon: 'an an-pencil', action: (row: any) => this.editarAssoc(row) },
    { label: 'Remover', icon: 'an an-trash',  action: (row: any) => this.removerAssoc(row) },
  ];

  acaoAdd: PoModalAction = {
    label: 'Adicionar', loading: false,
    action: () => this.confirmarAdd(),
  };
  acaoCancelarAdd: PoModalAction = { label: 'Cancelar', action: () => this.modalAdd.close() };

  acaoSalvarEdit: PoModalAction = {
    label: 'Salvar', loading: false,
    action: () => this.confirmarEdit(),
  };
  acaoCancelarEdit: PoModalAction = { label: 'Cancelar', action: () => this.modalEdit.close() };

  constructor(private svc: AdminService, private notif: NotifService) {}

  ngOnInit() {
    this.svc.listarPlanos().subscribe((p) => {
      this.planos = p;
      this.planosOptions = p.map((pl: any) => ({ label: pl.nome, value: pl.id }));
    });
    this.svc.listarRecursos().subscribe((r) => {
      this.recursosOptions = r
        .filter((rc: any) => rc.ativo)
        .map((rc: any) => ({ label: rc.nome, value: rc.id }));
    });
  }

  onPlanoChange(planoId: string) {
    this.planoSelecionadoId = planoId;
    const pl = this.planos.find((p) => p.id === planoId);
    this.planoSelecionadoNome = pl?.nome ?? '';
    this.carregarAssociacoes();
  }

  carregarAssociacoes() {
    if (!this.planoSelecionadoId) return;
    this.carregando = true;
    this.svc.listarRecursosDePlano(this.planoSelecionadoId).subscribe({
      next: (a) => { this.associacoes = a; this.carregando = false; },
      error: () => { this.carregando = false; },
    });
  }

  abrirAdd() {
    this.formAdd = { recursoId: '', descricaoExibicao: '', ordem: this.associacoes.length + 1 };
    this.modalAdd.open();
  }

  confirmarAdd() {
    (this.acaoAdd as any).loading = true;
    this.svc.addRecursoAoPlano(this.planoSelecionadoId, this.formAdd).subscribe({
      next: () => {
        this.notif.success('Recurso adicionado ao plano.');
        this.modalAdd.close();
        this.carregarAssociacoes();
        (this.acaoAdd as any).loading = false;
      },
      error: (err: any) => {
        this.notif.error(err.error?.message ?? 'Erro ao adicionar.');
        (this.acaoAdd as any).loading = false;
      },
    });
  }

  editarAssoc(row: any) {
    this.formEdit = { id: row.id, descricaoExibicao: row.descricaoExibicao, ordem: row.ordem };
    this.modalEdit.open();
  }

  confirmarEdit() {
    (this.acaoSalvarEdit as any).loading = true;
    this.svc.updateRecursoDoPlano(this.planoSelecionadoId, this.formEdit.id, {
      descricaoExibicao: this.formEdit.descricaoExibicao,
      ordem: this.formEdit.ordem,
    }).subscribe({
      next: () => {
        this.notif.success('Associação atualizada.');
        this.modalEdit.close();
        this.carregarAssociacoes();
        (this.acaoSalvarEdit as any).loading = false;
      },
      error: () => {
        this.notif.error('Erro ao atualizar.');
        (this.acaoSalvarEdit as any).loading = false;
      },
    });
  }

  removerAssoc(row: any) {
    this.svc.removeRecursoDoPlano(this.planoSelecionadoId, row.id).subscribe({
      next: () => {
        this.associacoes = this.associacoes.filter((a) => a.id !== row.id);
        this.notif.success('Recurso removido do plano.');
      },
      error: () => this.notif.error('Erro ao remover.'),
    });
  }

  onRecursoChange(recursoId: string) {
    const rc = this.recursosOptions.find((r) => r.value === recursoId);
    if (rc && !this.formAdd.descricaoExibicao) {
      this.formAdd.descricaoExibicao = rc.label as string;
    }
  }
}
