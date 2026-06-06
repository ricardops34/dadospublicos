import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoModalAction, PoModalComponent } from '@po-ui/ng-components';
import { AuthService } from '../../services/auth.service';

type Aba = 'login' | 'cadastro' | 'recuperar';

@Component({
  selector: 'app-login',
  standalone: false,
  template: `
    <div class="auth">

      <div class="auth__brand">
        <div class="auth__brand-inner">
          <div class="auth__logo">
            <img src="logo_bj.png" alt="BJ Soft" class="auth__logo-img" />
            <span class="auth__logo-text">Busca<strong>Dados</strong></span>
          </div>
          <h2 class="auth__brand-title">Dados públicos,<br>resultados reais</h2>
          <p class="auth__brand-sub">
            Consulte CNPJs, sócios, filiais e muito mais com a API mais rápida do mercado.
          </p>
          <ul class="auth__features">
            <li><span class="an an-check-circle-duotone"></span> Dados da Receita Federal em tempo real</li>
            <li><span class="an an-lightning-duotone"></span> Resposta em menos de 1 segundo</li>
            <li><span class="an an-lock-key-duotone"></span> API REST segura e documentada</li>
            <li><span class="an an-gift-duotone"></span> Plano gratuito, sem cartão de crédito</li>
          </ul>
          <div class="auth__brand-badge">
            <span class="an an-shield-check-duotone"></span>
            Dados oficiais · LGPD compliant
          </div>
        </div>
      </div>

      <div class="auth__form-wrap">
        <div class="auth__card">

          <div class="auth__logo auth__logo--mobile">
            <img src="logo_bj.png" alt="BJ Soft" class="auth__logo-img" />
            <span class="auth__logo-text">Busca<strong>Dados</strong></span>
          </div>

          <div class="auth__tabs" role="tablist" *ngIf="aba !== 'recuperar'">
            <button role="tab" type="button" class="auth__tab"
              [class.auth__tab--active]="aba === 'login'"
              (click)="trocarAba('login')">
              <span class="an an-sign-in"></span> Entrar
            </button>
            <button role="tab" type="button" class="auth__tab"
              [class.auth__tab--active]="aba === 'cadastro'"
              (click)="trocarAba('cadastro')">
              <span class="an an-user-plus"></span> Criar conta
            </button>
          </div>

          <div *ngIf="aba === 'login'" class="auth__section">
            <h1>Bem-vindo de volta</h1>
            <p class="auth__sub">Acesse sua conta BuscaDados</p>

            <div class="auth__fields">
              <po-email p-label="E-mail" [(ngModel)]="email"
                p-placeholder="seu@email.com" p-name="email">
              </po-email>
              <po-password p-label="Senha" [(ngModel)]="senha"
                p-placeholder="••••••••" p-name="senha">
              </po-password>
            </div>

            <a (click)="trocarAba('recuperar')" class="auth__link auth__forgot">
              Esqueceu sua senha?
            </a>

            <div *ngIf="erro" class="auth__alert auth__alert--erro">
              <span class="an an-warning-circle"></span> {{ erro }}
            </div>

            <po-button p-label="Entrar na conta" p-kind="primary" p-icon="an an-sign-in"
              [p-loading]="carregando" (p-click)="entrar()">
            </po-button>
          </div>

          <div *ngIf="aba === 'cadastro'" class="auth__section">
            <h1>Criar conta grátis</h1>
            
            <div *ngIf="sucesso" class="auth__alert auth__alert--ok">
              <span class="an an-check-circle"></span> Conta criada! Carregando seu painel...
            </div>

            <div class="auth__fields">
              <po-input p-label="Nome" [(ngModel)]="nome" p-placeholder="Seu nome" p-name="nome"></po-input>
              <po-email p-label="E-mail principal" [(ngModel)]="emailCad" p-placeholder="seu@email.com" p-name="emailCad"></po-email>
              <po-password p-label="Senha" [(ngModel)]="senhaCad" p-placeholder="Mínimo 8 caracteres" p-name="senhaCad"></po-password>
            </div>

            <div *ngIf="erroCad" class="auth__alert auth__alert--erro">
              <span class="an an-warning-circle"></span> {{ erroCad }}
            </div>

            <po-button p-label="Criar conta grátis" p-kind="primary" p-icon="an an-rocket-launch"
              [p-loading]="carregandoCad" (p-click)="cadastrar()">
            </po-button>
          </div>

          <div *ngIf="aba === 'recuperar'" class="auth__section">
            <button class="auth__back" (click)="trocarAba('login')">
              <span class="an an-arrow-left"></span> Voltar
            </button>
            <h1>Recuperar senha</h1>
            <p class="auth__sub">Informe seu e-mail e enviaremos um link para criar uma nova senha.</p>

            <div *ngIf="recuperarSucesso" class="auth__alert auth__alert--ok">
              <span class="an an-paper-plane-tilt"></span>
              Instruções enviadas! Verifique sua caixa de entrada.
            </div>

            <ng-container *ngIf="!recuperarSucesso">
              <div class="auth__fields">
                <po-email p-label="E-mail" [(ngModel)]="emailRecuperar"
                  p-placeholder="seu@email.com" p-name="emailRecuperar">
                </po-email>
              </div>

              <div *ngIf="erroRecuperar" class="auth__alert auth__alert--erro">
                <span class="an an-warning-circle"></span> {{ erroRecuperar }}
              </div>

              <po-button p-label="Enviar instruções" p-kind="primary" p-icon="an an-paper-plane-tilt"
                [p-loading]="carregandoRecuperar" (p-click)="solicitarReset()">
              </po-button>
            </ng-container>
          </div>

          <div class="auth__footer">
            <span *ngIf="aba === 'login'">
              Não tem conta?
              <a (click)="trocarAba('cadastro')" class="auth__link">Criar conta grátis</a>
            </span>
            <span *ngIf="aba === 'cadastro'">
              Já tem conta?
              <a (click)="trocarAba('login')" class="auth__link">Entrar</a>
            </span>
            <span *ngIf="aba === 'recuperar'">
              Lembrou a senha?
              <a (click)="trocarAba('login')" class="auth__link">Entrar</a>
            </span>
            <span class="auth__sep">·</span>
            <a routerLink="/" class="auth__link">Início</a>
          </div>

        </div>
      </div>
    </div>

    <!-- Modal: verificar e-mail (cadastro) -->
    <po-modal #modalVerificar
      p-title="Verifique seu e-mail"
      p-size="sm"
      [p-primary-action]="acaoVerificar"
      [p-secondary-action]="acaoReenviar">
      <p style="color:#6b7280;font-size:0.9rem;margin:0 0 16px;line-height:1.5;">
        Enviamos um código de <strong>6 dígitos</strong> para
        <strong>{{ emailVerificar }}</strong>. Ele expira em 15 minutos.
      </p>
      <div *ngIf="erroVerificar" style="background:#fef2f2;color:#dc2626;padding:10px 14px;border-radius:8px;font-size:0.84rem;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
        <span class="an an-warning-circle"></span> {{ erroVerificar }}
      </div>
      <po-input
        p-label="Código de verificação"
        [(ngModel)]="codigoVerificacao"
        p-placeholder="000000"
        [p-maxlength]="6"
        p-name="codigoVerif">
      </po-input>
    </po-modal>

    <!-- Modal 1: código de reset de senha -->
    <po-modal #modalCodigoReset
      p-title="Código de redefinição"
      p-size="sm"
      [p-primary-action]="acaoVerificarReset"
      [p-secondary-action]="acaoReenviarReset">
      <p style="color:#6b7280;font-size:0.9rem;margin:0 0 16px;line-height:1.5;">
        Enviamos um código de <strong>6 dígitos</strong> para
        <strong>{{ emailRecuperar }}</strong>. Ele expira em 15 minutos.
      </p>
      <div *ngIf="erroCodigoReset" style="background:#fef2f2;color:#dc2626;padding:10px 14px;border-radius:8px;font-size:0.84rem;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
        <span class="an an-warning-circle"></span> {{ erroCodigoReset }}
      </div>
      <po-input
        p-label="Código recebido por e-mail"
        [(ngModel)]="codigoReset"
        p-placeholder="000000"
        [p-maxlength]="6"
        p-name="codigoReset">
      </po-input>
    </po-modal>

    <!-- Modal 2: nova senha -->
    <po-modal #modalNovaSenha
      p-title="Defina sua nova senha"
      p-size="sm"
      [p-primary-action]="acaoSalvarSenha"
      [p-secondary-action]="acaoFecharNovaSenha">
      <div *ngIf="erroNovaSenha" style="background:#fef2f2;color:#dc2626;padding:10px 14px;border-radius:8px;font-size:0.84rem;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
        <span class="an an-warning-circle"></span> {{ erroNovaSenha }}
      </div>
      <po-password
        p-label="Nova senha"
        [(ngModel)]="novaSenha"
        p-placeholder="Mínimo 8 caracteres"
        p-name="novaSenha">
      </po-password>
      <po-password
        p-label="Confirmar senha"
        [(ngModel)]="confirmarSenha"
        p-placeholder="Repita a nova senha"
        p-name="confirmarSenha">
      </po-password>
    </po-modal>
  `,
  styles: [`
    .auth { min-height: 100vh; display: flex; }
    .auth__brand {
      flex: 0 0 50%;
      background: linear-gradient(150deg, #0f172a 0%, #3b0764 50%, #4c1d95 100%);
      display: flex; align-items: center; justify-content: center;
      padding: 60px 48px; position: relative; overflow: hidden;
    }
    .auth__brand::before {
      content: ''; position: absolute; inset: 0;
      background:
        radial-gradient(circle at 15% 85%, rgba(124,58,237,.3) 0%, transparent 45%),
        radial-gradient(circle at 85% 15%, rgba(139,92,246,.2) 0%, transparent 45%);
    }
    .auth__brand-inner { position: relative; max-width: 400px; }
    .auth__brand-title {
      font-size: 2.1rem; font-weight: 800; color: #fff;
      line-height: 1.2; margin: 28px 0 14px;
    }
    .auth__brand-sub { font-size: 0.95rem; color: #c4b5fd; margin: 0 0 32px; line-height: 1.65; }
    .auth__features {
      list-style: none; margin: 0 0 36px; padding: 0;
      display: flex; flex-direction: column; gap: 13px;
    }
    .auth__features li { display: flex; align-items: center; gap: 10px; color: #e9d5ff; font-size: 0.9rem; }
    .auth__features li span { color: #a78bfa; font-size: 1.1rem; flex-shrink: 0; }
    .auth__brand-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.15);
      color: #c4b5fd; font-size: 0.78rem; padding: 8px 14px; border-radius: 100px;
    }
    .auth__brand-badge span { color: #4ade80; }
    .auth__logo { display: flex; align-items: center; gap: 9px; }
    .auth__logo-img { width: 28px; height: 28px; object-fit: contain; }
    .auth__logo-text { font-size: 1.15rem; letter-spacing: -.3px; color: #fff; strong { color: #a78bfa; } }
    .auth__logo--mobile { display: none; margin-bottom: 24px; }
    .auth__logo--mobile .auth__logo-text { color: #0f172a; }
    .auth__form-wrap {
      flex: 1; display: flex; align-items: center; justify-content: center;
      background: #f8fafc; padding: 40px 24px;
    }
    .auth__card {
      background: #fff; border-radius: 20px;
      box-shadow: 0 4px 24px rgba(0,0,0,.07), 0 1px 4px rgba(0,0,0,.04);
      padding: 40px; width: 100%; max-width: 420px;
    }
    .auth__tabs {
      display: flex; align-items: center; gap: 4px; padding: 4px; margin-bottom: 32px;
      border: 1px solid var(--rfb-border, #e5e7eb); border-radius: 12px;
      background: var(--rfb-bg-card, #fff); width: 100%;
    }
    .auth__tab {
      flex: 1; border: 0; border-radius: 8px; background: transparent;
      color: var(--rfb-gray, #6b7280); font-size: 0.875rem; font-weight: 600;
      padding: 10px 16px; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 7px;
      transition: background 0.2s, color 0.2s, box-shadow 0.2s;
      span { font-size: 1rem; }
    }
    .auth__tab--active {
      background: var(--rfb-primary, #7c3aed); color: #fff;
      box-shadow: 0 4px 12px rgba(124,58,237,.3);
    }
    .auth__section h1 { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0 0 4px; }
    .auth__sub { font-size: 0.85rem; color: #64748b; margin: 0 0 20px; }
    .auth__fields { display: flex; flex-direction: column; gap: 2px; margin-bottom: 8px; }
    .auth__forgot {
      display: block; text-align: right;
      font-size: 0.8rem; margin-bottom: 14px; cursor: pointer;
    }
    .auth__back {
      display: inline-flex; align-items: center; gap: 6px;
      background: none; border: none; color: #64748b;
      font-size: 0.82rem; font-weight: 600; cursor: pointer;
      padding: 0; margin-bottom: 20px;
      transition: color 0.15s;
      &:hover { color: #7c3aed; }
      span { font-size: 0.85rem; }
    }
    .auth__alert {
      display: flex; align-items: center; gap: 8px;
      font-size: 0.84rem; padding: 10px 14px;
      border-radius: 10px; margin-bottom: 14px;
    }
    .auth__alert--erro { background: #fef2f2; color: #dc2626; }
    .auth__alert--ok   { background: #f0fdf4; color: #16a34a; }
    po-button[p-kind="primary"] .po-button {
      background: #7c3aed !important; border-color: #7c3aed !important;
      border-radius: 8px !important; color: #fff !important; font-weight: 600 !important;
      width: 100% !important; justify-content: center !important;
      box-shadow: 0 2px 10px rgba(124,58,237,.35) !important;
      &:hover { background: #6d28d9 !important; border-color: #6d28d9 !important; box-shadow: 0 4px 16px rgba(109,40,217,.45) !important; }
    }
    .auth__footer {
      margin-top: 24px; padding-top: 18px; border-top: 1px solid #f1f5f9;
      font-size: 0.82rem; color: #94a3b8;
      display: flex; align-items: center; gap: 6px; justify-content: center; flex-wrap: wrap;
    }
    .auth__sep { color: #cbd5e1; }
    .auth__link {
      color: #7c3aed; cursor: pointer; text-decoration: none; font-weight: 500;
      &:hover { text-decoration: underline; }
    }
    @media (max-width: 768px) {
      .auth { flex-direction: column; }
      .auth__brand { display: none; }
      .auth__logo--mobile { display: flex; }
      .auth__form-wrap { background: #fff; padding: 24px 16px; align-items: flex-start; }
      .auth__card { box-shadow: none; border-radius: 0; max-width: 100%; padding: 24px 0; }
    }
  `],
})
export class LoginComponent implements OnInit {
  @ViewChild('modalVerificar')   modalVerificar!: PoModalComponent;
  @ViewChild('modalCodigoReset') modalCodigoReset!: PoModalComponent;
  @ViewChild('modalNovaSenha')   modalNovaSenha!: PoModalComponent;

