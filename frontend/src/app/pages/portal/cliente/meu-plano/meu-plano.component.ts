import { NotifService } from '../../../../services/notif.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PoModalComponent, PoModalAction } from '@po-ui/ng-components';
import { ClientePortalService } from '../cliente.service';

@Component({
  selector: 'app-meu-plano',
  standalone: false,
  templateUrl: './meu-plano.component.html',
  styleUrls: ['./meu-plano.component.scss'],
})
export class MeuPlanoComponent implements OnInit {
  @ViewChild('modalCancelar')  modalCancelar!: PoModalComponent;
  @ViewChild('modalContratar') modalContratar!: PoModalComponent;
  @ViewChild('modalUpgrade')   modalUpgrade!: PoModalComponent;

  assinatura: any = null;
  planos: any[] = [];
  planoSelecionado: any = null;
  carregando = true;

  // Cancelamento
  motivoCancelamento = '';
  opcaoCancelamento: 'agora' | 'fim-vigencia' = 'agora';
  opcoesCancelamento: any[] = [];
  cancelamentoAgendado: string | null = null;

  // Upgrade
  upgradePreviewData: any = null;
  planoUpgradeSelecionado: any = null;
  carregandoPreview = false;

  // ── Modal actions ──
  acaoCancelar: PoModalAction = {
    label: 'Confirmar cancelamento', loading: false, danger: true,
    action: () => this.confirmarCancelamento(),
  };
  acaoFecharCancelar: PoModalAction = { label: 'Voltar', action: () => this.modalCancelar.close() };

  acaoContratar: PoModalAction = {
    label: 'Contratar', loading: false,
    action: () => this.confirmarContratacao(),
  };
  acaoFecharContratar: PoModalAction = { label: 'Cancelar', action: () => this.modalContratar.close() };

  acaoUpgrade: PoModalAction = {
    label: 'Confirmar upgrade', loading: false, disabled: true,
    action: () => this.confirmarUpgrade(),
  };
  acaoFecharUpgrade: PoModalAction = { label: 'Cancelar', action: () => this.modalUpgrade.close() };

