import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';
import * as yauzl from 'yauzl';
import * as readline from 'readline';
import * as tar from 'tar';
import axios from 'axios';
import { EtlLog, EtlFase } from '../../entities/etl-log.entity';
import { EtlArquivoLog, EtlArquivoOperacao } from '../../entities/etl-arquivo-log.entity';
import { ParametrosService } from '../parametros/parametros.service';
import { competenciaPadraoRfb } from './etl-competencia.util';

const RFB_DEFAULT_URL = 'https://arquivos.receitafederal.gov.br/index.php/s/YggdBLfdninEJX9';

interface ArquivoRfb {
  grupo: 'lookup' | 'dados';
  nome: string;
  tabela: string;
  colunas?: string[];
  tipo?: string;
}

interface PrefixoDados {
  prefixo: string;
  tabela: string;
  tipo: string;
}

// Classe 1 — arquivos únicos mensais (dentro da pasta de competência)
const ARQUIVOS_LOOKUP: ArquivoRfb[] = [
  { grupo: 'lookup', nome: 'Cnaes.zip',        tabela: 'cnaes',               colunas: ['codigo', 'descricao'] },
  { grupo: 'lookup', nome: 'Naturezas.zip',     tabela: 'naturezas_juridicas', colunas: ['codigo', 'descricao'] },
  { grupo: 'lookup', nome: 'Qualificacoes.zip', tabela: 'qualificacoes',       colunas: ['codigo', 'descricao'] },
  { grupo: 'lookup', nome: 'Motivos.zip',       tabela: 'motivos',             colunas: ['codigo', 'descricao'] },
  { grupo: 'lookup', nome: 'Municipios.zip',    tabela: 'municipios',          colunas: ['codigo_rfb', 'nome'] },
  { grupo: 'lookup', nome: 'Paises.zip',        tabela: 'paises',              colunas: ['codigo', 'nome'] },
  { grupo: 'lookup', nome: 'Simples.zip',       tabela: 'simples',             tipo: 'simples' },
];

// Classe 2 — arquivos particionados numéricos 0..N (dentro da pasta de competência)
const PREFIXOS_DADOS: PrefixoDados[] = [
  { prefixo: 'Empresas',         tabela: 'empresas_rfb',    tipo: 'empresa' },
  { prefixo: 'Estabelecimentos', tabela: 'estabelecimentos', tipo: 'estabelecimento' },
  { prefixo: 'Socios',           tabela: 'socios',          tipo: 'socio' },
];

// Chaves de negócio para UPSERT incremental (sem socios — usa truncate por partição)
const CONFLICT_COLS: Record<string, string[]> = {
  empresas_rfb:      ['cnpj_basico'],
  estabelecimentos:  ['cnpj_basico', 'cnpj_ordem', 'cnpj_dv'],
  simples:           ['cnpj_basico'],
  cnaes:             ['codigo'],
  naturezas_juridicas: ['codigo'],
  qualificacoes:     ['codigo'],
  motivos:           ['codigo'],
  municipios:        ['codigo_rfb'],
  paises:            ['codigo'],
};

// Classe 3 — cnpj.tar.gz fica na raiz do compartilhamento, sem pasta de competência

// Lista combinada para exibição (usa parte 0 como representante dos particionados)
const ARQUIVOS_RFB: ArquivoRfb[] = [
  ...ARQUIVOS_LOOKUP,
  { grupo: 'dados', nome: 'Empresas0.zip',         tabela: 'empresas_rfb',    tipo: 'empresa' },
  { grupo: 'dados', nome: 'Estabelecimentos0.zip', tabela: 'estabelecimentos', tipo: 'estabelecimento' },
  { grupo: 'dados', nome: 'Socios0.zip',           tabela: 'socios',          tipo: 'socio' },
];

export interface Progresso {
  fase: string;
  arquivoAtual: string;
  feitos: number;
  total: number;
  percentual: number;
}

@Injectable()
export class EtlService {
  private readonly logger = new Logger(EtlService.name);
  private rodando = false;
  private progresso: Progresso = { fase: '', arquivoAtual: '', feitos: 0, total: 0, percentual: 0 };
  private currentLogId: string | null = null;

  private get downloadDir() { return process.env.ETL_DOWNLOAD_DIR ?? './etl-data/downloads'; }
  private get extrairDir()  { return process.env.ETL_EXTRACT_DIR  ?? './etl-data/extraidos'; }

  constructor(
    @InjectRepository(EtlLog) private logs: Repository<EtlLog>,
    @InjectRepository(EtlArquivoLog) private arquivoLogs: Repository<EtlArquivoLog>,
    private dataSource: DataSource,
    private params: ParametrosService,
  ) {}

  // Cron: 1º dia do mês às 03:00
  @Cron('0 3 1 * *')
  async cargaMensal() {
    this.logger.log('ETL mensal iniciado pelo cron');
    await this.executar('completo');
  }

  // ─── Métodos públicos ──────────────────────────────────────────────────────

  async executar(fase: EtlFase = 'completo', competencia?: string): Promise<{ mensagem: string }> {
    if (this.rodando) return { mensagem: 'ETL já está em execução.' };
    this.rodando = true;

    const competenciaFinal = competencia ?? this.competenciaPadrao();
    const log = await this.logs.save(
      this.logs.create({ status: 'iniciado', fase, competencia: competenciaFinal }),
    );

    this.runAsync(log, fase).catch(() => {});
    return { mensagem: `ETL [${fase}] iniciado em background. Acompanhe em GET /etl/status.` };
  }

