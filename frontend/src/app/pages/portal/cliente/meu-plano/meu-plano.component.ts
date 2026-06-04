import { NotifService } from '../../../../services/notif.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PoModalComponent, PoModalAction } from '@po-ui/ng-components';
import { ClientePortalService } from '../cliente.service';

@Component({
  selector: 'app-meu-plano',
  standalone: false,
  templateUrl: './meu-plano.component.html',
  styleUrls: ['./meu-plano.component.scss'],
})
export class MeuPlanoComponent implements OnInit {
  @ViewChild('modalCancelar') modalCancelar!: PoModalComponent;
  @ViewChild('modalContratar') modalContratar!: PoModalComponent;

  assinatura: any = null;
  planos: any[] = [];
  planoSelecionado: any = null;
  carregando = true;
  motivoCancelamento = '';
  contratando = false;
  cancelando = false;

  acaoCancelar: PoModalAction = {
    label: 'Confirmar cancelamento', loading: false,
    action: () => this.confirmarCancelamento(),
  };
  acaoFecharCancelar: PoModalAction = { label: 'Voltar', action: () => this.modalCancelar.close() };

  acaoContratar: PoModalAction = {
    label: 'Contratar', loading: false,
    action: () => this.confirmarContratacao(),
  };
  acaoFecharContratar: PoModalAction = { label: 'Cancelar', action: () => this.modalContratar.close() };

  constructor(private svc: ClientePortalService, private notif: NotifService) {}

  ngOnInit() {
    this.svc.minhaAssinatura().subscribe({
      next: (a) => {
        this.assinatura = a;
        this.carregando = false;
      },
      error: () => {
        this.assinatura = null;
        this.carregando = false;
        this.carregarPlanos();
      },
    });
    this.carregarPlanos();
  }

  carregarPlanos() {
    this.svc.listarPlanos().subscribe((p) => {
      this.planos = p.filter((pl: any) => pl.slug !== 'gratuito');
    });
  }

  get statusColor() {
    const cores: Record<string, string> = { ativa: 'color-10', suspensa: 'color-07', cancelada: 'color-05', trial: 'color-08' };
    return cores[this.assinatura?.status] ?? 'color-03';
  }

  get statusLabel() {
    const labels: Record<string, string> = { ativa: 'Ativa', suspensa: 'Suspensa', cancelada: 'Cancelada', trial: 'Trial' };
    return labels[this.assinatura?.status] ?? '—';
  }

  abrirCancelar() { this.motivoCancelamento = ''; this.modalCancelar.open(); }

  confirmarCancelamento() {
    (this.acaoCancelar as any).loading = true;
    this.svc.cancelarAssinatura(this.motivoCancelamento).subscribe({
      next: () => {
        this.notif.success('Assinatura cancelada.');
        this.assinatura = null;
        this.modalCancelar.close();
        (this.acaoCancelar as any).loading = false;
      },
      error: () => {
        this.notif.error('Erro ao cancelar.');
        (this.acaoCancelar as any).loading = false;
      },
    });
  }

  abrirContratar(plano: any) {
    this.planoSelecionado = plano;
    this.modalContratar.open();
  }

  confirmarContratacao() {
    if (!this.planoSelecionado) return;
    (this.acaoContratar as any).loading = true;
    this.svc.assinar(this.planoSelecionado.slug).subscribe({
      next: (res) => {
        this.notif.success(`Plano ${this.planoSelecionado.nome} contratado! Token: ${res.token_api}`);
        this.modalContratar.close();
        this.svc.minhaAssinatura().subscribe((a) => { this.assinatura = a; });
        (this.acaoContratar as any).loading = false;
      },
      error: (err: any) => {
        this.notif.error(err.error?.message ?? 'Erro ao contratar plano.');
        (this.acaoContratar as any).loading = false;
      },
    });
  }
}
