import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-clientes-detail',
  standalone: false,
  template: `
    <po-page-default p-title="Detalhes do Cliente">
      <po-loading-overlay *ngIf="carregando"></po-loading-overlay>

      <ng-container *ngIf="!carregando && cliente">
        <div class="po-row" style="margin-bottom: 16px;">
          <po-button p-label="Voltar" p-kind="tertiary" p-icon="an an-arrow-left" (p-click)="voltar()"></po-button>
          <po-button p-label="Editar" p-kind="secondary" p-icon="an an-pencil" (p-click)="editar()"></po-button>
        </div>

        <div class="po-row">
          <po-info class="po-md-6" p-label="Nome" [p-value]="cliente.nome"></po-info>
          <po-info class="po-md-6" p-label="E-mail" [p-value]="cliente.email"></po-info>
        </div>
        <div class="po-row">
          <po-info class="po-md-4" p-label="Tipo" [p-value]="cliente.tipoPessoa === 'F' ? 'Pessoa Física' : 'Pessoa Jurídica'"></po-info>
          <po-info class="po-md-4" p-label="Telefone" [p-value]="cliente.telefone || '—'"></po-info>
          <po-info class="po-md-4" p-label="WhatsApp" [p-value]="cliente.whatsapp === true ? 'Sim' : cliente.whatsapp === false ? 'Não' : '—'"></po-info>
        </div>
        <div class="po-row">
          <po-info class="po-md-4" p-label="Status" [p-value]="cliente.ativo ? 'Ativo' : 'Suspenso'"></po-info>
          <po-info class="po-md-4" p-label="E-mail Verificado" [p-value]="cliente.emailVerificado ? 'Sim' : 'Não'"></po-info>
        </div>
        <div class="po-row">
          <po-info class="po-md-6" p-label="CPF" [p-value]="cliente.cpf || '—'"></po-info>
          <po-info class="po-md-6" p-label="Data de Nascimento" [p-value]="formatarData(cliente.dataNascimento) || '—'"></po-info>
        </div>
        <div class="po-row">
          <po-info class="po-md-6" p-label="CNPJ" [p-value]="cliente.cnpj || '—'"></po-info>
          <po-info class="po-md-6" p-label="Razão Social" [p-value]="cliente.razaoSocial || '—'"></po-info>
        </div>
        <div class="po-row">
          <po-info class="po-md-3" p-label="CEP" [p-value]="cliente.cep || '—'"></po-info>
          <po-info class="po-md-5" p-label="Rua" [p-value]="cliente.logradouro || '—'"></po-info>
          <po-info class="po-md-2" p-label="Número" [p-value]="cliente.numero || '—'"></po-info>
          <po-info class="po-md-2" p-label="Estado" [p-value]="cliente.uf || '—'"></po-info>
        </div>
        <div class="po-row">
          <po-info class="po-md-4" p-label="Bairro" [p-value]="cliente.bairro || '—'"></po-info>
          <po-info class="po-md-4" p-label="Município" [p-value]="cliente.municipio || '—'"></po-info>
          <po-info class="po-md-4" p-label="Complemento" [p-value]="cliente.complemento || '—'"></po-info>
        </div>

        <po-divider p-label="Exclusão da conta"></po-divider>

        <div *ngIf="cliente.agendarExclusaoEm; else blocoExclusao" style="background: #fff7ed; border: 1px solid #fdba74; border-radius: 12px; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
          <div>
            <strong style="color: #c2410c; font-size: 0.95rem;">Anonimização agendada</strong>
            <p style="margin: 4px 0 0; color: #6b7280; font-size: 0.85rem;">
              Cliente com anonimização prevista para <strong>{{ formatarData(cliente.agendarExclusaoEm) }}</strong>.
            </p>
          </div>
          <po-button p-label="Desistir da exclusão" p-kind="secondary" p-icon="an an-arrow-counter-clockwise" [p-loading]="salvando" (p-click)="cancelarExclusao()"></po-button>
        </div>

        <ng-template #blocoExclusao>
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
            <div>
              <strong style="color: #dc2626; font-size: 0.95rem;">Excluir cliente</strong>
              <p style="margin: 4px 0 0; color: #6b7280; font-size: 0.85rem;" *ngIf="!temPlanoPagoAtivo">
                Sem plano pago ativo: a exclusão será definitiva com anonimização imediata.
              </p>
              <p style="margin: 4px 0 0; color: #6b7280; font-size: 0.85rem;" *ngIf="temPlanoPagoAtivo">
                Com plano pago ativo: a exclusão gera anonimização agendada e pode ser cancelada antes do prazo.
              </p>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <po-button p-label="Agendar padrão" p-kind="danger" p-icon="an an-clock" [p-loading]="salvando" (p-click)="agendarExclusao('agora')"></po-button>
              <po-button *ngIf="temPlanoPagoAtivo" p-label="Fim do plano" p-kind="secondary" p-icon="an an-calendar-dots" [p-loading]="salvando" (p-click)="agendarExclusao('fim-plano')"></po-button>
            </div>
          </div>
        </ng-template>
      </ng-container>
    </po-page-default>
  `,
})
export class ClientesDetailComponent implements OnInit {
  cliente: any = null;
  carregando = true;
  salvando = false;
  temPlanoPagoAtivo = false;
  private clienteId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.clienteId = this.route.snapshot.paramMap.get('id') || '';
    this.carregarCliente();
  }

  carregarCliente() {
    this.carregando = true;
    this.adminService.detalheCliente(this.clienteId).subscribe({
      next: (cliente) => {
        this.cliente = cliente;
        this.temPlanoPagoAtivo = !!cliente.assinaturas?.some((assinatura: any) => assinatura?.status === 'ativa' && Number(assinatura?.plano?.precoMensal ?? 0) > 0);
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.carregando = false;
        this.cdr.detectChanges();
        this.router.navigate(['/portal/clientes']);
      },
    });
  }

  voltar() {
    this.router.navigate(['/portal/clientes']);
  }

  editar() {
    this.router.navigate(['/portal/clientes/edit', this.clienteId]);
  }

  agendarExclusao(agendarPara: 'agora' | 'fim-plano') {
    const mensagem = !this.temPlanoPagoAtivo
      ? 'Confirma a exclusão definitiva deste cliente?'
      : agendarPara === 'fim-plano'
        ? 'Confirma o agendamento da anonimização para o fim do plano?'
        : 'Confirma o agendamento da anonimização pelo prazo padrão?';

    if (!window.confirm(mensagem)) {
      return;
    }

    this.salvando = true;
    this.adminService.agendarExclusaoCliente(this.clienteId, agendarPara).subscribe({
      next: (response) => {
        this.salvando = false;
        if (response?.agendarExclusaoEm) {
          this.cliente = { ...this.cliente, agendarExclusaoEm: response.agendarExclusaoEm };
        } else if (response?.tipoFluxo === 'exclusao-imediata') {
          this.router.navigate(['/portal/clientes']);
          return;
        }
        this.carregarCliente();
      },
      error: () => {
        this.salvando = false;
      },
    });
  }

  cancelarExclusao() {
    if (!window.confirm('Confirma o cancelamento da exclusão agendada deste cliente?')) {
      return;
    }

    this.salvando = true;
    this.adminService.cancelarExclusaoCliente(this.clienteId).subscribe({
      next: () => {
        this.salvando = false;
        this.carregarCliente();
      },
      error: () => {
        this.salvando = false;
      },
    });
  }

  formatarData(valor: string | Date | null | undefined) {
    if (!valor) return '';
    return new Date(valor).toLocaleDateString('pt-BR');
  }
}
