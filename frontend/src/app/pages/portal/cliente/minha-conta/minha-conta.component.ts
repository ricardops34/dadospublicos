import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PoComboFilterMode, PoModalAction, PoModalComponent, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { NotifService } from '../../../../services/notif.service';
import { AuthService } from '../../../../services/auth.service';
import { CnaeSecundario, UsuarioExclusaoResponse, UsuarioPortalService } from '../usuario.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-minha-conta',
  standalone: false,
  templateUrl: './minha-conta.component.html',
  styleUrls: ['./minha-conta.component.scss'],
})
export class MinhaContaComponent implements OnInit {
  @ViewChild('modalExclusao') modalExclusao!: PoModalComponent;
  @ViewChild('modalAvatar') modalAvatar!: PoModalComponent;
  @ViewChild('modalUsuario') modalUsuario!: PoModalComponent;

  perfil: any = null;
  cliente: any = null;
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

  // ─── CNAE (pessoa jurídica) ─────────────────────────────────────────────
  cnaeFilterService = `${environment.apiUrl}/portal/geocode/cnaes`;
  cnaesSecundarios: CnaeSecundario[] = [];
  formCnaesSecundarios: CnaeSecundario[] = [];
  novoCnaeSecundario: string | null = null;
  adicionandoCnae = false;

  colunasCnae: PoTableColumn[] = [
    { property: 'codigo', label: 'Código', width: '120px' },
    { property: 'descricao', label: 'Descrição' },
  ];

  acoesCnaeEdicao: PoTableAction[] = [
    { label: 'Remover', icon: 'an an-trash', type: 'danger', action: (item: CnaeSecundario) => this.removerCnaeSecundario(item) },
  ];

  // ─── Usuários da conta (manutenção pelo usuário principal) ─────────────
  usuariosConta: any[] = [];
  carregandoUsuarios = false;
  souPrincipal = false;
  salvandoUsuario = false;
  editandoUsuarioId: string | null = null;
  formUsuario = { nome: '', email: '', telefone: '', senha: '' };

  colunasUsuarios: PoTableColumn[] = [
    { property: 'nome', label: 'Nome' },
    { property: 'email', label: 'E-mail' },
    { property: 'telefone', label: 'Telefone', width: '140px' },
    {
      property: 'principalLabel', label: 'Função', type: 'label', width: '110px',
      labels: [
        { value: 'principal', color: 'color-08', label: 'Principal' },
        { value: 'comum', color: 'color-02', label: 'Usuário' },
      ],
    },
    {
      property: 'statusLabel', label: 'Status', type: 'label', width: '110px',
      labels: [
        { value: 'ativo', color: 'color-10', label: 'Ativo' },
        { value: 'bloqueado', color: 'color-07', label: 'Bloqueado' },
      ],
    },
    { property: 'ultimoLogin', label: 'Último acesso', type: 'dateTime', format: 'dd/MM/yyyy HH:mm', width: '160px' },
  ];

  acoesUsuarios: PoTableAction[] = [
    {
      label: 'Editar', icon: 'an an-pencil',
      visible: () => this.souPrincipal,
      action: (item: any) => this.abrirEdicaoUsuario(item),
    },
    {
      label: 'Bloquear', icon: 'an an-lock', type: 'danger',
      visible: (item: any) => this.souPrincipal && item.ativo && !item.principal,
      action: (item: any) => this.alterarBloqueioUsuario(item, false),
    },
    {
      label: 'Desbloquear', icon: 'an an-check-circle',
      visible: (item: any) => this.souPrincipal && !item.ativo,
      action: (item: any) => this.alterarBloqueioUsuario(item, true),
    },
    {
      label: 'Tornar principal', icon: 'an an-star',
      visible: (item: any) => this.souPrincipal && !item.principal && item.ativo,
      action: (item: any) => this.transferirPrincipal(item),
    },
  ];

  acaoSalvarUsuario: PoModalAction = {
    label: 'Salvar',
    action: () => this.salvarUsuario(),
    loading: false,
  };

