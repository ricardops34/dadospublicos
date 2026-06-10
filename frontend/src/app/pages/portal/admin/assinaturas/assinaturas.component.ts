import { NotifService } from '../../../../services/notif.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  PoModalAction, PoModalComponent,
  PoTableAction, PoTableColumn, PoSelectOption,
} from '@po-ui/ng-components';
import { AdminService } from '../admin.service';

const MESES = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
               'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

@Component({
  selector: 'app-portal-assinaturas',
  standalone: false,
  templateUrl: './assinaturas.component.html',
})
export class PortalAssinaturasComponent implements OnInit {
  @ViewChild('modalEditar')  modalEditar!: PoModalComponent;
  @ViewChild('modalConsumo') modalConsumo!: PoModalComponent;

  assinaturas: any[] = [];
  total = 0;
  pagina = 1;
  limite = 20;
  carregando = false;
  filtroStatus = '';

  // Edição da assinatura
  editando: any = {};
  planosOpcoes: PoSelectOption[] = [];

  // Consumo
  consumos: any[] = [];
  carregandoConsumo = false;
  editandoConsumo: any = {};

  statusOptions: PoSelectOption[] = [
    { label: 'Todas',     value: '' },
    { label: 'Ativa',     value: 'ativa' },
    { label: 'Suspensa',  value: 'suspensa' },
    { label: 'Cancelada', value: 'cancelada' },
    { label: 'Trial',     value: 'trial' },
  ];

  colunas: PoTableColumn[] = [
    { property: 'cliente', label: 'Cliente', width: '22%' },
    { property: 'email',   label: 'E-mail',  width: '22%' },
    { property: 'plano',   label: 'Plano',   width: '12%' },
    {
      property: 'status', label: 'Status', type: 'label', width: '11%',
      labels: [
        { value: 'ativa',     label: 'Ativa',     color: 'color-10' },
        { value: 'suspensa',  label: 'Suspensa',  color: 'color-07' },
        { value: 'cancelada', label: 'Cancelada', color: 'color-05' },
        { value: 'trial',     label: 'Trial',     color: 'color-08' },
      ],
    },
    { property: 'dataInicio',        label: 'Início',     type: 'date', format: 'dd/MM/yyyy', width: '11%' },
    { property: 'proximoVencimento', label: 'Vencimento', type: 'date', format: 'dd/MM/yyyy', width: '11%' },
    { property: 'tokenAtivo', label: 'Token ativo', width: '11%' },
  ];

  consumoCols: PoTableColumn[] = [
    { property: 'periodo',    label: 'Mês/Ano',    width: '40%' },
    { property: 'quantidade', label: 'Quantidade',  width: '30%' },
    { property: 'limite',     label: 'Limite',      width: '30%' },
  ];

  consumoAcoes: PoTableAction[] = [
    { label: 'Editar', icon: 'an an-pencil', action: (row: any) => this.abrirEditarConsumo(row) },
  ];

  acoes: PoTableAction[] = [
    {
      label: 'Editar', icon: 'an an-pencil',
      action: (row: any) => this.abrirEditar(row),
    },
    {
      label: 'Suspender', icon: 'an an-lock',
      action: (row: any) => this.suspender(row),
      disabled: (row: any) => row.status !== 'ativa',
    },
    {
      label: 'Reativar', icon: 'an an-lock-open',
      action: (row: any) => this.reativar(row),
      disabled: (row: any) => row.status !== 'suspensa',
    },
  ];

  acaoSalvar: PoModalAction = {
    label: 'Salvar', loading: false,
    action: () => this.salvarEdicao(),
  };
  acaoCancelar: PoModalAction = {
    label: 'Cancelar', action: () => this.modalEditar.close(),
  };

  acaoSalvarConsumo: PoModalAction = {
    label: 'Salvar', loading: false,
    action: () => this.salvarConsumo(),
  };
  acaoCancelarConsumo: PoModalAction = {
    label: 'Cancelar', action: () => this.modalConsumo.close(),
  };

  constructor(private svc: AdminService, private notif: NotifService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.svc.listarPlanos().subscribe({
      next: (planos: any[]) => {
        this.planosOpcoes = planos
          .filter((p: any) => p.ativo)
          .sort((a: any, b: any) => a.ordem - b.ordem)
          .map((p: any) => ({ label: p.nome, value: p.id }));
      },
    });
  }

