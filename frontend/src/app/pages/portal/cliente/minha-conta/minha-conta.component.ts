import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PoComboFilterMode, PoModalAction, PoModalComponent } from '@po-ui/ng-components';
import { NotifService } from '../../../../services/notif.service';
import { AuthService } from '../../../../services/auth.service';
import { ClienteExclusaoResponse, ClientePortalService } from '../cliente.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-minha-conta',
  standalone: false,
  templateUrl: './minha-conta.component.html',
})
export class MinhaContaComponent implements OnInit {
  @ViewChild('modalExclusao') modalExclusao!: PoModalComponent;

  perfil: any = null;
  carregando = true;
  salvando = false;
  editando = false;
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

  form = {
    nome: '',
    telefone: '',
    cnpj: '',
    razaoSocial: '',
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
    private svc: ClientePortalService,
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
      next: (perfil) => {
        this.perfil = perfil;
        this.form = {
          nome: perfil.nome ?? '',
          telefone: perfil.telefone ?? '',
          cnpj: perfil.cnpj ?? '',
          razaoSocial: perfil.razaoSocial ?? '',
          cep: perfil.cep ?? '',
          logradouro: perfil.logradouro ?? '',
          numero: perfil.numero ?? '',
          complemento: perfil.complemento ?? '',
          bairro: perfil.bairro ?? '',
          municipio: perfil.municipio ?? '',
          uf: perfil.uf ?? '',
          inscricaoEstadual: perfil.inscricaoEstadual ?? '',
          inscricaoMunicipal: perfil.inscricaoMunicipal ?? '',
        };

        if (perfil.uf) {
          this.municipioFilterService = `${environment.apiUrl}/geocode/municipios/${perfil.uf}`;
          this.municipioDisabled = false;
        }

        const assinaturaPagaAtiva = perfil.assinaturas?.find((assinatura: any) => this.svc.assinaturaEhPaga(assinatura));
        this.temPlanoPagoAtivo = !!assinaturaPagaAtiva;
        this.dataFimPlano = assinaturaPagaAtiva?.proximoVencimento ?? null;
        this.agendarExclusaoEm = perfil.agendarExclusaoEm ?? null;

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

  iniciarEdicao() {
    this.editando = true;
  }

  cancelarEdicao() {
    this.editando = false;
    this.form = {
      nome: this.perfil.nome ?? '',
      telefone: this.perfil.telefone ?? '',
      cnpj: this.perfil.cnpj ?? '',
      razaoSocial: this.perfil.razaoSocial ?? '',
      cep: this.perfil.cep ?? '',
      logradouro: this.perfil.logradouro ?? '',
      numero: this.perfil.numero ?? '',
      complemento: this.perfil.complemento ?? '',
      bairro: this.perfil.bairro ?? '',
      municipio: this.perfil.municipio ?? '',
      uf: this.perfil.uf ?? '',
      inscricaoEstadual: this.perfil.inscricaoEstadual ?? '',
      inscricaoMunicipal: this.perfil.inscricaoMunicipal ?? '',
    };
    if (this.perfil.uf) {
      this.municipioFilterService = `${environment.apiUrl}/geocode/municipios/${this.perfil.uf}`;
      this.municipioDisabled = false;
    } else {
      this.municipioFilterService = '';
      this.municipioDisabled = true;
    }
  }

  buscarCnpj() {
    const cnpj = (this.form.cnpj ?? '').replace(/\D/g, '');
    if (cnpj.length !== 14) return;
    this.http.get<any>(`${environment.apiUrl}/portal/geocode/cnpj/${cnpj}`).subscribe({
      next: (d) => {
        if (!d) return;
        if (!this.form.razaoSocial) this.form.razaoSocial = d.razaoSocial ?? '';
        if (!this.form.cep)         this.form.cep         = d.cep         ?? '';
        if (!this.form.logradouro)  this.form.logradouro  = d.logradouro  ?? '';
        if (!this.form.numero)      this.form.numero      = d.numero      ?? '';
        if (!this.form.complemento) this.form.complemento = d.complemento ?? '';
        if (!this.form.bairro)      this.form.bairro      = d.bairro      ?? '';
        if (!this.form.municipio)   this.form.municipio   = d.municipio   ?? '';
        if (!this.form.uf && d.uf) {
          this.form.uf = d.uf;
          this.onUfChange(d.uf);
        }
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  buscarCep() {
    const cep = (this.form.cep ?? '').replace(/\D/g, '');
    if (cep.length !== 8) return;
    this.http.get<any>(`${environment.apiUrl}/portal/geocode/cep/${cep}`).subscribe({
      next: (d) => {
        if (!this.form.logradouro)  this.form.logradouro  = d.logradouro  ?? '';
        if (!this.form.complemento) this.form.complemento = d.complemento ?? '';
        if (!this.form.bairro)      this.form.bairro      = d.bairro      ?? '';
        if (!this.form.municipio)   this.form.municipio   = d.municipio   ?? '';
        if (!this.form.uf && d.ufSigla) {
          this.form.uf = d.ufSigla;
          this.onUfChange(d.ufSigla);
        }
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  onUfChange(uf: string) {
    this.form.municipio = '';
    if (uf) {
      this.municipioFilterService = `${environment.apiUrl}/geocode/municipios/${uf}`;
      this.municipioDisabled = false;
    } else {
      this.municipioFilterService = '';
      this.municipioDisabled = true;
    }
  }

  salvar() {
    this.salvando = true;
    this.svc.atualizarPerfil(this.form).subscribe({
      next: (perfilAtualizado) => {
        this.perfil = { ...this.perfil, ...perfilAtualizado };
        this.editando = false;
        this.salvando = false;
        this.notif.success('Dados atualizados.');
      },
      error: () => {
        this.notif.error('Erro ao salvar.');
        this.salvando = false;
      },
    });
  }

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

  private aplicarResultadoExclusao(response: ClienteExclusaoResponse) {
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