  acaoCancelarUsuario: PoModalAction = {
    label: 'Cancelar',
    action: () => this.modalUsuario.close(),
  };

  editandoSenha = false;
  salvandoSenha = false;
  formSenha = { senhaAtual: '', novaSenha: '', confirmarSenha: '' };

  // Avatares disponíveis em frontend/public/avatar (avatar_01 é o padrão)
  avatares = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((n) => `avatar_${n}.png`);
  avatarSelecionado: string | null = null;

  acaoSalvarAvatar: PoModalAction = {
    label: 'Salvar avatar',
    action: () => this.salvarAvatar(),
    loading: false,
  };

  acaoCancelarAvatar: PoModalAction = {
    label: 'Cancelar',
    action: () => this.modalAvatar.close(),
  };

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
    cnaePrincipal: '',
  };

  get ehPessoaJuridica(): boolean {
    return (this.cliente?.tipoPessoa ?? this.perfil?.tipoPessoa ?? 'J') !== 'F';
  }

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
        this.cliente = perfilData.cliente ?? null;

        this.form = {
          nome: perfilData.nome ?? '',
          telefone: perfilData.telefone ?? '',
        };

        if (this.cliente) {
          this.formConta = {
            cnpj: this.cliente.cnpj ?? '',
            razaoSocial: this.cliente.razaoSocial ?? '',
            telefone: this.cliente.telefone ?? '',
            cep: this.cliente.cep ?? '',
            logradouro: this.cliente.logradouro ?? '',
            numero: this.cliente.numero ?? '',
            complemento: this.cliente.complemento ?? '',
            bairro: this.cliente.bairro ?? '',
            municipio: this.cliente.municipio ?? '',
            uf: this.cliente.uf ?? '',
            inscricaoEstadual: this.cliente.inscricaoEstadual ?? '',
            inscricaoMunicipal: this.cliente.inscricaoMunicipal ?? '',
            cnaePrincipal: this.cliente.cnaePrincipal ?? '',
          };
          this.cnaesSecundarios = (this.cliente.cnaesSecundarios ?? []).map((c: CnaeSecundario) => ({ ...c }));

          if (this.cliente.uf) {
            this.municipioFilterService = `${environment.apiUrl}/geocode/municipios/${this.cliente.uf}`;
            this.municipioDisabled = false;
          }
        }

        this.souPrincipal = !!(perfilData as any).usuarioPrincipal;
        if (this.cliente) {
          this.carregarUsuariosConta();
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

  // ─── Avatar ────────────────────────────────────────────────────────────────

  abrirSeletorAvatar() {
    this.avatarSelecionado = this.perfil?.avatar ?? null;
    this.modalAvatar.open();
  }

  selecionarAvatar(avatar: string) {
    this.avatarSelecionado = avatar;
  }

  salvarAvatar() {
    if (!this.avatarSelecionado) {
      this.notif.error('Escolha um avatar.');
      return;
    }
    this.acaoSalvarAvatar = { ...this.acaoSalvarAvatar, loading: true };
    this.svc.atualizarAvatar(this.avatarSelecionado).subscribe({
      next: () => {
        this.perfil = { ...this.perfil, avatar: this.avatarSelecionado };
        this.acaoSalvarAvatar = { ...this.acaoSalvarAvatar, loading: false };
        this.modalAvatar.close();
        this.notif.success('Avatar atualizado.');
        this.cdr.detectChanges();
      },
      error: () => {
        this.acaoSalvarAvatar = { ...this.acaoSalvarAvatar, loading: false };
        this.notif.error('Erro ao salvar avatar.');
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
    this.formCnaesSecundarios = this.cnaesSecundarios.map((c) => ({ ...c }));
    this.novoCnaeSecundario = null;
  }

  cancelarEdicaoConta() {
    this.editandoConta = false;
    this.formCnaesSecundarios = [];
    this.novoCnaeSecundario = null;
    if (this.cliente) {
      this.formConta = {
        cnpj: this.cliente.cnpj ?? '',
        razaoSocial: this.cliente.razaoSocial ?? '',
        telefone: this.cliente.telefone ?? '',
        cep: this.cliente.cep ?? '',
        logradouro: this.cliente.logradouro ?? '',
        numero: this.cliente.numero ?? '',
        complemento: this.cliente.complemento ?? '',
        bairro: this.cliente.bairro ?? '',
        municipio: this.cliente.municipio ?? '',
        uf: this.cliente.uf ?? '',
        inscricaoEstadual: this.cliente.inscricaoEstadual ?? '',
        inscricaoMunicipal: this.cliente.inscricaoMunicipal ?? '',
        cnaePrincipal: this.cliente.cnaePrincipal ?? '',
      };
    }
  }

  adicionarCnaeSecundario() {
    const codigo = (this.novoCnaeSecundario ?? '').replace(/\D/g, '');
    if (!codigo) {
      this.notif.error('Selecione um CNAE para adicionar.');
      return;
    }
    if (codigo === (this.formConta.cnaePrincipal ?? '').replace(/\D/g, '')) {
      this.notif.error('Este CNAE já é o principal.');
      return;
    }
    if (this.formCnaesSecundarios.some((c) => c.codigo === codigo)) {
      this.notif.error('CNAE já adicionado.');
      return;
    }

    this.adicionandoCnae = true;
    this.http.get<any>(`${environment.apiUrl}/portal/geocode/cnaes/${codigo}`).subscribe({
      next: (cnae) => {
        this.formCnaesSecundarios = [...this.formCnaesSecundarios, { codigo, descricao: cnae?.descricao ?? null }];
        this.novoCnaeSecundario = null;
        this.adicionandoCnae = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.adicionandoCnae = false;
        this.notif.error('CNAE não encontrado.');
        this.cdr.detectChanges();
      },
    });
  }

  removerCnaeSecundario(item: CnaeSecundario) {
    this.formCnaesSecundarios = this.formCnaesSecundarios.filter((c) => c.codigo !== item.codigo);
    this.cdr.detectChanges();
  }

  salvarConta() {
    this.salvandoConta = true;
    const payload = {
      ...this.formConta,
      cnaesSecundarios: this.formCnaesSecundarios.map((c) => ({ codigo: c.codigo, descricao: c.descricao ?? null })),
    };
    this.http.patch<any>(`${environment.apiUrl}/usuarios/me/cliente`, payload).subscribe({
      next: (contaAtualizada) => {
        this.cliente = { ...this.cliente, ...contaAtualizada };
        this.cnaesSecundarios = (contaAtualizada?.cnaesSecundarios ?? this.formCnaesSecundarios).map((c: CnaeSecundario) => ({ ...c }));
        this.svc.invalidarPerfilCache();
        this.editandoConta = false;
        this.salvandoConta = false;
        this.notif.success('Dados da empresa atualizados.');
        this.cdr.detectChanges();
      },
      error: () => {
        this.notif.error('Erro ao salvar dados da empresa.');
        this.salvandoConta = false;
        this.cdr.detectChanges();
      },
    });
  }

  buscarCnpj() {
    const cnpj = (this.formConta.cnpj ?? '').replace(/\D/g, '');
    if (cnpj.length !== 14) return;
    this.http.get<any>(`${environment.apiUrl}/cnpj/${cnpj}`).subscribe({
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
        if (!this.formConta.cnaePrincipal && d.cnaePrincipal) {
          this.formConta.cnaePrincipal = d.cnaePrincipal;
        }
        if (!this.formCnaesSecundarios.length && d.cnaesSecundarios?.length) {
          this.formCnaesSecundarios = d.cnaesSecundarios.map((c: CnaeSecundario) => ({ codigo: c.codigo, descricao: c.descricao ?? null }));
        }
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  buscarCep() {
    const cep = (this.formConta.cep ?? '').replace(/\D/g, '');
    if (cep.length !== 8) return;
    this.http.get<any>(`${environment.apiUrl}/geocode/cep/${cep}`).subscribe({
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

  // ─── Usuários da conta ─────────────────────────────────────────────────────

  carregarUsuariosConta() {
    this.carregandoUsuarios = true;
    this.http.get<any[]>(`${environment.apiUrl}/usuarios/me/cliente/usuarios`).subscribe({
      next: (usuarios) => {
        this.usuariosConta = (usuarios ?? []).map((u) => ({
          ...u,
          principalLabel: u.principal ? 'principal' : 'comum',
          statusLabel: u.ativo ? 'ativo' : 'bloqueado',
        }));
        this.carregandoUsuarios = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.carregandoUsuarios = false;
        this.cdr.detectChanges();
      },
    });
  }

  abrirNovoUsuario() {
    this.editandoUsuarioId = null;
    this.formUsuario = { nome: '', email: '', telefone: '', senha: '' };
    this.modalUsuario.open();
  }

  abrirEdicaoUsuario(item: any) {
    this.editandoUsuarioId = item.id;
    this.formUsuario = { nome: item.nome ?? '', email: item.email ?? '', telefone: item.telefone ?? '', senha: '' };
    this.modalUsuario.open();
  }

  salvarUsuario() {
    if (!this.formUsuario.nome || !this.formUsuario.email) {
      this.notif.error('Informe nome e e-mail.');
      return;
    }
    if (!this.editandoUsuarioId && (!this.formUsuario.senha || this.formUsuario.senha.length < 8)) {
      this.notif.error('Informe uma senha com pelo menos 8 caracteres.');
      return;
    }
    if (!this.editandoUsuarioId && !this.formUsuario.telefone) {
      this.notif.error('Informe o telefone.');
      return;
    }

    this.acaoSalvarUsuario = { ...this.acaoSalvarUsuario, loading: true };

    const request = this.editandoUsuarioId
      ? this.http.patch(`${environment.apiUrl}/usuarios/me/cliente/usuarios/${this.editandoUsuarioId}`, {
          nome: this.formUsuario.nome,
          email: this.formUsuario.email,
          telefone: this.formUsuario.telefone,
          ...(this.formUsuario.senha ? { senha: this.formUsuario.senha } : {}),
        })
      : this.http.post(`${environment.apiUrl}/usuarios/me/cliente/usuarios`, this.formUsuario);

    request.subscribe({
      next: () => {
        this.acaoSalvarUsuario = { ...this.acaoSalvarUsuario, loading: false };
        this.modalUsuario.close();
        this.notif.success(this.editandoUsuarioId ? 'Usuário atualizado.' : 'Usuário criado.');
        this.carregarUsuariosConta();
      },
      error: (err) => {
        this.acaoSalvarUsuario = { ...this.acaoSalvarUsuario, loading: false };
        this.notif.error(err?.error?.message ?? 'Erro ao salvar usuário.');
        this.cdr.detectChanges();
      },
    });
  }

  alterarBloqueioUsuario(item: any, ativo: boolean) {
    const acao = ativo ? 'desbloquear' : 'bloquear';
    if (!window.confirm(`Confirma ${acao} o usuário ${item.nome}?`)) return;

    this.http.patch(`${environment.apiUrl}/usuarios/me/cliente/usuarios/${item.id}/ativo`, { ativo }).subscribe({
      next: (res: any) => {
        this.notif.success(res?.mensagem ?? 'Status atualizado.');
        this.carregarUsuariosConta();
      },
      error: (err) => this.notif.error(err?.error?.message ?? 'Erro ao alterar status do usuário.'),
    });
  }

  transferirPrincipal(item: any) {
    if (!window.confirm(`Transferir a função de usuário principal para ${item.nome}? Você deixará de ser o principal da conta.`)) return;

    this.http.post(`${environment.apiUrl}/usuarios/me/cliente/usuarios/${item.id}/transferir-principal`, {}).subscribe({
      next: (res: any) => {
        this.notif.success(res?.mensagem ?? 'Função transferida.');
        this.souPrincipal = false;
        this.svc.invalidarPerfilCache();
        this.carregarUsuariosConta();
      },
      error: (err) => this.notif.error(err?.error?.message ?? 'Erro ao transferir função.'),
    });
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
