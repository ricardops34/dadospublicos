import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

type Passo = 'chat' | 'form' | 'enviado';

@Component({
  selector: 'app-whatsapp-button',
  standalone: false,
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.scss'],
})
export class WhatsappButtonComponent implements OnInit {
  aberto = false;
  passo: Passo = 'chat';
  enviando = false;

  // Config carregada do backend
  whatsappNumero = environment.whatsappNumero;
  atendente      = environment.whatsappAtendente;
  boasVindas     = 'Olá! Como posso te ajudar hoje? 👋';

  // Formulário
  nome      = '';
  email     = '';
  mensagem  = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/suporte/config`).subscribe({
      next: (cfg) => {
        if (cfg.whatsappNumero)     this.whatsappNumero = cfg.whatsappNumero;
        if (cfg.atendente)          this.atendente      = cfg.atendente;
        if (cfg.mensagemBoasVindas) this.boasVindas     = cfg.mensagemBoasVindas;
      },
      error: () => {},
    });
  }

  toggle() { this.aberto = !this.aberto; }
  fechar()  { this.aberto = false; }

  irParaForm() { this.passo = 'form'; }

  enviar() {
    if (!this.nome || !this.email || !this.mensagem) return;
    this.enviando = true;

    this.http.post<any>(`${environment.apiUrl}/suporte/contato`, {
      nome: this.nome,
      email: this.email,
      mensagem: this.mensagem,
    }).subscribe({
      next: () => {
        this.passo = 'enviado';
        this.enviando = false;
        // Abre WhatsApp com a mensagem se número configurado
        if (this.whatsappNumero) {
          const texto = `Olá! Sou ${this.nome}.\n\n${this.mensagem}`;
          window.open(`https://wa.me/${this.whatsappNumero}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
        }
      },
      error: () => {
        this.enviando = false;
      },
    });
  }

  reiniciar() {
    this.passo = 'chat';
    this.nome = this.email = this.mensagem = '';
  }
}