  aba: Aba = 'login';

  email = '';
  senha = '';
  erro = '';
  carregando = false;

  nome = '';
  emailCad = '';
  senhaCad = '';
  erroCad = '';
  sucesso = false;
  carregandoCad = false;

  emailRecuperar = '';
  erroRecuperar = '';
  recuperarSucesso = false;
  carregandoRecuperar = false;

  emailVerificar = '';
  senhaParaAutoLogin = '';
  codigoVerificacao = '';
  erroVerificar = '';
  carregandoVerificar = false;

  acaoVerificar: PoModalAction = {
    label: 'Verificar', loading: false, action: () => this.verificarCodigo(),
  };
  acaoReenviar: PoModalAction = {
    label: 'Reenviar código', action: () => this.reenviarCodigo(),
  };

  // Reset de senha
  codigoReset = '';
  erroCodigoReset = '';
  carregandoCodigoReset = false;
  novaSenha = '';
  confirmarSenha = '';
  erroNovaSenha = '';
  carregandoNovaSenha = false;

  acaoVerificarReset: PoModalAction = {
    label: 'Confirmar código', loading: false, action: () => this.verificarCodigoReset(),
  };
  acaoReenviarReset: PoModalAction = {
    label: 'Reenviar código', action: () => this.reenviarCodigoReset(),
  };
  acaoSalvarSenha: PoModalAction = {
    label: 'Salvar nova senha', loading: false, action: () => this.salvarNovaSenha(),
  };
  acaoFecharNovaSenha: PoModalAction = {
    label: 'Cancelar', action: () => this.modalNovaSenha.close(),
  };

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.route.snapshot.queryParamMap.get('tab') === 'cadastro') this.aba = 'cadastro';
  }

  trocarAba(aba: Aba) {
    this.aba = aba;
    this.erro = '';
    this.erroCad = '';
    this.erroRecuperar = '';
    this.erroVerificar = '';
    this.sucesso = false;
    this.recuperarSucesso = false;
  }

  entrar() {
    if (!this.email || !this.senha) {
      this.erro = 'Preencha e-mail e senha.';
      return;
    }

    this.carregando = true;
    this.erro = '';
    this.auth.login(this.email, this.senha).subscribe({
      next: () => this.router.navigate(['/portal/dashboard']),
      error: (err: any) => {
        const msg = err?.error?.message ?? '';
        if (msg === 'EMAIL_NAO_VERIFICADO') {
          this.emailVerificar = this.email;
          this.senhaParaAutoLogin = this.senha;
          this.codigoVerificacao = '';
          this.erroVerificar = '';
          this.modalVerificar.open();
        } else {
          this.erro = 'E-mail ou senha inválidos.';
        }
        this.carregando = false;
      },
    });
  }

  cadastrar() {
    if (!this.nome || !this.emailCad || !this.senhaCad) {
      this.erroCad = 'Preencha nome, e-mail e senha.';
      return;
    }
    if (this.senhaCad.length < 8) {
      this.erroCad = 'Senha deve ter no mínimo 8 caracteres.';
      return;
    }

    this.carregandoCad = true;
    this.erroCad = '';

    const payload = {
      nome: this.nome,
      email: this.emailCad,
      senha: this.senhaCad,
    };

    this.auth.signupApi(payload).subscribe({
      next: () => {
        this.carregandoCad = false;
        this.emailVerificar = this.emailCad;
        this.senhaParaAutoLogin = this.senhaCad;
        this.codigoVerificacao = '';
        this.erroVerificar = '';
        this.modalVerificar.open();
      },
      error: (err: any) => {
        this.erroCad = err?.error?.message ?? 'Erro ao criar conta. Tente novamente.';
        this.carregandoCad = false;
      },
    });
  }

  verificarCodigo() {
    if (!this.codigoVerificacao || this.codigoVerificacao.length !== 6) {
      this.erroVerificar = 'Digite o código de 6 dígitos.';
      return;
    }
    this.acaoVerificar = { ...this.acaoVerificar, loading: true };
    this.erroVerificar = '';
    this.auth.verificarEmailCodigo(this.emailVerificar, this.codigoVerificacao).subscribe({
      next: () => {
        this.acaoVerificar = { ...this.acaoVerificar, loading: false };
        this.modalVerificar.close();
        if (this.senhaParaAutoLogin) {
          this.auth.login(this.emailVerificar, this.senhaParaAutoLogin).subscribe({
            next: () => this.router.navigate(['/portal/dashboard']),
            error: () => {
              this.trocarAba('login');
              this.sucesso = true;
            },
          });
        } else {
          this.trocarAba('login');
          this.sucesso = true;
        }
      },
      error: (err: any) => {
        const msg = err?.error?.message ?? '';
        this.erroVerificar =
          msg === 'CODIGO_EXPIRADO' ? 'Código expirado. Clique em "Reenviar código".' :
          msg === 'CODIGO_INVALIDO' ? 'Código incorreto. Tente novamente.' :
          'Erro ao verificar. Tente novamente.';
        this.acaoVerificar = { ...this.acaoVerificar, loading: false };
      },
    });
  }

  reenviarCodigo() {
    this.auth.reenviarCodigoVerificacao(this.emailVerificar).subscribe({
      next: () => {
        this.erroVerificar = '';
        this.codigoVerificacao = '';
      },
    });
  }

  abrirModalVerificar(email: string, senha: string) {
    this.emailVerificar = email;
    this.senhaParaAutoLogin = senha;
    this.codigoVerificacao = '';
    this.erroVerificar = '';
    this.acaoVerificar = { ...this.acaoVerificar, loading: false };
    this.modalVerificar.open();
  }

  solicitarReset() {
    if (!this.emailRecuperar) {
      this.erroRecuperar = 'Informe seu e-mail.';
      return;
    }
    this.carregandoRecuperar = true;
    this.erroRecuperar = '';
    this.auth.recuperarSenha(this.emailRecuperar).subscribe({
      next: () => {
        this.carregandoRecuperar = false;
        this.codigoReset = '';
        this.erroCodigoReset = '';
        this.acaoVerificarReset = { ...this.acaoVerificarReset, loading: false };
        this.modalCodigoReset.open();
        this.trocarAba('login');
      },
      error: () => {
        this.erroRecuperar = 'Erro ao enviar. Tente novamente.';
        this.carregandoRecuperar = false;
      },
    });
  }

  verificarCodigoReset() {
    if (!this.codigoReset || this.codigoReset.length !== 6) {
      this.erroCodigoReset = 'Digite o código de 6 dígitos.';
      return;
    }
    this.acaoVerificarReset = { ...this.acaoVerificarReset, loading: true };
    this.erroCodigoReset = '';
    this.auth.verificarCodigoReset(this.emailRecuperar, this.codigoReset).subscribe({
      next: () => {
        this.acaoVerificarReset = { ...this.acaoVerificarReset, loading: false };
        this.modalCodigoReset.close();
        this.novaSenha = '';
        this.confirmarSenha = '';
        this.erroNovaSenha = '';
        this.acaoSalvarSenha = { ...this.acaoSalvarSenha, loading: false };
        this.modalNovaSenha.open();
      },
      error: (err: any) => {
        const msg = err?.error?.message ?? '';
        this.erroCodigoReset =
          msg === 'CODIGO_EXPIRADO' ? 'Código expirado. Reenvie um novo.' :
          msg === 'CODIGO_INVALIDO' ? 'Código incorreto. Tente novamente.' :
          'Erro ao validar. Tente novamente.';
        this.acaoVerificarReset = { ...this.acaoVerificarReset, loading: false };
      },
    });
  }

  reenviarCodigoReset() {
    this.auth.recuperarSenha(this.emailRecuperar).subscribe({
      next: () => { this.codigoReset = ''; this.erroCodigoReset = ''; },
    });
  }

  salvarNovaSenha() {
    if (!this.novaSenha || this.novaSenha.length < 8) {
      this.erroNovaSenha = 'Senha deve ter no mínimo 8 caracteres.';
      return;
    }
    if (this.novaSenha !== this.confirmarSenha) {
      this.erroNovaSenha = 'As senhas não coincidem.';
      return;
    }
    this.acaoSalvarSenha = { ...this.acaoSalvarSenha, loading: true };
    this.erroNovaSenha = '';
    this.auth.redefinirSenhaComCodigo(this.emailRecuperar, this.codigoReset, this.novaSenha).subscribe({
      next: () => {
        this.acaoSalvarSenha = { ...this.acaoSalvarSenha, loading: false };
        this.modalNovaSenha.close();
        this.auth.login(this.emailRecuperar, this.novaSenha).subscribe({
          next: () => this.router.navigate(['/portal/dashboard']),
          error: () => {
            this.trocarAba('login');
            this.erro = 'Senha redefinida! Faça login para continuar.';
          },
        });
      },
      error: (err: any) => {
        const msg = err?.error?.message ?? '';
        this.erroNovaSenha =
          msg === 'CODIGO_EXPIRADO' ? 'Código expirado. Reinicie o processo.' :
          'Erro ao salvar. Tente novamente.';
        this.acaoSalvarSenha = { ...this.acaoSalvarSenha, loading: false };
      },
    });
  }
}
