import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: false,
  template: `
    <div class="admin-login">
      <div class="admin-login__card">
        <h1>Admin — Busca Dados</h1>
        <po-input
          p-label="Chave de administrador"
          p-type="password"
          p-placeholder="ADMIN_KEY"
          [(ngModel)]="key">
        </po-input>
        <po-button
          p-label="Entrar"
          p-kind="primary"
          p-icon="an an-sign-in"
          (p-click)="entrar()">
        </po-button>
        <p *ngIf="erro" class="admin-login__erro">{{ erro }}</p>
      </div>
    </div>
  `,
  styles: [`
    .admin-login {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: #f9fafb;
    }
    .admin-login__card {
      background: #fff; padding: 48px; border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,.08); min-width: 360px;
      display: flex; flex-direction: column; gap: 20px;
      h1 { font-size: 1.2rem; font-weight: 800; margin: 0; }
    }
    .admin-login__erro { color: #dc2626; font-size: 0.875rem; margin: 0; }
  `],
})
export class AdminLoginComponent {
  key = '';
  erro = '';

  constructor(private auth: AuthService, private router: Router) {}

  entrar() {
    if (!this.key) { this.erro = 'Informe a chave.'; return; }
    this.auth.setAdminKey(this.key);
    this.router.navigate(['/admin/dashboard']);
  }
}
