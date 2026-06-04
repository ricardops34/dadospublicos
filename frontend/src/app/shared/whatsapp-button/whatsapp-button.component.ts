import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Mensagem {
  texto: string;
  tipo: 'bot' | 'usuario';
}

@Component({
  selector: 'app-whatsapp-button',
  standalone: false,
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.scss'],
})
export class WhatsappButtonComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatBody') chatBody!: ElementRef;

  aberto = false;
  digitando = false;
  passo = 0;
  inputValor = '';
  mensagens: Mensagem[] = [];
  enviando = false;

  atendente  = environment.whatsappAtendente;
  whatsappNumero = environment.whatsappNumero;

  userData = { nome: '', telefone: '', email: '', mensagem: '' };

  private perguntas: Array<(nome?: string) => string> = [
    (nome = '') => `Prazer, ${nome}! Qual o seu telefone de contato?`,
    ()          => `Legal! E qual o seu melhor e-mail?`,
    ()          => `Entendido. Por fim, como podemos te ajudar hoje?`,
    ()          => `Obrigado! Suas informações foram enviadas com sucesso. Entraremos em contato em breve. 🚀`,
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Carrega config do backend
    this.http.get<any>(`${environment.apiUrl}/suporte/config`).subscribe({
      next: (cfg) => {
        if (cfg.whatsappNumero) this.whatsappNumero = cfg.whatsappNumero;
        if (cfg.atendente)      this.atendente      = cfg.atendente;
        if (cfg.mensagemBoasVindas) {
          this.mensagens = [{ texto: cfg.mensagemBoasVindas, tipo: 'bot' }];
        }
      },
      error: () => {},
    });

    // Mensagem inicial padrão
    this.mensagens = [{ texto: 'Olá! Sou a Beatriz. Como posso te chamar?', tipo: 'bot' }];
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggle() { this.aberto = !this.aberto; }
  fechar()  { this.aberto = false; }

  onEnter(e: KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); this.enviar(); }
  }

  enviar() {
    const texto = this.inputValor.trim();
    if (!texto || this.digitando) return;
    this.inputValor = '';

    // Adiciona mensagem do usuário
    this.mensagens.push({ texto, tipo: 'usuario' });

    // Armazena dado conforme passo
    if (this.passo === 0) this.userData.nome     = texto;
    if (this.passo === 1) this.userData.telefone = texto;
    if (this.passo === 2) this.userData.email    = texto;
    if (this.passo === 3) this.userData.mensagem = texto;

    if (this.passo < 3) {
      this.mostrarDigitando(() => {
        const resposta = this.perguntas[this.passo](this.userData.nome);
        this.mensagens.push({ texto: resposta, tipo: 'bot' });
        this.passo++;
      });
    } else {
      // Último passo — envia
      this.enviando = true;
      this.mostrarDigitando(() => {
        this.submeterFormulario(texto);
      });
    }
  }

  private mostrarDigitando(callback: () => void) {
    this.digitando = true;
    setTimeout(() => {
      this.digitando = false;
      callback();
    }, 1400);
  }

  private submeterFormulario(mensagemFinal: string) {
    const payload = {
      access_key: '4dc14390-3dcd-43a5-a138-fcb15b5410b6',
      name:    this.userData.nome,
      email:   this.userData.email,
      subject: 'Novo Lead — Chat WhatsApp BuscaDados',
      message: `Telefone: ${this.userData.telefone}\nMensagem: ${mensagemFinal}`,
    };

    this.http.post('https://api.web3forms.com/submit', payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    }).subscribe({
      next: () => {
        this.mensagens.push({ texto: this.perguntas[3](), tipo: 'bot' });
        this.passo++;
        this.enviando = false;
        // Abre WhatsApp
        if (this.whatsappNumero) {
          const waTxt = `Olá! Sou ${this.userData.nome}.\n${mensagemFinal}`;
          window.open(`https://wa.me/${this.whatsappNumero}?text=${encodeURIComponent(waTxt)}`, '_blank', 'noopener');
        }
      },
      error: () => {
        this.mensagens.push({ texto: 'Ops, algo deu errado. Pode tentar novamente em instantes?', tipo: 'bot' });
        this.enviando = false;
      },
    });
  }

  private scrollToBottom() {
    if (this.chatBody?.nativeElement) {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    }
  }
}
