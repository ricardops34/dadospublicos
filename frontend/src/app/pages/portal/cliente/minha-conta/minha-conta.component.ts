import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PoComboFilterMode, PoModalAction, PoModalComponent } from '@po-ui/ng-components';
import { NotifService } from '../../../../services/notif.service';
import { AuthService } from '../../../../services/auth.service';
import { UsuarioExclusaoResponse, UsuarioPortalService } from '../usuario.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-minha-conta',
  standalone: false,
  templateUrl: './minha-conta.component.html',
})
export class MinhaContaComponent implements OnInit {
  @ViewChild('modalExclusao') modalExclusao!: PoModalComponent;

  perfil: any = null;
  conta: any = null;
  carregando = true;
  salvando = false;
  salvandoConta = false;
  editando = false;
  editandoConta = false;
  exclusaoEmAndamento = false;
  temPlanoPagoAtivo = false;
  dataFimPlano: string | null = null;
  agendarExclusaoEm: Date | string | null = null;
  opcaoExclusao: 'agora' | 'fim-plano' = 'agora';

  acaoConfirmarExclusao: PoModalAction = {
    label: 'Confirmar exclusão',
    action: () => this.confirmarExclusao(),
    loading: false,
    danger: true,
  };

  acaoCancelarExclusao: PoModalAction = {
    label: 'Cancelar',
    action: () => this.modalExclusao.close(),
  };

  opcoesExclusao: any[] = [];

  readonly PoComboFilterMode = PoComboFilterMode;

  ufOptions: any[] = [];
  municipioFilterService = '';
  municipioDisabled = true;

  editandoSenha = false;
  salvandoSenha = false;
  formSenha = { senhaAtual: '', novaSenha: '', confirmarSenha: '' };

  // Formulário dados pessoais
  form = {
    nome: '',
    telefone: '',
  };

  // Formulário dados da empresa/conta
  formConta = {
    cnpj: '',
    razaoSocial: '',
    telefone: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    municipio: '',
    uf: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
  };

