import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PoComboFilterMode } from '@po-ui/ng-components';
import { ClientePerfil, ClientePortalService } from '../cliente.service';
import { NotifService } from '../../../../services/notif.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-primeiro-acesso',
  standalone: false,
  template: `
    <po-page-default p-title="Primeiro acesso">
      <po-loading-overlay *ngIf="carregando"></po-loading-overlay>

      <ng-container *ngIf="!carregando">
        <div class="wizard-intro">
          <h2>Complete seu cadastro</h2>
          <p>São 4 etapas rápidas para liberar seu acesso completo à plataforma.</p>
        </div>

        <po-stepper
          [p-steps]="steps"
          [p-step]="stepAtual"
          [p-disable-click]="true"
          [p-sequential]="true"
          [p-align-center]="false">
        </po-stepper>

        <div class="wizard-card">
          <ng-container [ngSwitch]="stepAtual">

            <div *ngSwitchCase="1">
              <h3>Dados cadastrais</h3>
              <div class="po-row">
                <po-input class="po-md-6" p-label="Nome" [(ngModel)]="form.nome" p-required="true"></po-input>
                <po-info class="po-md-6" p-label="E-mail" [p-value]="form.email"></po-info>
              </div>
              <div class="po-row">
                <po-radio-group
                  class="po-md-6"
                  p-label="Tipo de pessoa"
                  p-name="tipoPessoa"
                  [(ngModel)]="form.tipoPessoa"
                  [p-options]="tipoPessoaOptions">
                </po-radio-group>
                <po-input class="po-md-6" p-label="Telefone" p-mask="(99) 99999-9999"
                  [(ngModel)]="form.telefone" p-required="true">
                </po-input>
              </div>
              <div class="po-row" *ngIf="form.tipoPessoa === 'F'">
                <po-input class="po-md-6" p-label="CPF" p-mask="999.999.999-99"
                  [(ngModel)]="form.cpf" p-required="true">
                </po-input>
                <po-datepicker class="po-md-6" p-label="Data de nascimento"
                  [(ngModel)]="form.dataNascimento" p-required="true">
                </po-datepicker>
              </div>
              <div class="po-row" *ngIf="form.tipoPessoa === 'J'">
                <po-input class="po-md-4" p-label="CNPJ" p-mask="99.999.999/9999-99"
                  [(ngModel)]="form.cnpj" p-required="true"
                  (p-blur)="buscarCnpj()">
                </po-input>
                <po-input class="po-md-8" p-label="Razão Social" [(ngModel)]="form.razaoSocial" p-required="true"></po-input>
              </div>
              <div class="po-row" *ngIf="form.tipoPessoa === 'J'">
                <po-input class="po-md-6" p-label="Inscrição Estadual"
                  [(ngModel)]="form.inscricaoEstadual"
                  p-help="Opcional">
                </po-input>
                <po-input class="po-md-6" p-label="Inscrição Municipal"
                  [(ngModel)]="form.inscricaoMunicipal"
                  p-help="Opcional">
                </po-input>
              </div>
            </div>

            <div *ngSwitchCase="2">
              <h3>Endereço</h3>
              <div class="po-row">
                <po-input class="po-md-3" p-label="CEP" p-mask="99999-999"
                  [(ngModel)]="form.cep" p-required="true"
                  (p-blur)="buscarCep()">
                </po-input>
                <po-input class="po-md-7" p-label="Logradouro" [(ngModel)]="form.logradouro" p-required="true"></po-input>
                <po-input class="po-md-2" p-label="Número" [(ngModel)]="form.numero" p-required="true"></po-input>
              </div>
              <div class="po-row">
                <po-input class="po-md-4" p-label="Complemento" [(ngModel)]="form.complemento"
                  p-help="Opcional — apto, sala, bloco, etc.">
                </po-input>
                <po-input class="po-md-3" p-label="Bairro" [(ngModel)]="form.bairro" p-required="true"></po-input>
                <po-combo class="po-md-3" p-label="Município" name="municipio"
                  [ngModel]="form.municipio"
                  (ngModelChange)="form.municipio = $event"
                  [p-filter-service]="municipioFilterService"
                  [p-disabled]="municipioDisabled"
                  [p-required]="true"
                  [p-clean]="true">
                </po-combo>
                <po-combo class="po-md-2" p-label="UF" name="uf"
                  [ngModel]="form.uf"
                  (ngModelChange)="form.uf = $event"
                  [p-options]="ufOptions"
                  [p-filter-mode]="PoComboFilterMode.contains"
                  [p-required]="true"
                  [p-clean]="true"
                  (p-change)="onUfChange($event)">
                </po-combo>
              </div>
            </div>

            <div *ngSwitchCase="3">
              <h3>Plano</h3>
              <p class="wizard-sub">Selecione o plano que deseja ativar agora.</p>

              <div class="periodo-tabs">
                <button type="button" class="periodo-tab" [class.periodo-tab--active]="periodo === 'mensal'"    (click)="periodo = 'mensal'">Mensal</button>
                <button type="button" class="periodo-tab" [class.periodo-tab--active]="periodo === 'semestral'" (click)="periodo = 'semestral'">Semestral <span class="periodo-desconto">-10%</span></button>
                <button type="button" class="periodo-tab" [class.periodo-tab--active]="periodo === 'anual'"     (click)="periodo = 'anual'">Anual <span class="periodo-desconto">-15%</span></button>
              </div>

              <div class="planos-grid">
                <button
                  type="button"
                  class="plano-card"
                  *ngFor="let plano of planos"
                  [class.plano-card--selected]="planoSelecionado?.slug === plano.slug"
                  (click)="selecionarPlano(plano)">
                  <div class="plano-card__header">
                    <strong>{{ plano.nome }}</strong>
                    <po-tag *ngIf="planoSelecionado?.slug === plano.slug" p-value="Selecionado" p-color="color-10"></po-tag>
                    <po-tag *ngIf="plano.maisPopular" p-value="Popular" p-color="color-08"></po-tag>
                  </div>
                  <p>{{ plano.descricao }}</p>
                  <div class="plano-card__price" *ngIf="precoPlano(plano) === 0">
                    <strong>Gratuito</strong>
                  </div>
                  <div class="plano-card__price" *ngIf="precoPlano(plano) > 0">
                    R$ {{ precoPlano(plano) | number:'1.2-2' }}<span>/mês</span>
                  </div>
                </button>
              </div>
            </div>

            <div *ngSwitchCase="4">
              <h3>Concluir</h3>
              <p class="wizard-sub">Revise os dados antes de finalizar.</p>

              <div class="po-row">
                <po-info class="po-md-6" p-label="Nome" [p-value]="form.nome"></po-info>
                <po-info class="po-md-6" p-label="E-mail" [p-value]="form.email"></po-info>
              </div>
              <div class="po-row">
                <po-info class="po-md-4" p-label="Tipo" [p-value]="form.tipoPessoa === 'F' ? 'Pessoa Física' : 'Pessoa Jurídica'"></po-info>
                <po-info class="po-md-4" p-label="Telefone" [p-value]="form.telefone"></po-info>
                <po-info class="po-md-4" p-label="Plano" [p-value]="planoSelecionado?.nome || '—'"></po-info>
              </div>
              <div class="po-row">
                <po-info class="po-md-12" p-label="Endereço" [p-value]="enderecoResumo"></po-info>
              </div>
            </div>

          </ng-container>

          <div *ngIf="erro" class="wizard-error">
            <span class="an an-warning-circle"></span> {{ erro }}
          </div>

          <div class="wizard-actions">
            <po-button *ngIf="stepAtual > 1" p-label="Voltar" p-kind="tertiary" (p-click)="voltar()"></po-button>
            <po-button *ngIf="stepAtual < 4" p-label="Avançar" p-kind="primary" (p-click)="avancar()"></po-button>
            <po-button *ngIf="stepAtual === 4" p-label="Finalizar" p-kind="primary" [p-loading]="salvando" (p-click)="finalizar()"></po-button>
          </div>
        </div>
      </ng-container>
    </po-page-default>
  `,
  styles: [`
    .wizard-intro { margin-bottom: 24px; }
    .wizard-intro h2 { margin: 0 0 6px; font-size: 1.4rem; color: #0f172a; }
    .wizard-intro p, .wizard-sub { margin: 0; color: #64748b; }
    .wizard-card {
      margin-top: 24px;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      background: #fff;
    }
    .wizard-card h3 { margin: 0 0 16px; color: #0f172a; }
    .wizard-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 24px;
    }
    .wizard-error {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #fef2f2;
      color: #dc2626;
      border-radius: 10px;
      padding: 10px 14px;
      margin-top: 16px;
    }
    .planos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }
    .plano-card {
      border: 1px solid #dbe3f0;
      background: #fff;
      border-radius: 14px;
      padding: 18px;
      text-align: left;
      cursor: pointer;
      transition: border-color .2s, box-shadow .2s, transform .2s;
    }
    .plano-card:hover {
      border-color: #4097cc;
      box-shadow: 0 8px 24px rgba(64, 151, 204, .12);
      transform: translateY(-1px);
    }
    .periodo-tabs {
      display: flex; gap: 8px; margin: 16px 0;
    }
    .periodo-tab {
      padding: 8px 18px; border-radius: 8px; border: 1px solid #dbe3f0;
      background: #fff; color: #374151; font-size: 0.875rem; font-weight: 500; cursor: pointer;
      transition: all .15s;
    }
    .periodo-tab--active {
      background: #7c3aed; color: #fff; border-color: #7c3aed;
    }
    .periodo-desconto {
      font-size: 0.75rem; background: #dcfce7; color: #16a34a;
      border-radius: 4px; padding: 1px 5px; margin-left: 4px;
    }
    .periodo-tab--active .periodo-desconto { background: rgba(255,255,255,.2); color: #fff; }
    .plano-card__price span { font-size: 0.8rem; color: #9ca3af; font-weight: 400; }
    .plano-card--selected {
      border-color: #4097cc;
      box-shadow: 0 0 0 2px rgba(64, 151, 204, .15);
      background: #f7fbfe;
    }
    .plano-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 10px;
    }
    .plano-card p {
      margin: 0 0 16px;
      color: #64748b;
      font-size: 0.9rem;
      line-height: 1.5;
    }
    .plano-card__price {
      font-size: 1.1rem;
      font-weight: 700;
      color: #0f172a;
    }
  `],
})
export class PrimeiroAcessoComponent implements OnInit {
  carregando = true;
  salvando = false;
  erro = '';
  stepAtual = 1;
  perfil: ClientePerfil | null = null;
  planoSelecionado: any = null;
  planoAtualSlug: string | null = null;
  planos: any[] = [];
  periodo: 'mensal' | 'semestral' | 'anual' = 'mensal';

