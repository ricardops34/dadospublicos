import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  senha = '';
  erro = '';
  carregando = false;

  constructor(private auth: AuthService, private router: Router) {}

  entrar() {
    this.erro = '';
    if (!this.email || !this.senha) { this.erro = 'Preencha e-mail e senha.'; return; }
    this.carregando = true;
    this.auth.login(this.email, this.senha).subscribe({
      next: (res) => {
        this.router.navigate(['/portal/dashboard']);
      },
      error: () => {
        this.erro = 'E-mail ou senha inválidos.';
        this.carregando = false;
      },
    });
  }
}