  constructor(
    private svc: UsuarioPortalService,
    private notif: NotifService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['acao'] === 'trocar-senha') {
        this.editandoSenha = true;
      }
    });

    this.http.get<any>(`${environment.apiUrl}/geocode/ufs`).subscribe({
      next: (r) => (this.ufOptions = r.items ?? []),
    });

    this.svc.meuPerfil().subscribe({
      next: (perfilData) => {
        this.perfil = perfilData;
        this.conta = perfilData.conta ?? null;

        this.form = {
          nome: perfilData.nome ?? '',
          telefone: perfilData.telefone ?? '',
        };

        if (this.conta) {
          this.formConta = {
            cnpj: this.conta.cnpj ?? '',
            razaoSocial: this.conta.razaoSocial ?? '',
            telefone: this.conta.telefone ?? '',
            cep: this.conta.cep ?? '',
            logradouro: this.conta.logradouro ?? '',
            numero: this.conta.numero ?? '',
            complemento: this.conta.complemento ?? '',
            bairro: this.conta.bairro ?? '',
            municipio: this.conta.municipio ?? '',
            uf: this.conta.uf ?? '',
            inscricaoEstadual: this.conta.inscricaoEstadual ?? '',
            inscricaoMunicipal: this.conta.inscricaoMunicipal ?? '',
          };

          if (this.conta.uf) {
            this.municipioFilterService = `${environment.apiUrl}/geocode/municipios/${this.conta.uf}`;
            this.municipioDisabled = false;
          }
        }

        const assinaturaPagaAtiva = perfilData.assinaturas?.find((a: any) => this.svc.assinaturaEhPaga(a));
        this.temPlanoPagoAtivo = !!assinaturaPagaAtiva;
        this.dataFimPlano = assinaturaPagaAtiva?.proximoVencimento ?? null;
        this.agendarExclusaoEm = perfilData.agendarExclusaoEm ?? null;

        this.opcaoExclusao = 'agora';
        this.opcoesExclusao = this.temPlanoPagoAtivo
          ? [
              { label: 'Agendar anonimização para o prazo padrão', value: 'agora' },
              { label: `Agendar para o fim do plano (${this.formatarData(this.dataFimPlano)})`, value: 'fim-plano' },
            ]
          : [{ label: 'Excluir minha conta definitivamente', value: 'agora' }];

        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.carregando = false;
        this.cdr.detectChanges();
      },
    });
  }

  // ─── Edição dados pessoais ─────────────────────────────────────────────────

  iniciarEdicao() {
    this.editando = true;
  }

  cancelarEdicao() {
    this.editando = false;
    this.form = {
      nome: this.perfil.nome ?? '',
      telefone: this.perfil.telefone ?? '',
    };
  }

  salvar() {
    this.salvando = true;
    this.svc.atualizarPerfil(this.form).subscribe({
      next: (perfilAtualizado) => {
        this.perfil = { ...this.perfil, ...perfilAtualizado };
        this.editando = false;
        this.salvando = false;
        this.notif.success('Dados pessoais atualizados.');
      },
      error: () => {
        this.notif.error('Erro ao salvar.');
        this.salvando = false;
      },
    });
  }

  // ─── Edição dados da empresa/conta ────────────────────────────────────────

  iniciarEdicaoConta() {
    this.editandoConta = true;
  }

  cancelarEdicaoConta() {
    this.editandoConta = false;
    if (this.conta) {
      this.formConta = {
        cnpj: this.conta.cnpj ?? '',
        razaoSocial: this.conta.razaoSocial ?? '',
        telefone: this.conta.telefone ?? '',
        cep: this.conta.cep ?? '',
        logradouro: this.conta.logradouro ?? '',
        numero: this.conta.numero ?? '',
        complemento: this.conta.complemento ?? '',
        bairro: this.conta.bairro ?? '',
        municipio: this.conta.municipio ?? '',
        uf: this.conta.uf ?? '',
        inscricaoEstadual: this.conta.inscricaoEstadual ?? '',
        inscricaoMunicipal: this.conta.inscricaoMunicipal ?? '',
      };
    }
  }

  salvarConta() {
    this.salvandoConta = true;
    this.http.patch(`${environment.apiUrl}/usuarios/me/conta`, this.formConta).subscribe({
      next: (contaAtualizada) => {
        this.conta = { ...this.conta, ...contaAtualizada };
        this.editandoConta = false;
        this.salvandoConta = false;
        this.notif.success('Dados da empresa atualizados.');
      },
      error: () => {
        this.notif.error('Erro ao salvar dados da empresa.');
        this.salvandoConta = false;
      },
    });
  }

  buscarCnpj() {
    const cnpj = (this.formConta.cnpj ?? '').replace(/\D/g, '');
    if (cnpj.length !== 14) return;
    this.http.get<any>(`${environment.apiUrl}/portal/geocode/cnpj/${cnpj}`).subscribe({
      next: (d) => {
        if (!d) return;
        if (!this.formConta.razaoSocial) this.formConta.razaoSocial = d.razaoSocial ?? '';
        if (!this.formConta.cep)         this.formConta.cep         = d.cep         ?? '';
        if (!this.formConta.logradouro)  this.formConta.logradouro  = d.logradouro  ?? '';
        if (!this.formConta.numero)      this.formConta.numero      = d.numero      ?? '';
        if (!this.formConta.complemento) this.formConta.complemento = d.complemento ?? '';
        if (!this.formConta.bairro)      this.formConta.bairro      = d.bairro      ?? '';
        if (!this.formConta.municipio)   this.formConta.municipio   = d.municipio   ?? '';
        if (!this.formConta.uf && d.uf) {
          this.formConta.uf = d.uf;
          this.onUfChange(d.uf);
        }
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  buscarCep() {
    const cep = (this.formConta.cep ?? '').replace(/\D/g, '');
    if (cep.length !== 8) return;
    this.http.get<any>(`${environment.apiUrl}/portal/geocode/cep/${cep}`).subscribe({
      next: (d) => {
        if (!this.formConta.logradouro)  this.formConta.logradouro  = d.logradouro  ?? '';
        if (!this.formConta.complemento) this.formConta.complemento = d.complemento ?? '';
        if (!this.formConta.bairro)      this.formConta.bairro      = d.bairro      ?? '';
        if (!this.formConta.municipio)   this.formConta.municipio   = d.municipio   ?? '';
        if (!this.formConta.uf && d.ufSigla) {
          this.formConta.uf = d.ufSigla;
          this.onUfChange(d.ufSigla);
        }
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  onUfChange(uf: string) {
    this.formConta.municipio = '';
    if (uf) {
      this.municipioFilterService = `${environment.apiUrl}/geocode/municipios/${uf}`;
      this.municipioDisabled = false;
    } else {
      this.municipioFilterService = '';
      this.municipioDisabled = true;
    }
  }

  // ─── Troca de senha ────────────────────────────────────────────────────────

  iniciarTrocarSenha() {
    this.editandoSenha = true;
    this.formSenha = { senhaAtual: '', novaSenha: '', confirmarSenha: '' };
  }

  cancelarTrocarSenha() {
    this.editandoSenha = false;
    this.formSenha = { senhaAtual: '', novaSenha: '', confirmarSenha: '' };
    this.router.navigate([], { queryParams: {}, replaceUrl: true });
  }

  salvarSenha() {
    if (this.formSenha.novaSenha !== this.formSenha.confirmarSenha) {
      this.notif.error('A nova senha e a confirmação não coincidem.');
      return;
    }
    if (this.formSenha.novaSenha.length < 8) {
      this.notif.error('A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }
    this.salvandoSenha = true;
    this.http.patch(`${environment.apiUrl}/portal/me/senha`, {
      senhaAtual: this.formSenha.senhaAtual,
      novaSenha: this.formSenha.novaSenha,
    }).subscribe({
      next: () => {
        this.salvandoSenha = false;
        this.editandoSenha = false;
        this.formSenha = { senhaAtual: '', novaSenha: '', confirmarSenha: '' };
        this.router.navigate([], { queryParams: {}, replaceUrl: true });
        this.notif.success('Senha alterada com sucesso.');
      },
      error: (err) => {
        this.salvandoSenha = false;
        const msg = err?.error?.message ?? 'Erro ao alterar senha.';
        this.notif.error(msg);
      },
    });
  }

  // ─── Exclusão ──────────────────────────────────────────────────────────────

  solicitarExclusao() {
    this.modalExclusao.open();
  }

  confirmarExclusao() {
    this.acaoConfirmarExclusao = { ...this.acaoConfirmarExclusao, loading: true };
    this.svc.agendarExclusao(this.opcaoExclusao).subscribe({
      next: (response) => {
        this.acaoConfirmarExclusao = { ...this.acaoConfirmarExclusao, loading: false };
        this.modalExclusao.close();
        this.aplicarResultadoExclusao(response);
      },
      error: () => {
        this.acaoConfirmarExclusao = { ...this.acaoConfirmarExclusao, loading: false };
        this.notif.error('Erro ao solicitar exclusão.');
      },
    });
  }

  desistirExclusao() {
    this.exclusaoEmAndamento = true;
    this.svc.cancelarExclusao().subscribe({
      next: () => {
        this.exclusaoEmAndamento = false;
        this.agendarExclusaoEm = null;
        this.notif.success('Solicitação de exclusão cancelada.');
      },
      error: () => {
        this.exclusaoEmAndamento = false;
        this.notif.error('Erro ao cancelar exclusão.');
      },
    });
  }

  private aplicarResultadoExclusao(response: UsuarioExclusaoResponse) {
    if (response.tipoFluxo === 'exclusao-imediata') {
      this.notif.success(response.mensagem || 'Conta excluída com sucesso.');
      this.auth.logout();
      setTimeout(() => this.router.navigate(['/']), 1200);
      return;
    }
    this.agendarExclusaoEm = response.agendarExclusaoEm;
    this.notif.success(response.mensagem || 'Anonimização agendada com sucesso.');
  }

  get dataExclusaoFormatada(): string {
    return this.agendarExclusaoEm ? this.formatarData(this.agendarExclusaoEm.toString()) : '';
  }

  get emailVerificadoLabel() {
    return this.perfil?.emailVerificado ? 'Verificado' : 'Pendente';
  }

  formatarData(iso: string | null): string {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('pt-BR');
  }
}