  constructor(private svc: ClientePortalService, private notif: NotifService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.svc.minhaAssinatura().subscribe({
      next: (a) => {
        this.assinatura = a;
        this.cancelamentoAgendado = a?.agendarCancelamentoEm ?? null;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => { this.assinatura = null; this.carregando = false; this.cdr.detectChanges(); this.carregarPlanos(); },
    });
    this.carregarPlanos();
  }

  carregarPlanos() {
    this.svc.listarPlanos().subscribe((p) => {
      this.planos = p.filter((pl: any) => pl.slug !== 'gratuito');
    });
  }

  get statusColor() {
    const c: Record<string, string> = { ativa: 'color-10', suspensa: 'color-07', cancelada: 'color-05', trial: 'color-08' };
    return c[this.assinatura?.status] ?? 'color-03';
  }
  get statusLabel() {
    const l: Record<string, string> = { ativa: 'Ativa', suspensa: 'Suspensa', cancelada: 'Cancelada', trial: 'Trial' };
    return l[this.assinatura?.status] ?? '—';
  }

  get precoMensalAtual(): number {
    return Number(this.assinatura?.preco_mensal ?? 0);
  }

  // ── lógica de botão por plano ──────────────────────────────────────

  planoBotaoLabel(p: any): string {
    if (this.assinatura?.plano === p.nome) return 'Plano atual';
    if (this.precoMensalAtual > 0 && Number(p.precoMensal) > this.precoMensalAtual) return 'Fazer upgrade';
    if (this.precoMensalAtual > 0 && Number(p.precoMensal) < this.precoMensalAtual) return 'Downgrade indisponível';
    return 'Contratar';
  }

  planoBotaoDesabilitado(p: any): boolean {
    if (this.assinatura?.plano === p.nome) return true;
    if (this.precoMensalAtual > 0 && Number(p.precoMensal) < this.precoMensalAtual) return true;
    return false;
  }

  abrirContratar(p: any) {
    if (this.assinatura && Number(p.precoMensal) > this.precoMensalAtual) {
      this.abrirUpgrade(p);
    } else {
      this.planoSelecionado = p;
      this.modalContratar.open();
    }
  }

  // ── Upgrade ────────────────────────────────────────────────────────

  abrirUpgrade(plano: any) {
    this.planoUpgradeSelecionado = plano;
    this.upgradePreviewData = null;
    this.carregandoPreview = true;
    this.acaoUpgrade = { ...this.acaoUpgrade, disabled: true };
    this.modalUpgrade.open();

    this.svc.upgradePreview(plano.slug).subscribe({
      next: (data) => {
        this.upgradePreviewData = data;
        this.carregandoPreview = false;
        this.acaoUpgrade = { ...this.acaoUpgrade, disabled: false };
      },
      error: (err) => {
        this.carregandoPreview = false;
        this.notif.error(err.error?.message ?? 'Erro ao calcular upgrade.');
        this.modalUpgrade.close();
      },
    });
  }

  confirmarUpgrade() {
    if (!this.planoUpgradeSelecionado) return;
    this.acaoUpgrade = { ...this.acaoUpgrade, loading: true };
    this.svc.realizarUpgrade(this.planoUpgradeSelecionado.slug).subscribe({
      next: (res) => {
        this.acaoUpgrade = { ...this.acaoUpgrade, loading: false };
        this.modalUpgrade.close();
        this.notif.success(`Upgrade realizado! Novo token gerado.`);
        this.svc.minhaAssinatura().subscribe((a) => {
          this.assinatura = a;
          this.cancelamentoAgendado = a?.agendarCancelamentoEm ?? null;
        });
      },
      error: (err: any) => {
        this.notif.error(err.error?.message ?? 'Erro ao realizar upgrade.');
        this.acaoUpgrade = { ...this.acaoUpgrade, loading: false };
      },
    });
  }

  // ── Cancelamento ───────────────────────────────────────────────────

  abrirCancelar() {
    this.motivoCancelamento = '';
    this.opcaoCancelamento = 'agora';
    const vencimento = this.assinatura?.proximo_vencimento
      ? new Date(this.assinatura.proximo_vencimento).toLocaleDateString('pt-BR')
      : null;
    this.opcoesCancelamento = [
      { label: 'Cancelar agora (acesso encerrado imediatamente)', value: 'agora' },
      ...(vencimento ? [{ label: `Cancelar ao fim da vigência (${vencimento})`, value: 'fim-vigencia' }] : []),
    ];
    this.modalCancelar.open();
  }

  confirmarCancelamento() {
    this.acaoCancelar = { ...this.acaoCancelar, loading: true };
    this.svc.cancelarAssinatura(this.opcaoCancelamento, this.motivoCancelamento).subscribe({
      next: (res: any) => {
        this.acaoCancelar = { ...this.acaoCancelar, loading: false };
        this.modalCancelar.close();
        if (this.opcaoCancelamento === 'fim-vigencia') {
          this.cancelamentoAgendado = res.agendarCancelamentoEm;
          this.notif.success('Cancelamento agendado. Você mantém acesso até o fim da vigência.');
        } else {
          this.assinatura = null;
          this.cancelamentoAgendado = null;
          this.notif.success('Assinatura cancelada.');
          this.carregarPlanos();
        }
      },
      error: () => { this.acaoCancelar = { ...this.acaoCancelar, loading: false }; this.notif.error('Erro ao cancelar.'); },
    });
  }

  // ── Contratação ────────────────────────────────────────────────────

  confirmarContratacao() {
    if (!this.planoSelecionado) return;
    this.acaoContratar = { ...this.acaoContratar, loading: true };
    this.svc.assinar(this.planoSelecionado.slug).subscribe({
      next: (res) => {
        this.notif.success(`Plano ${this.planoSelecionado.nome} contratado! Token: ${res.token_api}`);
        this.modalContratar.close();
        this.svc.minhaAssinatura().subscribe((a) => { this.assinatura = a; });
        this.acaoContratar = { ...this.acaoContratar, loading: false };
      },
      error: (err: any) => {
        this.notif.error(err.error?.message ?? 'Erro ao contratar plano.');
        this.acaoContratar = { ...this.acaoContratar, loading: false };
      },
    });
  }

  formatarData(iso: string | null): string {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('pt-BR');
  }
}