  async status(page = 1, pageSize = 10) {
    const pageSafe = Math.max(1, Number(page) || 1);
    const pageSizeSafe = Math.max(1, Math.min(100, Number(pageSize) || 10));
    const [logs, total] = await this.logs.findAndCount({
      order: { iniciadoEm: 'DESC' },
      take: pageSizeSafe,
      skip: (pageSafe - 1) * pageSizeSafe,
    });

    return {
      rodando: this.rodando,
      progresso: this.rodando ? this.progresso : null,
      historico: logs,
      page: pageSafe,
      pageSize: pageSizeSafe,
      total,
    };
  }

  async limparLogs() {
    if (this.rodando) {
      throw new ConflictException('Nao e possivel limpar os logs enquanto o ETL estiver em execucao.');
    }

    const totalAntes = await this.logs.count();
    await this.logs.clear();
    return { removidos: totalAntes };
  }

  async listarLogArquivos(page = 1, pageSize = 30) {
    const pageSafe = Math.max(1, Number(page) || 1);
    const pageSizeSafe = Math.max(1, Math.min(200, Number(pageSize) || 30));
    const [logs, total] = await this.arquivoLogs.findAndCount({
      order: { iniciadoEm: 'DESC' },
      take: pageSizeSafe,
      skip: (pageSafe - 1) * pageSizeSafe,
    });
    return { logs, page: pageSafe, pageSize: pageSizeSafe, total };
  }

  async limparLogArquivos() {
    if (this.rodando) {
      throw new ConflictException('Nao e possivel limpar logs enquanto o ETL estiver em execucao.');
    }
    const total = await this.arquivoLogs.count();
    await this.arquivoLogs.clear();
    return { removidos: total };
  }

  async listarArquivos() {
    fs.mkdirSync(this.downloadDir, { recursive: true });
    fs.mkdirSync(this.extrairDir,  { recursive: true });

    const itens: any[] = [];

    // ── 1. Base (cnpj.tar.gz) ──────────────────────────────────────────────
    const tarInfo = this.fileInfo(path.join(this.downloadDir, 'cnpj.tar.gz'));
    itens.push({
      nome: 'cnpj.tar.gz',
      grupo: 'base',
      tabela: '(carga inicial)',
      zip: tarInfo,
      csv: { existe: false, tamanhoMb: null, modificadoEm: null },
      status: tarInfo.existe ? 'baixado' : 'nao_baixado',
    });

    // ── 2. Tabelas de referência (arquivos únicos mensais) ─────────────────
    for (const arq of ARQUIVOS_LOOKUP) {
      const zipInfo = this.fileInfo(path.join(this.downloadDir, arq.nome));
      const csvInfo = this.fileInfo(path.join(this.extrairDir, arq.nome.replace('.zip', '.csv')));
      itens.push({
        nome: arq.nome,
        grupo: 'tabelas',
        tabela: arq.tabela,
        zip: zipInfo,
        csv: csvInfo,
        status: !zipInfo.existe ? 'nao_baixado' : !csvInfo.existe ? 'baixado' : 'extraido',
      });
    }

    // ── 3. Dados particionados — descobre partes existentes no disco ───────
    for (const pd of PREFIXOS_DADOS) {
      const partes = new Set<number>([0]); // parte 0 sempre visível

      const zipRe = new RegExp(`^${pd.prefixo}(\\d+)\\.zip$`, 'i');
      const csvRe = new RegExp(`^${pd.prefixo}(\\d+)\\.csv$`, 'i');

      for (const f of fs.readdirSync(this.downloadDir)) {
        const m = f.match(zipRe);
        if (m) partes.add(Number(m[1]));
      }
      for (const f of fs.readdirSync(this.extrairDir)) {
        const m = f.match(csvRe);
        if (m) partes.add(Number(m[1]));
      }

      for (const parte of [...partes].sort((a, b) => a - b)) {
        const zipInfo = this.fileInfo(path.join(this.downloadDir, `${pd.prefixo}${parte}.zip`));
        const csvInfo = this.fileInfo(path.join(this.extrairDir,  `${pd.prefixo}${parte}.csv`));
        itens.push({
          nome: `${pd.prefixo}${parte}.zip`,
          grupo: 'empresas',
          tabela: pd.tabela,
          zip: zipInfo,
          csv: csvInfo,
          status: !zipInfo.existe ? 'nao_baixado' : !csvInfo.existe ? 'baixado' : 'extraido',
        });
      }
    }

    return itens;
  }

  // ─── Execução assíncrona ───────────────────────────────────────────────────

  private async runAsync(log: EtlLog, fase: EtlFase) {
    this.currentLogId = log.id;
    try {
      fs.mkdirSync(this.downloadDir, { recursive: true });
      fs.mkdirSync(this.extrairDir,  { recursive: true });

      if (fase === 'completo') {
        const primeiraUso = await this.isPrimeiraUso();
        this.logger.log(`ETL completo — ${primeiraUso ? 'primeira carga (tar.gz)' : 'atualização mensal (ZIPs)'}`);
        if (primeiraUso) {
          await this.faseDownloadBase(log);
          await this.faseExtrairTarGz(log);              // tar.gz → ZIPs em extraidos/
          await this.faseExtrairZipsEmExtraidos(log);    // ZIPs em extraidos/ → CSVs
          await this.faseCarga(log, true);               // carga base → truncate + insert
          await this.faseExtracao(log);                  // ZIPs avulsos de downloads/ → CSVs (sobrescreve)
          await this.faseCarga(log, false);              // carga incremental → upsert
        } else {
          await this.faseDownloadTabelas(log);
          await this.faseDownloadEmpresas(log);
          await this.faseExtracao(log);
          await this.faseCarga(log, false);  // incremental → upsert, sem truncate
        }
      }
      if (fase === 'download') {
        await this.faseDownloadTabelas(log);
        await this.faseDownloadEmpresas(log);
      }
      if (fase === 'download-tabelas') {
        await this.faseDownloadTabelas(log);
      }
      if (fase === 'download-empresas') {
        await this.faseDownloadEmpresas(log);
      }
      if (fase === 'download-base') {
        await this.faseDownloadBase(log);
      }
      if (fase === 'extracao') {
        const tarPath = path.join(this.downloadDir, 'cnpj.tar.gz');
        if (fs.existsSync(tarPath)) {
          await this.faseExtrairTarGz(log);           // tar.gz → ZIPs em extraidos/
          await this.faseExtrairZipsEmExtraidos(log); // ZIPs em extraidos/ → CSVs (remove ZIPs)
        }
        await this.faseExtracao(log); // ZIPs avulsos em downloads/ → CSVs (Cnaes.zip, incrementais etc.)
      }
      if (fase === 'carga') {
        const truncar = await this.isPrimeiraUso();
        await this.faseCarga(log, truncar);
      }

      log.status = 'concluido';
      log.concluidoEm = new Date();
      await this.logs.save(log);
      this.logger.log(`ETL [${fase}] concluído.`);
    } catch (err) {
      log.status = 'erro';
      log.detalhe = String(err);
      log.concluidoEm = new Date();
      await this.logs.save(log);
      this.logger.error(`ETL [${fase}] FALHOU:`, err);
    } finally {
      this.rodando = false;
      this.currentLogId = null;
      this.progresso = { fase: '', arquivoAtual: '', feitos: 0, total: 0, percentual: 0 };
    }
  }