  carregar() {
    this.carregando = true;
    this.svc.listarAssinaturas(this.pagina, this.limite).subscribe({
      next: ([lista, count]: [any[], number]) => {
        this.assinaturas = lista
          .filter(a => !this.filtroStatus || a.status === this.filtroStatus)
          .map(a => ({
            ...a,
            _plano: a.plano,
            _token: a.token,
            cliente:    a.cliente?.razaoSocial ?? a.usuario?.nome ?? '—',
            email:      a.usuario?.email ?? '—',
            plano:      a.plano?.nome    ?? '—',
            tokenAtivo: a.token?.ativo   ? 'Sim' : 'Não',
          }));
        this.total = count;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => { this.carregando = false; this.cdr.detectChanges(); },
    });
  }

  // ── Editar assinatura ──────────────────────────────────────────────

  abrirEditar(row: any) {
    this.editando = {
      id:                row.id,
      planoId:           row._plano?.id ?? '',
      dataInicio:        this.isoToBr(row.dataInicio),
      proximoVencimento: this.isoToBr(row.proximoVencimento),
      limiteMensal:      row._token?.limiteMensal ?? null,
    };
    this.consumos = [];
    this.carregandoConsumo = true;
    this.svc.consumosDaAssinatura(row.id).subscribe({
      next: (data: any[]) => {
        const limite = this.editando.limiteMensal;
        this.consumos = data.map(c => ({
          ...c,
          periodo: `${MESES[c.mes]}/${c.ano}`,
          limite:  limite != null ? limite : 'Ilimitado',
        }));
        this.carregandoConsumo = false;
      },
      error: () => { this.carregandoConsumo = false; },
    });
    this.modalEditar.open();
  }

  salvarEdicao() {
    this.acaoSalvar = { ...this.acaoSalvar, loading: true };
    const dto: any = {};
    if (this.editando.planoId) dto.planoId = this.editando.planoId;
    const di = this.brToIso(this.editando.dataInicio);
    const pv = this.brToIso(this.editando.proximoVencimento);
    if (di) dto.dataInicio = di;
    if (pv) dto.proximoVencimento = pv;

    this.svc.editarAssinatura(this.editando.id, dto).subscribe({
      next: () => {
        this.acaoSalvar = { ...this.acaoSalvar, loading: false };
        this.modalEditar.close();
        this.notif.success('Assinatura atualizada.');
        this.carregar();
      },
      error: () => {
        this.acaoSalvar = { ...this.acaoSalvar, loading: false };
        this.notif.error('Erro ao salvar assinatura.');
      },
    });
  }

  // ── Editar consumo ─────────────────────────────────────────────────

  abrirEditarConsumo(row: any) {
    this.editandoConsumo = { ...row };
    this.modalConsumo.open();
  }

  salvarConsumo() {
    this.acaoSalvarConsumo = { ...this.acaoSalvarConsumo, loading: true };
    this.svc.editarConsumo(this.editandoConsumo.id, +this.editandoConsumo.quantidade).subscribe({
      next: (updated: any) => {
        this.acaoSalvarConsumo = { ...this.acaoSalvarConsumo, loading: false };
        const idx = this.consumos.findIndex(c => c.id === updated.id);
        if (idx !== -1) {
          this.consumos[idx] = { ...this.consumos[idx], quantidade: updated.quantidade };
          this.consumos = [...this.consumos];
        }
        this.modalConsumo.close();
        this.notif.success('Consumo atualizado.');
      },
      error: () => {
        this.acaoSalvarConsumo = { ...this.acaoSalvarConsumo, loading: false };
        this.notif.error('Erro ao salvar consumo.');
      },
    });
  }

  // ── Status ─────────────────────────────────────────────────────────

  suspender(row: any) {
    this.svc.suspenderAssinatura(row.id).subscribe({
      next: () => { row.status = 'suspensa'; row.tokenAtivo = 'Não'; this.notif.success('Assinatura suspensa.'); },
      error: () => this.notif.error('Erro ao suspender.'),
    });
  }

  reativar(row: any) {
    this.svc.reativarAssinatura(row.id).subscribe({
      next: () => { row.status = 'ativa'; row.tokenAtivo = 'Sim'; this.notif.success('Assinatura reativada.'); },
      error: () => this.notif.error('Erro ao reativar.'),
    });
  }

  onFiltroChange() { this.pagina = 1; this.carregar(); }
  onPaginaChange(p: number) { this.pagina = p; this.carregar(); }

  // ── Helpers de data ────────────────────────────────────────────────

  private isoToBr(iso: string | null): string {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }

  private brToIso(br: string): string | null {
    if (!br || br.length < 10) return null;
    const [d, m, y] = br.split('/');
    return `${y}-${m}-${d}`;
  }
}
