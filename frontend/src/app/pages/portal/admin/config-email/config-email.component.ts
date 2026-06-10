import { NotifService } from '../../../../services/notif.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

const API = environment.apiUrl;

@Component({
  selector: 'app-config-email',
  standalone: false,
  template: `
    <po-page-default p-title="Configuração de E-mail"
      p-icon="an an-envelope-simple"
      [p-breadcrumb]="breadcrumb">

      <div class="po-row">

        <!-- Formulário SMTP -->
        <po-container class="po-md-12" p-title="Servidor SMTP">
          <div class="po-row">
            <po-input class="po-md-8" p-label="Host SMTP"
              [(ngModel)]="cfg.smtpHost" p-placeholder="smtp.exemplo.com">
            </po-input>
            <po-input class="po-md-4" p-label="Porta"
              [(ngModel)]="cfg.smtpPort" p-placeholder="587">
            </po-input>
            <po-input class="po-md-6" p-label="Usuário (remetente)"
              [(ngModel)]="cfg.smtpUser" p-placeholder="email@empresa.com">
            </po-input>
            <po-password class="po-md-6" p-label="Senha"
              [(ngModel)]="cfg.smtpPass" p-placeholder="Deixe em branco para não alterar">
            </po-password>
            <po-select class="po-md-4" p-label="Segurança"
              [ngModel]="cfg.smtpSecure"
              (ngModelChange)="cfg.smtpSecure = $event"
              [p-options]="opcoesSeguranca">
            </po-select>
            <po-input class="po-md-8" p-label="URL da Aplicação (usada nos e-mails)"
              [(ngModel)]="cfg.appUrl" p-placeholder="https://app.bjsoft.com.br">
            </po-input>
          </div>

          <div class="po-row" style="margin-top:16px">
            <div class="po-md-12">
              <po-button p-label="Salvar configurações" p-kind="primary"
                p-icon="an an-floppy-disk" [p-loading]="salvando"
                (p-click)="salvar()">
              </po-button>
            </div>
          </div>
        </po-container>

        <!-- Teste de envio -->
        <po-container class="po-md-12" p-title="Testar Envio">
          <p class="po-text-color-neutral-dark-70" style="margin:0 0 16px;font-size:.875rem;">
            Envie um e-mail de teste para confirmar que as configurações estão corretas.
          </p>
          <div class="po-row">
            <po-email class="po-md-8" p-label="Destinatário do teste"
              [(ngModel)]="emailTeste" p-placeholder="destino@email.com">
            </po-email>
            <div class="po-md-4" style="display:flex;align-items:flex-end;padding-bottom:8px;">
              <po-button p-label="Enviar teste" p-kind="secondary"
                p-icon="an an-paper-plane-tilt" [p-loading]="testando"
                (p-click)="testar()">
              </po-button>
            </div>
          </div>
        </po-container>

      </div>
    </po-page-default>
  `,
})
export class ConfigEmailComponent implements OnInit {
  breadcrumb = { items: [{ label: 'Portal' }, { label: 'Configuração de E-mail' }] };

  cfg = { smtpHost: '', smtpPort: '587', smtpUser: '', smtpPass: '', smtpSecure: 'false', appUrl: '' };
  emailTeste = '';
  salvando = false;
  testando = false;

  opcoesSeguranca = [
    { label: 'STARTTLS — porta 587 (recomendado)',  value: 'false' },
    { label: 'SSL/TLS — porta 465',                  value: 'true'  },
  ];

  constructor(private http: HttpClient, private notif: NotifService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.http.get<any>(`${API}/admin/config-email`).subscribe({
      next: (res) => {
        this.cfg = { ...this.cfg, ...res };
        if (!this.emailTeste) this.emailTeste = res.smtpUser;
        this.cdr.detectChanges();
      },
      error: () => this.notif.error('Erro ao carregar configurações.'),
    });
  }

  salvar() {
    this.salvando = true;
    this.http.post(`${API}/admin/config-email`, this.cfg).subscribe({
      next: () => { this.salvando = false; this.cdr.detectChanges(); this.notif.success('Configurações salvas com sucesso!'); },
      error: () => { this.salvando = false; this.cdr.detectChanges(); this.notif.error('Erro ao salvar configurações.'); },
    });
  }

  testar() {
    if (!this.emailTeste) { this.notif.warning('Informe o e-mail de destino.'); return; }
    this.testando = true;
    this.http.post(`${API}/admin/config-email/teste`, { destinatario: this.emailTeste }).subscribe({
      next: (res: any) => { this.testando = false; this.cdr.detectChanges(); this.notif.success(res.mensagem); },
      error: (err: any) => { this.testando = false; this.cdr.detectChanges(); this.notif.error(err?.error?.message ?? 'Erro ao enviar teste.'); },
    });
  }
}