  /** Retorna true se a tabela empresas_rfb estiver vazia (primeira carga). */
  private async isPrimeiraUso(): Promise<boolean> {
    try {
      const [{ total }] = await this.dataSource.query(
        'SELECT COUNT(*)::int AS total FROM empresas_rfb',
      );
      return total === 0;
    } catch {
      return true; // tabela ainda não existe → primeira carga
    }
  }

  /**
   * Extrai os ZIPs que o tar.gz deixou em extrairDir, gerando os CSVs no mesmo diretório.
   * Após extração bem-sucedida de cada ZIP, remove o ZIP intermediário.
   */
  private async faseExtrairZipsEmExtraidos(log: EtlLog) {
    log.status = 'extracao';
    await this.logs.save(log);

    const zips = fs.readdirSync(this.extrairDir).filter((f) => /\.zip$/i.test(f));
    this.progresso.fase = 'Extraindo ZIPs em extraidos/';
    this.progresso.total = zips.length;
    this.progresso.feitos = 0;

    for (const nome of zips) {
      const zipPath = path.join(this.extrairDir, nome);
      this.progresso.arquivoAtual = nome;
      this.progresso.percentual = Math.round((this.progresso.feitos / this.progresso.total) * 100);

      const inicio = Date.now();
      const logEntry = await this.arquivoLogs.save(this.arquivoLogs.create({
        etlLogId: this.currentLogId, arquivo: nome, operacao: 'extracao', status: 'iniciando',
      }));
      try {
        await this.extrairParaDiretorio(zipPath, this.extrairDir);
        fs.unlinkSync(zipPath); // remove o ZIP intermediário
        const csvPath = path.join(this.extrairDir, nome.replace(/\.zip$/i, '.csv'));
        logEntry.status = 'concluido';
        logEntry.tamanhoMb = fs.existsSync(csvPath)
          ? +(fs.statSync(csvPath).size / 1024 / 1024).toFixed(1) : null;
        logEntry.duracaoMs = Date.now() - inicio;
        logEntry.concluidoEm = new Date();
      } catch (err) {
        logEntry.status = 'erro';
        logEntry.detalhe = String(err);
        logEntry.duracaoMs = Date.now() - inicio;
        logEntry.concluidoEm = new Date();
      }
      await this.arquivoLogs.save(logEntry);
      this.progresso.feitos++;
    }
  }

  /** Extrai cnpj.tar.gz do downloadDir para o extrairDir (usado na primeira carga). */
  private async faseExtrairTarGz(log: EtlLog) {
    log.status = 'extracao';
    await this.logs.save(log);
    this.progresso.fase = 'Extraindo cnpj.tar.gz';
    this.progresso.total = 1;
    this.progresso.feitos = 0;
    this.progresso.arquivoAtual = 'cnpj.tar.gz';
    this.progresso.percentual = 0;

    const tarPath = path.join(this.downloadDir, 'cnpj.tar.gz');
    if (!fs.existsSync(tarPath)) {
      throw new Error(
        `cnpj.tar.gz não encontrado em ${this.downloadDir}. Execute "Baixar base" primeiro.`,
      );
    }

    this.logger.log(`Extraindo cnpj.tar.gz → ${this.extrairDir}...`);
    await tar.x({ file: tarPath, cwd: this.extrairDir, strip: 1 });
    this.logger.log('Extração do cnpj.tar.gz concluída (ZIPs em extraidos/).');

    this.progresso.feitos = 1;
    this.progresso.percentual = 100;
  }

  /** Baixa tabelas de referência únicas mensais (Cnaes, Motivos, Municipios, Naturezas, Paises, Qualificacoes, Simples). */
  private async faseDownloadTabelas(log: EtlLog) {
    log.status = 'download';
    await this.logs.save(log);
    this.progresso.fase = 'Download Tabelas';
    this.progresso.total = ARQUIVOS_LOOKUP.length;
    this.progresso.feitos = 0;

    const competencia = log.competencia ?? this.competenciaPadrao();

    for (const arq of ARQUIVOS_LOOKUP) {
      this.progresso.arquivoAtual = arq.nome;
      this.progresso.percentual = Math.round((this.progresso.feitos / this.progresso.total) * 100);
      await this.downloadComLog(arq.nome, competencia);
      this.progresso.feitos++;
    }
  }