  readonly steps = [
    { label: 'Dados cadastrais' },
    { label: 'Endereço' },
    { label: 'Plano' },
    { label: 'Concluir' },
  ];

  readonly tipoPessoaOptions = [
    { label: 'Pessoa Jurídica', value: 'J' },
    { label: 'Pessoa Física', value: 'F' },
  ];

  readonly PoComboFilterMode = PoComboFilterMode;

  ufOptions: any[] = [];
  municipioFilterService = '';
  municipioDisabled = true;

  form = {
    nome: '',
    email: '',
    tipoPessoa: 'J' as 'F' | 'J',
    telefone: '',
    cpf: '',
    dataNascimento: '',
    cnpj: '',
    razaoSocial: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    municipio: '',
    uf: '',
  };

  constructor(
    private clienteService: ClientePortalService,
    private notif: NotifService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
  ) {}

  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/geocode/ufs`).subscribe({
      next: (r) => (this.ufOptions = r.items ?? []),
    });

    forkJoin({
      perfil: this.clienteService.meuPerfil(),
      planos: this.clienteService.listarPlanos().pipe(catchError(() => of([]))),
    }).subscribe({
      next: ({ perfil, planos }) => {
        if (!this.clienteService.temOnboardingPendente(perfil)) {
          this.router.navigate(['/portal/dashboard']);
          return;
        }

        this.perfil = perfil;
        this.planos = planos;
        const assinaturaAtiva = perfil.assinaturas?.find((a: any) => ['ativa', 'trial'].includes(a.status));
        this.planoAtualSlug = assinaturaAtiva?.plano?.slug ?? null;
        this.planoSelecionado = this.planos.find((plano: any) => plano.slug === this.planoAtualSlug) ?? null;

        this.form = {
          nome: perfil.nome ?? '',
          email: perfil.email ?? '',
          tipoPessoa: (perfil.tipoPessoa as 'F' | 'J') ?? 'J',
          telefone: perfil.telefone ?? '',
          cpf: perfil.cpf ?? '',
          dataNascimento: perfil.dataNascimento ?? '',
          cnpj: perfil.cnpj ?? '',
          razaoSocial: perfil.razaoSocial ?? '',
          inscricaoEstadual: perfil.inscricaoEstadual ?? '',
          inscricaoMunicipal: perfil.inscricaoMunicipal ?? '',
          cep: perfil.cep ?? '',
          logradouro: perfil.logradouro ?? '',
          numero: perfil.numero ?? '',
          complemento: perfil.complemento ?? '',
          bairro: perfil.bairro ?? '',
          municipio: perfil.municipio ?? '',
          uf: perfil.uf ?? '',
        };

        if (perfil.uf) {
          this.municipioFilterService = `${environment.apiUrl}/geocode/municipios/${perfil.uf}`;
          this.municipioDisabled = false;
        }

        this.zone.run(() => {
          this.carregando = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.notif.error('Erro ao carregar onboarding.');
        this.router.navigate(['/portal/dashboard']);
      },
    });
  }

  get enderecoResumo() {
    const partes = [
      this.form.logradouro && this.form.numero ? `${this.form.logradouro}, ${this.form.numero}` : this.form.logradouro,
      this.form.complemento,
      this.form.bairro,
      this.form.municipio,
      this.form.uf,
      this.form.cep,
    ].filter(Boolean);
    return partes.join(' · ') || '—';
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

  buscarCep() {
    const cep = (this.form.cep ?? '').replace(/\D/g, '');
    if (cep.length !== 8) return;
    this.http.get<any>(`${environment.apiUrl}/portal/geocode/cep/${cep}`).subscribe({
      next: (d) => {
        if (!this.form.logradouro)  this.form.logradouro  = d.logradouro  ?? '';
        if (!this.form.complemento) this.form.complemento = d.complemento ?? '';
        if (!this.form.bairro)      this.form.bairro      = d.bairro      ?? '';
        if (!this.form.municipio)   this.form.municipio   = d.municipio   ?? '';
        if (!this.form.uf) {
          this.form.uf = d.ufSigla ?? '';
          this.onUfChange(d.ufSigla ?? '');
        }
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  buscarCnpj() {
    const cnpj = (this.form.cnpj ?? '').replace(/\D/g, '');
    if (cnpj.length !== 14) return;
    this.http.get<any>(`${environment.apiUrl}/portal/geocode/cnpj/${cnpj}`).subscribe({
      next: (d) => {
        if (!d) return;
        if (!this.form.razaoSocial) this.form.razaoSocial = d.razaoSocial ?? '';
        // Endereço — só preenche campos vazios
        if (!this.form.cep)         this.form.cep         = d.cep         ?? '';
        if (!this.form.logradouro)  this.form.logradouro  = d.logradouro  ?? '';
        if (!this.form.numero)      this.form.numero      = d.numero      ?? '';
        if (!this.form.complemento) this.form.complemento = d.complemento ?? '';
        if (!this.form.bairro)      this.form.bairro      = d.bairro      ?? '';
        if (!this.form.municipio)   this.form.municipio   = d.municipio   ?? '';
        if (!this.form.uf) {
          this.form.uf = d.uf ?? '';
          this.onUfChange(d.uf ?? '');
        }
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  precoPlano(plano: any): number {
    if (this.periodo === 'semestral') return Number(plano.precoSemestral) / 6;
    if (this.periodo === 'anual')     return Number(plano.precoAnual) / 12;
    return Number(plano.precoMensal);
  }

  selecionarPlano(plano: any) {
    this.planoSelecionado = plano;
    this.erro = '';
  }

  voltar() {
    this.stepAtual = Math.max(1, this.stepAtual - 1);
    this.erro = '';
  }

  avancar() {
    if (!this.validarStepAtual()) {
      return;
    }
    this.stepAtual = Math.min(4, this.stepAtual + 1);
    this.erro = '';
  }

  finalizar() {
    if (!this.validarTudo()) {
      return;
    }

    this.salvando = true;
    this.erro = '';

    const payload = {
      nome: this.form.nome,
      tipoPessoa: this.form.tipoPessoa,
      telefone: this.form.telefone,
      cpf: this.form.tipoPessoa === 'F' ? this.form.cpf : null,
      dataNascimento: this.form.tipoPessoa === 'F' ? this.form.dataNascimento : null,
      cnpj: this.form.tipoPessoa === 'J' ? this.form.cnpj : null,
      razaoSocial: this.form.tipoPessoa === 'J' ? this.form.razaoSocial : null,
      inscricaoEstadual: this.form.inscricaoEstadual || null,
      inscricaoMunicipal: this.form.inscricaoMunicipal || null,
      cep: this.form.cep,
      logradouro: this.form.logradouro,
      numero: this.form.numero,
      complemento: this.form.complemento || null,
      bairro: this.form.bairro,
      municipio: this.form.municipio,
      uf: this.form.uf,
      onboardingPendente: false,
    };

    this.clienteService.atualizarPerfil(payload).subscribe({
      next: () => this.finalizarPlano(),
      error: (err) => {
        this.salvando = false;
        this.erro = err?.error?.message ?? 'Erro ao salvar dados cadastrais.';
      },
    });
  }

  private finalizarPlano() {
    if (!this.planoSelecionado || this.planoSelecionado.slug === this.planoAtualSlug) {
      this.concluirWizard();
      return;
    }

    this.clienteService.assinar(this.planoSelecionado.slug).subscribe({
      next: () => this.concluirWizard(),
      error: (err) => {
        this.salvando = false;
        this.erro = err?.error?.message ?? 'Erro ao ativar plano.';
      },
    });
  }

  private concluirWizard() {
    this.salvando = false;
    this.notif.success('Cadastro concluído com sucesso.');
    // Reload completo para o portal-shell reler o perfil e montar o menu correto
    window.location.href = '/portal/dashboard';
  }

  private validarStepAtual() {
    switch (this.stepAtual) {
      case 1:
        if (!this.form.nome || !this.form.telefone || !this.form.tipoPessoa) {
          this.erro = 'Preencha nome, telefone e tipo de pessoa.';
          return false;
        }
        if (this.form.tipoPessoa === 'F' && (!this.form.cpf || !this.form.dataNascimento)) {
          this.erro = 'Preencha CPF e data de nascimento.';
          return false;
        }
        if (this.form.tipoPessoa === 'J' && (!this.form.cnpj || !this.form.razaoSocial)) {
          this.erro = 'Preencha CNPJ e razão social.';
          return false;
        }
        return true;
      case 2:
        if (!this.form.cep || !this.form.logradouro || !this.form.numero || !this.form.bairro || !this.form.municipio || !this.form.uf) {
          this.erro = 'Preencha todos os campos obrigatórios do endereço.';
          return false;
        }
        return true;
      case 3:
        if (!this.planoSelecionado) {
          this.erro = 'Selecione um plano para continuar.';
          return false;
        }
        return true;
      default:
        return true;
    }
  }

  private validarTudo() {
    const stepOriginal = this.stepAtual;
    for (const step of [1, 2, 3]) {
      this.stepAtual = step;
      if (!this.validarStepAtual()) {
        return false;
      }
    }
    this.stepAtual = stepOriginal;
    return true;
  }
}
