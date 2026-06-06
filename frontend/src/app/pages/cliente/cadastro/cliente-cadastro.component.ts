import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-cliente-cadastro',
  standalone: false,
  template: `
    <div class="cl-cadastro">
      <div class="cl-cadastro__card">
        <div class="cl-cadastro__logo">
          <span class="an an-database-duotone"></span>
          <strong>BuscaDados</strong>
        </div>
        <h1>Criar conta grátis</h1>

        <po-input p-label="Nome" [(ngModel)]="nome" p-placeholder="Seu nome completo"></po-input>
        <po-input p-label="E-mail" p-type="email" [(ngModel)]="email" p-placeholder="seu@email.com"></po-input>
        <po-input p-label="Senha" p-type="password" [(ngModel)]="senha" p-placeholder="Mínimo 8 caracteres"></po-input>

        <p class="cl-cadastro__sub">Os demais dados serão preenchidos no primeiro acesso.</p>

        <po-button p-label="Criar conta" p-kind="primary" p-icon="an an-user-plus"
          (p-click)="cadastrar()">
        </po-button>

        <p *ngIf="erro" class="cl-cadastro__erro">{{ erro }}</p>

        <div class="cl-cadastro__links">
          <a routerLink="/login">Já tem conta? Entrar</a>
          <a routerLink="/">← Voltar ao início</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cl-cadastro {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%);
      padding: 40px 0;
    }
    .cl-cadastro__card {
      background: #fff; padding: 48px; border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,.1); min-width: 600px; max-width: 800px;
      display: flex; flex-direction: column; gap: 16px;
      h1 { font-size: 1.3rem; font-weight: 800; margin: 0; color: #111827; }
    }
    .cl-cadastro__logo {
      display: flex; align-items: center; gap: 8px;
      font-size: 1.1rem; font-weight: 800; color: #1a56db;
      span { font-size: 1.5rem; }
    }
    .cl-cadastro__sub { margin: 0; font-size: 0.875rem; color: #6b7280; }
    .cl-cadastro__erro { color: #dc2626; font-size: 0.875rem; margin: 0; }
    .cl-cadastro__links {
      display: flex; justify-content: space-between;
      a { font-size: 0.8rem; color: #1a56db; text-decoration: none; }
      a:hover { text-decoration: underline; }
    }
  `],
})
export class ClienteCadastroComponent {
  nome = '';
  email = '';
  senha = '';
  erro = '';

  constructor(private auth: AuthService, private router: Router) {}

  cadastrar() {
    if (!this.nome || !this.email || !this.senha) {
      this.erro = 'Preencha os campos obrigatórios (Nome, E-mail, Senha).';
      return;
    }
    if (this.senha.length < 8) {
      this.erro = 'Senha deve ter no mínimo 8 caracteres.';
      return;
    }

    const payload = { nome: this.nome, email: this.email, senha: this.senha };

    this.auth.signupApi(payload).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.erro = err?.error?.message ?? 'Erro ao criar conta. Tente novamente.';
      },
    });
  }
}