  /** Baixa arquivos particionados 0..N: Empresas, Estabelecimentos e Socios. */
  private async faseDownloadEmpresas(log: EtlLog) {
    log.status = 'download';
    await this.logs.save(log);
    this.progresso.fase = 'Download Empresas';
    this.progresso.total = PREFIXOS_DADOS.length;
    this.progresso.feitos = 0;

    const competencia = log.competencia ?? this.competenciaPadrao();

    for (const pd of PREFIXOS_DADOS) {
      this.progresso.arquivoAtual = `${pd.prefixo}*.zip`;
      this.progresso.percentual = Math.round((this.progresso.feitos / this.progresso.total) * 100);

      // Parte 0 é obrigatória — lança erro se não encontrada
      await this.downloadComLog(`${pd.prefixo}0.zip`, competencia);

      // Partes 1..N — para no primeiro 404/403
      let parte = 1;
      while (true) {
        const nome = `${pd.prefixo}${parte}.zip`;
        const destPath = path.join(this.downloadDir, nome);
        if (fs.existsSync(destPath)) { parte++; continue; }
        const inicio = Date.now();
        const baixou = await this.downloadSemErro(nome, competencia);
        if (!baixou) break;
        const tamanhoMb = fs.existsSync(destPath)
          ? +(fs.statSync(destPath).size / 1024 / 1024).toFixed(1) : null;
        this.arquivoLogs.save(this.arquivoLogs.create({
          etlLogId: this.currentLogId, arquivo: nome, operacao: 'download',
          status: 'concluido', competencia, tamanhoMb, duracaoMs: Date.now() - inicio,
          concluidoEm: new Date(),
        })).catch(() => {});
        parte++;
      }

      this.progresso.feitos++;
    }
  }

  /** Baixa cnpj.tar.gz da raiz do compartilhamento (sem pasta de competência). */
  private async faseDownloadBase(log: EtlLog) {
    log.status = 'download';
    await this.logs.save(log);
    this.progresso.fase = 'Download Base';
    this.progresso.total = 1;
    this.progresso.feitos = 0;
    this.progresso.arquivoAtual = 'cnpj.tar.gz';
    this.progresso.percentual = 0;

    await this.downloadRaiz('cnpj.tar.gz');

    this.progresso.feitos = 1;
    this.progresso.percentual = 100;
  }

  private async faseExtracao(log: EtlLog) {
    log.status = 'extracao';
    await this.logs.save(log);
    this.progresso.fase = 'Extração';
    this.progresso.feitos = 0;

    // Monta lista completa: lookups + todas as partes particionadas presentes no disco
    const zipsParaExtrair: string[] = ARQUIVOS_LOOKUP.map((a) => a.nome);
    for (const pd of PREFIXOS_DADOS) {
      const re = new RegExp(`^${pd.prefixo}(\\d+)\\.zip$`, 'i');
      for (const f of fs.readdirSync(this.downloadDir)) {
        if (re.test(f)) zipsParaExtrair.push(f);
      }
    }

    this.progresso.total = zipsParaExtrair.length;

    for (const nome of zipsParaExtrair) {
      const zipPath = path.join(this.downloadDir, nome);
      if (!fs.existsSync(zipPath)) {
        this.logger.warn(`ZIP não encontrado para extração: ${nome}`);
        this.progresso.feitos++;
        continue;
      }
      this.progresso.arquivoAtual = nome;
      this.progresso.percentual = Math.round((this.progresso.feitos / this.progresso.total) * 100);

      const inicio = Date.now();
      const logEntry = await this.arquivoLogs.save(this.arquivoLogs.create({
        etlLogId: this.currentLogId, arquivo: nome, operacao: 'extracao', status: 'iniciando',
      }));
      try {
        await this.extrair(zipPath);
        const csvPath = path.join(this.extrairDir, nome.replace(/\.zip$/i, '.csv'));
        logEntry.status = 'concluido';
        logEntry.tamanhoMb = fs.existsSync(csvPath)
          ? +(fs.statSync(csvPath).size / 1024 / 1024).toFixed(1) : null;
        logEntry.duracaoMs = Date.now() - inicio;
        logEntry.concluidoEm = new Date();
      } catch (err) {
        logEntry.status = 'erro';
        logEntry.detalhe = String(err);
        logEntry.duracaoMs = Date.now() - inicio;
        logEntry.concluidoEm = new Date();
      }
      await this.arquivoLogs.save(logEntry);

      this.progresso.feitos++;
    }
  }

