import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-dashboard',
  standalone: false,
  template: `
    <div style="padding: 48px; text-align: center;">
      <span class="an an-gauge" style="font-size: 3rem; color: #1a56db;"></span>
      <h2 style="margin: 16px 0 8px;">Olá, {{ nome }}!</h2>
      <p style="color: #6b7280;">Seu dashboard está em construção. Em breve você verá seu consumo e token de API aqui.</p>
      <po-button p-label="Sair" p-kind="secondary" p-icon="an an-sign-out" (p-click)="sair()"></po-button>
    </div>
  `,
})
export class ClienteDashboardComponent implements OnInit {
  nome = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.nome = this.auth.getClienteNome();
  }

  sair() {
    this.auth.logoutCliente();
    this.router.navigate(['/']);
  }
}
