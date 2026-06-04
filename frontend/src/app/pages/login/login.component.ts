import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PoPageLogin } from '@po-ui/ng-templates';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  erro = '';
  carregando = false;

  constructor(private auth: AuthService, private router: Router) {}

  entrar(formData: PoPageLogin) {
    this.erro = '';
    this.carregando = true;
    
    this.auth.login(formData.login, formData.password).subscribe({
      next: (res) => {
        this.router.navigate(['/portal/dashboard']);
      },
      error: () => {
        // Usa o custom-field p/ exibir o erro, ou a própria variável erro se usar no layout custom.
        // O PO-UI tem suporte nativo para recuperar senha ou exibir erros.
        // Simulando a lógica original:
        this.erro = 'E-mail ou senha inválidos.';
        this.carregando = false;
      },
    });
  }
}