  private async faseCarga(log: EtlLog, truncar: boolean) {
    log.status = 'carga';
    await this.logs.save(log);
    this.progresso.fase = 'Carga no banco';
    this.logger.log(`faseCarga — modo: ${truncar ? 'substituição (truncate+insert)' : 'incremental (upsert)'}`);

    this.progresso.arquivoAtual = 'Tabelas de referência';
    await this.carregarLookups(truncar);

    const [totalEmp, totalEstab, totalSoc] = await Promise.all([
      this.carregarCsvParalelo('Empresas',         'empresas_rfb',    this.colunasEmpresas(),         truncar),
      this.carregarCsvParalelo('Estabelecimentos', 'estabelecimentos', this.colunasEstabelecimentos(), truncar),
      this.carregarCsvParalelo('Socios',           'socios',          this.colunasSocios(),           true),   // socios sempre truncate
    ]);

    this.progresso.arquivoAtual = 'Simples Nacional';
    await this.carregarSimples(truncar);

    log.totalEmpresas = totalEmp;
    log.totalEstabelecimentos = totalEstab;
    log.totalSocios = totalSoc;
    await this.logs.save(log);
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  /** Baixa um arquivo da raiz do compartilhamento (sem pasta de competência). */
  private async downloadRaiz(arquivo: string): Promise<void> {
    const destPath = path.join(this.downloadDir, arquivo);
    if (fs.existsSync(destPath)) {
      this.logger.log(`  Já existe: ${arquivo}`);
      return;
    }

    const baseUrl = await this.params.getValor('RFB_DOWNLOAD_BASE_URL', RFB_DEFAULT_URL);
    const { url, headers } = this.buildDownloadConfigRaiz(baseUrl, arquivo);
    this.logger.log(`  Baixando (raiz): ${arquivo} → ${url}`);

    const response = await axios.get(url, {
      responseType: 'stream',
      maxRedirects: 5,
      timeout: 0,
      headers: { 'User-Agent': 'BuscaDados-ETL/1.0', ...headers },
    });

    await new Promise<void>((resolve, reject) => {
      const file = fs.createWriteStream(destPath);
      response.data.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', (err) => { fs.unlink(destPath, () => {}); reject(err); });
      response.data.on('error', (err: Error) => { fs.unlink(destPath, () => {}); reject(err); });
    });
  }

  private async download(arquivo: string, competencia: string): Promise<void> {
    const destPath = path.join(this.downloadDir, arquivo);
    if (fs.existsSync(destPath)) {
      this.logger.log(`  Já existe: ${arquivo}`);
      return;
    }

    const baseUrl = await this.params.getValor('RFB_DOWNLOAD_BASE_URL', RFB_DEFAULT_URL);
    const { url, headers } = this.buildDownloadConfig(baseUrl, arquivo, competencia);
    this.logger.log(`  Baixando: ${arquivo} (${competencia}) → ${url}`);

    const response = await axios.get(url, {
      responseType: 'stream',
      maxRedirects: 5,
      timeout: 0,
      headers: { 'User-Agent': 'BuscaDados-ETL/1.0', ...headers },
    });

    await new Promise<void>((resolve, reject) => {
      const file = fs.createWriteStream(destPath);
      response.data.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', (err) => { fs.unlink(destPath, () => {}); reject(err); });
      response.data.on('error', (err: Error) => { fs.unlink(destPath, () => {}); reject(err); });
    });
  }

  /** Baixa com log de início/conclusão/erro na tabela etl_arquivo_logs. */
  private async downloadComLog(arquivo: string, competencia: string): Promise<void> {
    const destPath = path.join(this.downloadDir, arquivo);
    if (fs.existsSync(destPath)) {
      await this.arquivoLogs.save(this.arquivoLogs.create({
        etlLogId: this.currentLogId, arquivo, operacao: 'download',
        status: 'ja_existe', competencia, concluidoEm: new Date(),
      }));
      return;
    }

    const inicio = Date.now();
    const logEntry = await this.arquivoLogs.save(this.arquivoLogs.create({
      etlLogId: this.currentLogId, arquivo, operacao: 'download',
      status: 'iniciando', competencia,
    }));
    try {
      await this.download(arquivo, competencia);
      logEntry.status = 'concluido';
      logEntry.tamanhoMb = +(fs.statSync(destPath).size / 1024 / 1024).toFixed(1);
      logEntry.duracaoMs = Date.now() - inicio;
      logEntry.concluidoEm = new Date();
    } catch (err) {
      logEntry.status = 'erro';
      logEntry.detalhe = String(err);
      logEntry.duracaoMs = Date.now() - inicio;
      logEntry.concluidoEm = new Date();
      throw err;
    } finally {
      await this.arquivoLogs.save(logEntry);
    }
  }

  /** Tenta baixar um arquivo; retorna false silenciosamente se não existir (404/403). */
  private async downloadSemErro(arquivo: string, competencia: string): Promise<boolean> {
    try {
      await this.download(arquivo, competencia);
      return true;
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404 || status === 403) return false;
      throw err;
    }
  }

  async apagarZipArquivo(nome: string): Promise<{ apagados: string[] }> {
    if (!/^[A-Za-z0-9_.-]+\.(zip|tar\.gz)$/i.test(nome)) throw new BadRequestException('Nome de arquivo inválido.');
    const zipPath = path.join(this.downloadDir, nome);
    const apagados: string[] = [];
    if (fs.existsSync(zipPath)) { fs.unlinkSync(zipPath); apagados.push(nome); }
    return { apagados };
  }

  async apagarTodosCsvs(): Promise<{ apagados: number }> {
    fs.mkdirSync(this.extrairDir, { recursive: true });
    const csvs = fs.readdirSync(this.extrairDir).filter((f) => /\.csv$/i.test(f));
    for (const f of csvs) fs.unlinkSync(path.join(this.extrairDir, f));
    return { apagados: csvs.length };
  }

  async limparExtraidos(): Promise<{ apagados: number }> {
    if (this.rodando) throw new ConflictException('Nao e possivel limpar enquanto o ETL estiver em execucao.');
    fs.mkdirSync(this.extrairDir, { recursive: true });
    const arquivos = fs.readdirSync(this.extrairDir).filter((f) => fs.statSync(path.join(this.extrairDir, f)).isFile());
    for (const f of arquivos) fs.unlinkSync(path.join(this.extrairDir, f));
    return { apagados: arquivos.length };
  }

  async apagarCsvArquivo(nome: string): Promise<{ apagados: string[] }> {
    if (!/^[A-Za-z0-9_-]+\.zip$/i.test(nome)) throw new BadRequestException('Nome de arquivo inválido.');
    const csvPath = path.join(this.extrairDir, nome.replace(/\.zip$/i, '.csv'));
    const apagados: string[] = [];
    if (fs.existsSync(csvPath)) {
      fs.unlinkSync(csvPath);
      apagados.push(nome.replace(/\.zip$/i, '.csv'));
    }
    return { apagados };
  }

  async apagarArquivo(nome: string): Promise<{ apagados: string[] }> {
    if (!/^[A-Za-z0-9_-]+\.zip$/i.test(nome)) {
      throw new Error('Nome de arquivo inválido.');
    }
    const apagados: string[] = [];
    const zipPath = path.join(this.downloadDir, nome);
    const csvPath = path.join(this.extrairDir, nome.replace(/\.zip$/i, '.csv'));
    if (fs.existsSync(zipPath)) { fs.unlinkSync(zipPath); apagados.push(nome); }
    if (fs.existsSync(csvPath)) { fs.unlinkSync(csvPath); apagados.push(nome.replace(/\.zip$/i, '.csv')); }
    return { apagados };
  }

