import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-verificar-email',
  standalone: false,
  templateUrl: './verificar-email.component.html',
  styleUrls: ['./verificar-email.component.scss']
})
export class VerificarEmailComponent implements OnInit {
  verificando = true;
  sucesso = false;
  mensagem = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      this.verificando = false;
      this.mensagem = 'Token inválido ou não fornecido.';
      return;
    }

    this.http.get<{mensagem: string}>(`${environment.apiUrl}/clientes/verificar-email/${token}`).subscribe({
      next: (res) => {
        this.verificando = false;
        this.sucesso = true;
        this.mensagem = res.mensagem || 'E-mail verificado com sucesso!';
      },
      error: (err) => {
        this.verificando = false;
        this.sucesso = false;
        this.mensagem = err.error?.message || 'Erro ao verificar e-mail. Token inválido ou já utilizado.';
      }
    });
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }
}
