import { NotifService } from '../../../../services/notif.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  PoModalComponent, PoModalAction,
  PoTableAction, PoTableColumn,
} from '@po-ui/ng-components';
import { AdminService } from '../admin.service';

interface PlanoForm {
  id?: string;
  nome: string;
  slug: string;
  descricao: string;
  precoMensal: number;
  precoSemestral: number;
  precoAnual: number;
  limiteMensal: number | null;
  rateLimitPorMinuto: number;
  acessoCnpj: boolean;
  acessoCnpjRaiz: boolean;
  acessoPesquisa: boolean;
  acessoGeocode: boolean;
  acessoSuframa: boolean;
  acessoMapa: boolean;
  maisPopular: boolean;
  seloDestaque: string;
  ordem: number;
}

const FORM_VAZIO: PlanoForm = {
  nome: '', slug: '', descricao: '',
  precoMensal: 0, precoSemestral: 0, precoAnual: 0,
  limiteMensal: null, rateLimitPorMinuto: 60,
  acessoCnpj: true, acessoCnpjRaiz: false, acessoPesquisa: false,
  acessoGeocode: false, acessoSuframa: false, acessoMapa: false,
  maisPopular: false, seloDestaque: '', ordem: 0,
};

@Component({
  selector: 'app-portal-planos',
  standalone: false,
  templateUrl: './planos.component.html',
})
export class PortalPlanosComponent implements OnInit {
  @ViewChild('modalPlano') modalPlano!: PoModalComponent;

  planos: any[] = [];
  carregando = false;
  modoEdicao = false;
  form: PlanoForm = { ...FORM_VAZIO };
  salvando = false;

  colunas: PoTableColumn[] = [
    { property: 'nome',   label: 'Nome',   width: '16%' },
    { property: 'slug',   label: 'Slug',   width: '10%' },
    { property: 'precoMensal',    label: 'Mensal (R$)',    type: 'currency', format: 'BRL', width: '10%' },
    { property: 'precoSemestral', label: 'Semestral (R$)', type: 'currency', format: 'BRL', width: '11%' },
    { property: 'precoAnual',     label: 'Anual (R$)',     type: 'currency', format: 'BRL', width: '10%' },
    { property: 'limiteMensal',   label: 'Limite/mês',     type: 'number',   width: '10%' },
    { property: 'rateLimitPorMinuto', label: 'Rate/min',   type: 'number',   width: '8%' },
    { property: 'maisPopular', label: 'Destaque', type: 'boolean', width: '9%' },
    {
      property: 'ativoStatus', label: 'Status', type: 'label', width: '9%',
      labels: [
        { value: 1, label: 'Ativo', color: 'color-10' },
        { value: 0, label: 'Inativo', color: 'color-05' },
      ],
    },
    { property: 'ordem', label: 'Ordem', type: 'number', width: '7%' },
  ];

  acoes: PoTableAction[] = [
    { label: 'Editar', icon: 'an an-pencil', action: (row: any) => this.editar(row) },
    { label: 'Desativar', icon: 'an an-trash', action: (row: any) => this.desativar(row), disabled: (row: any) => !row.ativo },
  ];

  acaoSalvar: PoModalAction = {
    label: 'Salvar',
    action: () => this.salvar(),
    loading: false,
  };

  acaoCancelar: PoModalAction = {
    label: 'Cancelar',
    action: () => this.modalPlano.close(),
  };

  constructor(private svc: AdminService, private notif: NotifService) {}

  ngOnInit() { this.carregar(); }

  carregar() {
    this.carregando = true;
    this.svc.listarPlanos().subscribe({
      next: (p) => {
        this.planos = p.map((plano: any) => ({
          ...plano,
          ativoStatus: plano.ativo ? 1 : 0,
        }));
        this.carregando = false;
      },
      error: () => { this.carregando = false; },
    });
  }

  novo() {
    this.modoEdicao = false;
    this.form = { ...FORM_VAZIO };
    this.modalPlano.open();
  }

  editar(row: any) {
    this.modoEdicao = true;
    this.form = {
      id: row.id,
      nome: row.nome, slug: row.slug, descricao: row.descricao ?? '',
      precoMensal: row.precoMensal, precoSemestral: row.precoSemestral, precoAnual: row.precoAnual,
      limiteMensal: row.limiteMensal, rateLimitPorMinuto: row.rateLimitPorMinuto,
      acessoCnpj: row.acessoCnpj, acessoCnpjRaiz: row.acessoCnpjRaiz, acessoPesquisa: row.acessoPesquisa,
      acessoGeocode: row.acessoGeocode, acessoSuframa: row.acessoSuframa, acessoMapa: row.acessoMapa,
      maisPopular: row.maisPopular, seloDestaque: row.seloDestaque ?? '', ordem: row.ordem,
    };
    this.modalPlano.open();
  }

  salvar() {
    this.salvando = true;
    (this.acaoSalvar as any).loading = true;

    const dto: any = { ...this.form };
    if (!dto.seloDestaque) delete dto.seloDestaque;
    if (!dto.descricao) delete dto.descricao;
    delete dto.id;

    const obs = this.modoEdicao
      ? this.svc.atualizarPlano(this.form.id!, dto)
      : this.svc.criarPlano(dto);

    obs.subscribe({
      next: () => {
        this.notif.success(this.modoEdicao ? 'Plano atualizado.' : 'Plano criado.');
        this.modalPlano.close();
        this.carregar();
        this.salvando = false;
        (this.acaoSalvar as any).loading = false;
      },
      error: (err: any) => {
        this.notif.error(err.error?.message ?? 'Erro ao salvar plano.');
        this.salvando = false;
        (this.acaoSalvar as any).loading = false;
      },
    });
  }

  desativar(row: any) {
    this.svc.desativarPlano(row.id).subscribe({
      next: () => { row.ativo = false; this.notif.success('Plano desativado.'); },
      error: () => this.notif.error('Erro ao desativar.'),
    });
  }

  seedPlanos() {
    this.svc.seedPlanos().subscribe({
      next: () => { this.notif.success('Planos padrão criados.'); this.carregar(); },
      error: (err: any) => this.notif.error(err.error?.message ?? 'Erro ao criar planos.'),
    });
  }
}