  async extrairArquivoUnico(nome: string): Promise<{ mensagem: string }> {
    if (!/^[A-Za-z0-9_.-]+\.(zip|tar\.gz)$/i.test(nome)) throw new BadRequestException('Nome de arquivo inválido.');
    const filePath = path.join(this.downloadDir, nome);
    this.logger.log(`extrairArquivoUnico: verificando ${filePath}`);
    if (!fs.existsSync(filePath)) throw new NotFoundException(`Arquivo não encontrado: ${filePath}`);

    if (/\.tar\.gz$/i.test(nome)) {
      const inicio = Date.now();
      const logEntry = await this.arquivoLogs.save(this.arquivoLogs.create({
        etlLogId: null, arquivo: nome, operacao: 'extracao' as EtlArquivoOperacao, status: 'iniciando',
      }));
      try {
        fs.mkdirSync(this.extrairDir, { recursive: true });
        this.logger.log(`Extraindo ${nome} → ${this.extrairDir}...`);
        await tar.x({ file: filePath, cwd: this.extrairDir, strip: 1 });
        this.logger.log(`Extração de ${nome} concluída (ZIPs em extraidos/).`);
        logEntry.status = 'concluido';
        logEntry.tamanhoMb = +(fs.statSync(filePath).size / 1024 / 1024).toFixed(1);
        logEntry.duracaoMs = Date.now() - inicio;
        logEntry.concluidoEm = new Date();
      } catch (err) {
        logEntry.status = 'erro';
        logEntry.detalhe = String(err);
        logEntry.duracaoMs = Date.now() - inicio;
        logEntry.concluidoEm = new Date();
        await this.arquivoLogs.save(logEntry);
        throw err;
      }
      await this.arquivoLogs.save(logEntry);
      return { mensagem: `${nome} extraído com sucesso.` };
    }

    this.extrairComLog(nome, filePath).catch((err) =>
      this.logger.error(`Erro ao extrair ${nome}:`, err),
    );
    return { mensagem: `Extração de ${nome} iniciada em background.` };
  }

  async processarArquivoUnico(nome: string): Promise<{ mensagem: string }> {
    if (!/^[A-Za-z0-9_-]+\.zip$/i.test(nome)) throw new BadRequestException('Nome de arquivo inválido.');
    const csvNome = nome.replace(/\.zip$/i, '.csv');
    const csvPath = path.join(this.extrairDir, csvNome);
    this.logger.log(`processarArquivoUnico: verificando ${csvPath}`);
    if (!fs.existsSync(csvPath)) throw new NotFoundException(`CSV não encontrado: ${csvPath}. Execute a extração primeiro.`);
    const { tabela, colunas } = this.resolverTabelaColunas(nome);
    if (!tabela || !colunas.length) throw new BadRequestException(`Arquivo não reconhecido para carga: ${nome}`);
    this.processarComLog(nome, csvPath, tabela, colunas).catch((err) =>
      this.logger.error(`Erro ao processar ${nome}:`, err),
    );
    return { mensagem: `Carga de ${nome} iniciada em background.` };
  }

  async baixarArquivoUnico(nome: string, competencia: string): Promise<{ mensagem: string }> {
    if (!/^[A-Za-z0-9_-]+\.zip$/i.test(nome)) {
      throw new Error('Nome de arquivo inválido.');
    }
    const destPath = path.join(this.downloadDir, nome);
    if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
    // Fire-and-forget com log (etlLogId null = operação avulsa)
    this.downloadComLog(nome, competencia).catch((err) =>
      this.logger.error(`Erro ao baixar ${nome}:`, err),
    );
    return { mensagem: `Download de ${nome} iniciado em background.` };
  }

  /**
   * Extrai um cnpj.tar.gz (ou qualquer .tar.gz) colocado no downloadDir.
   * Os arquivos são extraídos diretamente no extrairDir.
   * Útil para carregar o dump consolidado sem precisar baixar parte a parte.
   */
  async extrairTarGz(nomeArquivo = 'cnpj.tar.gz'): Promise<{ mensagem: string }> {
    const tarPath = path.join(this.downloadDir, nomeArquivo);
    if (!fs.existsSync(tarPath)) {
      throw new Error(`Arquivo não encontrado: ${tarPath}. Coloque o .tar.gz em ${this.downloadDir}.`);
    }
    fs.mkdirSync(this.extrairDir, { recursive: true });
    this.logger.log(`Extraindo ${nomeArquivo} para ${this.extrairDir}...`);
    await tar.x({ file: tarPath, cwd: this.extrairDir, strip: 1 });
    this.logger.log(`Extração de ${nomeArquivo} concluída (ZIPs em extraidos/).`);
    return { mensagem: `${nomeArquivo} extraído. Execute fase=carga para carregar no banco.` };
  }

  /**
   * Nextcloud (SERPRO) usa WebDAV com Basic auth (token da share : senha vazia).
   * URL: https://host/public.php/dav/files/{token}/{competencia}/{arquivo}
   * Auth: Basic base64("{token}:")
   *
   * URL direta (padrão antigo): {baseUrl}/{competencia}/{arquivo}
   */
  private buildDownloadConfig(baseUrl: string, arquivo: string, competencia: string): {
    url: string;
    headers: Record<string, string>;
  } {
    const clean = baseUrl.replace(/\/+$/, '');

    if (clean.includes('/index.php/s/')) {
      // Extrai token da URL: https://host/index.php/s/{token}
      const token = clean.split('/index.php/s/')[1]?.split('/')[0] ?? '';
      const host  = clean.split('/index.php/s/')[0];

      const url = `${host}/public.php/dav/files/${token}/${competencia}/${encodeURIComponent(arquivo)}`;
      const auth = Buffer.from(`${token}:`).toString('base64');

      return { url, headers: { Authorization: `Basic ${auth}` } };
    }

    // URL direta — concatena pasta de competência e arquivo
    return { url: `${clean}/${competencia}/${arquivo}`, headers: {} };
  }

