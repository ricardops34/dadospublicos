import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-cliente-login',
  standalone: false,
  template: `
    <div class="cl-login">
      <div class="cl-login__card">
        <div class="cl-login__logo">
          <span class="an an-database-duotone"></span>
          <strong>BuscaDados</strong>
        </div>
        <h1>Entrar na sua conta</h1>

        <po-input p-label="E-mail" p-type="email" [(ngModel)]="email" p-placeholder="seu@email.com"></po-input>
        <po-input p-label="Senha" p-type="password" [(ngModel)]="senha" p-placeholder="••••••••"></po-input>

        <po-button p-label="Entrar" p-kind="primary" p-icon="an an-sign-in"
          [p-loading]="carregando" (p-click)="entrar()">
        </po-button>

        <p *ngIf="erro" class="cl-login__erro">{{ erro }}</p>

        <div class="cl-login__links">
          <a routerLink="/cliente/cadastro">Criar conta grátis</a>
          <a routerLink="/">← Voltar ao início</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cl-login {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%);
    }
    .cl-login__card {
      background: #fff; padding: 48px; border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,.1); min-width: 380px;
      display: flex; flex-direction: column; gap: 16px;
      h1 { font-size: 1.3rem; font-weight: 800; margin: 0; color: #111827; }
    }
    .cl-login__logo {
      display: flex; align-items: center; gap: 8px;
      font-size: 1.1rem; font-weight: 800; color: #1a56db;
      span { font-size: 1.5rem; }
    }
    .cl-login__erro { color: #dc2626; font-size: 0.875rem; margin: 0; }
    .cl-login__links {
      display: flex; justify-content: space-between;
      a { font-size: 0.8rem; color: #1a56db; text-decoration: none; }
      a:hover { text-decoration: underline; }
    }
  `],
})
export class ClienteLoginComponent {
  email = '';
  senha = '';
  erro = '';
  carregando = false;

  constructor(private auth: AuthService, private router: Router) {}

  entrar() {
    if (!this.email || !this.senha) { this.erro = 'Preencha e-mail e senha.'; return; }
    this.carregando = true;
    this.auth.loginApi(this.email, this.senha).subscribe({
      next: (res: any) => {
        this.auth.loginCliente(res.id, res.nome);
        this.router.navigate(['/cliente/dashboard']);
      },
      error: () => {
        this.erro = 'E-mail ou senha inválidos.';
        this.carregando = false;
      },
    });
  }
}