  /** Constrói URL para arquivos na raiz do compartilhamento (sem pasta de competência). */
  private buildDownloadConfigRaiz(baseUrl: string, arquivo: string): {
    url: string;
    headers: Record<string, string>;
  } {
    const clean = baseUrl.replace(/\/+$/, '');

    if (clean.includes('/index.php/s/')) {
      const token = clean.split('/index.php/s/')[1]?.split('/')[0] ?? '';
      const host  = clean.split('/index.php/s/')[0];
      const url = `${host}/public.php/dav/files/${token}/${encodeURIComponent(arquivo)}`;
      const auth = Buffer.from(`${token}:`).toString('base64');
      return { url, headers: { Authorization: `Basic ${auth}` } };
    }

    return { url: `${clean}/${arquivo}`, headers: {} };
  }

  private async extrairComLog(nome: string, zipPath: string): Promise<void> {
    const inicio = Date.now();
    const logEntry = await this.arquivoLogs.save(this.arquivoLogs.create({
      etlLogId: null, arquivo: nome, operacao: 'extracao' as EtlArquivoOperacao, status: 'iniciando',
    }));
    try {
      await this.extrair(zipPath);
      const csvPath = path.join(this.extrairDir, nome.replace(/\.zip$/i, '.csv'));
      logEntry.status = 'concluido';
      logEntry.tamanhoMb = fs.existsSync(csvPath)
        ? +(fs.statSync(csvPath).size / 1024 / 1024).toFixed(1) : null;
      logEntry.duracaoMs = Date.now() - inicio;
      logEntry.concluidoEm = new Date();
    } catch (err) {
      logEntry.status = 'erro';
      logEntry.detalhe = String(err);
      logEntry.duracaoMs = Date.now() - inicio;
      logEntry.concluidoEm = new Date();
    }
    await this.arquivoLogs.save(logEntry);
  }

  private async processarComLog(nome: string, csvPath: string, tabela: string, colunas: string[]): Promise<void> {
    const inicio = Date.now();
    const logEntry = await this.arquivoLogs.save(this.arquivoLogs.create({
      etlLogId: null, arquivo: nome, operacao: 'carga' as EtlArquivoOperacao, status: 'iniciando',
    }));
    try {
      const count = await this.carregarCsv(csvPath, tabela, colunas, CONFLICT_COLS[tabela]);
      logEntry.status = 'concluido';
      logEntry.tamanhoMb = +(fs.statSync(csvPath).size / 1024 / 1024).toFixed(1);
      logEntry.duracaoMs = Date.now() - inicio;
      logEntry.detalhe = `${count.toLocaleString('pt-BR')} registros → ${tabela}`;
      logEntry.concluidoEm = new Date();
    } catch (err) {
      logEntry.status = 'erro';
      logEntry.detalhe = String(err);
      logEntry.duracaoMs = Date.now() - inicio;
      logEntry.concluidoEm = new Date();
    }
    await this.arquivoLogs.save(logEntry);
  }

  private resolverTabelaColunas(nome: string): { tabela: string; colunas: string[] } {
    const lookup = ARQUIVOS_LOOKUP.find((a) => a.nome.toLowerCase() === nome.toLowerCase());
    if (lookup) {
      if (lookup.tipo === 'simples') {
        return {
          tabela: 'simples',
          colunas: ['cnpj_basico','opcao_pelo_simples','data_opcao_simples','data_exclusao_simples',
            'opcao_pelo_mei','data_opcao_mei','data_exclusao_mei'],
        };
      }
      return { tabela: lookup.tabela, colunas: lookup.colunas ?? [] };
    }
    const colunasMap: Record<string, string[]> = {
      empresas_rfb:    this.colunasEmpresas(),
      estabelecimentos: this.colunasEstabelecimentos(),
      socios:          this.colunasSocios(),
    };
    for (const pd of PREFIXOS_DADOS) {
      if (new RegExp(`^${pd.prefixo}\\d+\\.zip$`, 'i').test(nome)) {
        return { tabela: pd.tabela, colunas: colunasMap[pd.tabela] ?? [] };
      }
    }
    return { tabela: '', colunas: [] };
  }

  private extrair(zipPath: string): Promise<void> {
    return this.extrairParaDiretorio(zipPath, this.extrairDir);
  }

  private extrairParaDiretorio(zipPath: string, destDir: string): Promise<void> {
    return new Promise((resolve, reject) => {
      yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
        if (err) return reject(err);
        zipfile.readEntry();
        zipfile.on('entry', (entry) => {
          const dest = path.join(destDir, entry.fileName);
          if (/\/$/.test(entry.fileName)) {
            fs.mkdirSync(dest, { recursive: true });
            zipfile.readEntry();
            return;
          }
          zipfile.openReadStream(entry, (err2, rs) => {
            if (err2) return reject(err2);
            rs.pipe(fs.createWriteStream(dest)).on('finish', () => zipfile.readEntry());
          });
        });
        zipfile.on('end', resolve);
        zipfile.on('error', reject);
      });
    });
  }

  private async carregarLookups(truncar: boolean) {
    const lookups = ARQUIVOS_RFB.filter((a) => a.grupo === 'lookup' && a.colunas?.length);
    for (const lk of lookups) {
      const csvPath = path.join(this.extrairDir, lk.nome.replace('.zip', '.csv'));
      if (!fs.existsSync(csvPath)) { this.logger.warn(`  Não encontrado: ${csvPath}`); continue; }
      if (truncar) await this.dataSource.query(`TRUNCATE TABLE ${lk.tabela} CASCADE`);
      this.progresso.arquivoAtual = lk.tabela;
      await this.carregarCsv(csvPath, lk.tabela, lk.colunas!, truncar ? undefined : CONFLICT_COLS[lk.tabela]);
    }
  }

  private async carregarSimples(truncar: boolean) {
    const colunas = ['cnpj_basico','opcao_pelo_simples','data_opcao_simples','data_exclusao_simples',
      'opcao_pelo_mei','data_opcao_mei','data_exclusao_mei'];
    if (truncar) await this.dataSource.query(`TRUNCATE TABLE simples CASCADE`);
    const csvPath = path.join(this.extrairDir, 'Simples.csv');
    if (fs.existsSync(csvPath)) await this.carregarCsv(csvPath, 'simples', colunas, truncar ? undefined : CONFLICT_COLS['simples']);
  }

  private async carregarCsvParalelo(prefixo: string, tabela: string, colunas: string[], truncar: boolean): Promise<number> {
    if (truncar) await this.dataSource.query(`TRUNCATE TABLE ${tabela} CASCADE`);
    const conflitoCols = truncar ? undefined : CONFLICT_COLS[tabela];
    let total = 0;
    let idx = 0;
    while (true) {
      const arquivo = `${prefixo}${idx}.csv`;
      const csvPath = path.join(this.extrairDir, arquivo);
      if (!fs.existsSync(csvPath)) break;
      this.progresso.arquivoAtual = `${tabela} — parte ${idx}`;
      this.logger.log(`  Carregando ${tabela} parte ${idx} (${truncar ? 'insert' : 'upsert'})...`);

      const inicio = Date.now();
      const logEntry = await this.arquivoLogs.save(this.arquivoLogs.create({
        etlLogId: this.currentLogId, arquivo, operacao: 'carga', status: 'iniciando',
      }));
      const count = await this.carregarCsv(csvPath, tabela, colunas, conflitoCols);
      logEntry.status = 'concluido';
      logEntry.tamanhoMb = +(fs.statSync(csvPath).size / 1024 / 1024).toFixed(1);
      logEntry.duracaoMs = Date.now() - inicio;
      logEntry.detalhe = `${count.toLocaleString('pt-BR')} registros → ${tabela}`;
      logEntry.concluidoEm = new Date();
      await this.arquivoLogs.save(logEntry);

      total += count;
      idx++;
    }
    return total;
  }

  // conflitoCols=undefined → INSERT ON CONFLICT DO NOTHING
  // conflitoCols=[...] → INSERT ON CONFLICT (...) DO UPDATE SET (upsert)
  private async carregarCsv(csvPath: string, tabela: string, colunas: string[], conflitoCols?: string[]): Promise<number> {
    const LOTE = 5000;
    const rl = readline.createInterface({
      input: fs.createReadStream(csvPath, { encoding: 'latin1' }),
      crlfDelay: Infinity,
    });
    let lote: string[][] = [];
    let total = 0;

    const colsUpdate = conflitoCols
      ? colunas.filter((c) => !conflitoCols.includes(c)).map((c) => `${c}=EXCLUDED.${c}`).join(',')
      : null;

    const flush = async () => {
      if (!lote.length) return;
      const placeholders = lote
        .map((row, ri) => `(${row.map((_, ci) => `$${ri * colunas.length + ci + 1}`).join(',')})`)
        .join(',');
      const flat = lote.flat().map((v) => (v === '' ? null : v.trim()));
      const conflito = conflitoCols && colsUpdate
        ? `ON CONFLICT (${conflitoCols.join(',')}) DO UPDATE SET ${colsUpdate}`
        : 'ON CONFLICT DO NOTHING';
      await this.dataSource.query(
        `INSERT INTO ${tabela} (${colunas.join(',')}) VALUES ${placeholders} ${conflito}`,
        flat,
      );
      total += lote.length;
      lote = [];
    };

    for await (const line of rl) {
      if (!line.trim()) continue;
      lote.push(line.split(';').map((v) => v.replace(/^"|"$/g, '').trim()));
      if (lote.length >= LOTE) await flush();
    }
    await flush();
    return total;
  }

  private fileInfo(filePath: string) {
    if (!fs.existsSync(filePath)) return { existe: false, tamanhoMb: null, modificadoEm: null };
    const stat = fs.statSync(filePath);
    return {
      existe: true,
      tamanhoMb: +(stat.size / 1024 / 1024).toFixed(1),
      modificadoEm: stat.mtime.toISOString(),
    };
  }

  private competenciaPadrao(): string {
    return competenciaPadraoRfb();
  }

  private colunasEmpresas() {
    return ['cnpj_basico','razao_social','natureza_juridica','qualificacao_responsavel',
      'capital_social','porte_empresa','ente_federativo'];
  }

  private colunasEstabelecimentos() {
    return ['cnpj_basico','cnpj_ordem','cnpj_dv','identificador_matriz_filial','nome_fantasia',
      'situacao_cadastral','data_situacao_cadastral','motivo_situacao_cadastral','nome_cidade_exterior','pais',
      'data_inicio_atividade','cnae_fiscal_principal','cnae_fiscal_secundaria','tipo_logradouro','logradouro',
      'numero','complemento','bairro','cep','uf','municipio','ddd1','telefone1','ddd2','telefone2',
      'ddd_fax','fax','email','situacao_especial','data_situacao_especial'];
  }

  private colunasSocios() {
    return ['cnpj_basico','identificador_socio','nome_socio','cnpj_cpf_socio','qualificacao_socio',
      'data_entrada_sociedade','pais','representante_legal','nome_representante',
      'qualificacao_representante','faixa_etaria'];
  }
}
