import { ConflictException, Injectable, Logger } from '@nestjs/common';
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

  private get downloadDir() { return process.env.ETL_DOWNLOAD_DIR ?? './etl-data/downloads'; }
  private get extrairDir()  { return process.env.ETL_EXTRACT_DIR  ?? './etl-data/extraidos'; }

  constructor(
    @InjectRepository(EtlLog) private logs: Repository<EtlLog>,
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

  async listarArquivos() {
    fs.mkdirSync(this.downloadDir, { recursive: true });
    fs.mkdirSync(this.extrairDir,  { recursive: true });

    return ARQUIVOS_RFB.map((arq) => {
      const zipPath = path.join(this.downloadDir, arq.nome);
      const csvBase = arq.nome.replace('.zip', '.csv');
      const csvPath = path.join(this.extrairDir, csvBase);

      const zipInfo  = this.fileInfo(zipPath);
      const csvInfo  = this.fileInfo(csvPath);

      return {
        nome: arq.nome,
        grupo: arq.grupo,
        tabela: arq.tabela,
        zip: zipInfo,
        csv: csvInfo,
        status: !zipInfo.existe ? 'nao_baixado'
              : !csvInfo.existe ? 'baixado'
              : 'extraido',
      };
    });
  }

  // ─── Execução assíncrona ───────────────────────────────────────────────────

  private async runAsync(log: EtlLog, fase: EtlFase) {
    try {
      fs.mkdirSync(this.downloadDir, { recursive: true });
      fs.mkdirSync(this.extrairDir,  { recursive: true });

      if (fase === 'completo' || fase === 'download') {
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
      if (fase === 'completo' || fase === 'extracao') {
        await this.faseExtracao(log);
      }
      if (fase === 'completo' || fase === 'carga') {
        await this.faseCarga(log);
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
      this.progresso = { fase: '', arquivoAtual: '', feitos: 0, total: 0, percentual: 0 };
    }
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
      await this.download(arq.nome, competencia);
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
      await this.download(`${pd.prefixo}0.zip`, competencia);

      // Partes 1..N — para no primeiro 404/403
      let parte = 1;
      while (true) {
        const nome = `${pd.prefixo}${parte}.zip`;
        const destPath = path.join(this.downloadDir, nome);
        if (fs.existsSync(destPath)) { parte++; continue; }
        const baixou = await this.downloadSemErro(nome, competencia);
        if (!baixou) break;
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
    this.progresso.total = ARQUIVOS_RFB.length;
    this.progresso.feitos = 0;

    for (const arq of ARQUIVOS_RFB) {
      const zipPath = path.join(this.downloadDir, arq.nome);
      if (!fs.existsSync(zipPath)) {
        this.logger.warn(`ZIP não encontrado para extração: ${arq.nome}`);
        this.progresso.feitos++;
        continue;
      }
      this.progresso.arquivoAtual = arq.nome;
      this.progresso.percentual = Math.round((this.progresso.feitos / this.progresso.total) * 100);
      await this.extrair(zipPath);
      this.progresso.feitos++;
    }
  }

  private async faseCarga(log: EtlLog) {
    log.status = 'carga';
    await this.logs.save(log);
    this.progresso.fase = 'Carga no banco';

    this.progresso.arquivoAtual = 'Tabelas de referência';
    await this.carregarLookups();

    const [totalEmp, totalEstab, totalSoc] = await Promise.all([
      this.carregarCsvParalelo('Empresas', 'empresas_rfb', this.colunasEmpresas()),
      this.carregarCsvParalelo('Estabelecimentos', 'estabelecimentos', this.colunasEstabelecimentos()),
      this.carregarCsvParalelo('Socios', 'socios', this.colunasSocios()),
    ]);

    this.progresso.arquivoAtual = 'Simples Nacional';
    await this.carregarSimples();

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
    this.logger.log(`Extração de ${nomeArquivo} concluída.`);
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

  private extrair(zipPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
        if (err) return reject(err);
        zipfile.readEntry();
        zipfile.on('entry', (entry) => {
          const dest = path.join(this.extrairDir, entry.fileName);
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

  private async carregarLookups() {
    const lookups = ARQUIVOS_RFB.filter((a) => a.grupo === 'lookup');
    for (const lk of lookups) {
      const csvPath = path.join(this.extrairDir, lk.nome.replace('.zip', '.csv'));
      if (!fs.existsSync(csvPath)) { this.logger.warn(`  Não encontrado: ${csvPath}`); continue; }
      await this.dataSource.query(`TRUNCATE TABLE ${lk.tabela} CASCADE`);
      this.progresso.arquivoAtual = lk.tabela;
      await this.carregarCsv(csvPath, lk.tabela, lk.colunas!);
    }
  }

  private async carregarSimples() {
    const colunas = ['cnpj_basico','opcao_pelo_simples','data_opcao_simples','data_exclusao_simples',
      'opcao_pelo_mei','data_opcao_mei','data_exclusao_mei'];
    await this.dataSource.query(`TRUNCATE TABLE simples CASCADE`);
    const csvPath = path.join(this.extrairDir, 'Simples.csv');
    if (fs.existsSync(csvPath)) await this.carregarCsv(csvPath, 'simples', colunas);
  }

  private async carregarCsvParalelo(prefixo: string, tabela: string, colunas: string[]): Promise<number> {
    await this.dataSource.query(`TRUNCATE TABLE ${tabela} CASCADE`);
    let total = 0;
    let idx = 0;
    while (true) {
      const csvPath = path.join(this.extrairDir, `${prefixo}${idx}.csv`);
      if (!fs.existsSync(csvPath)) break;
      this.progresso.arquivoAtual = `${tabela} — parte ${idx}`;
      this.logger.log(`  Carregando ${tabela} parte ${idx}...`);
      total += await this.carregarCsv(csvPath, tabela, colunas);
      idx++;
    }
    return total;
  }

  private async carregarCsv(csvPath: string, tabela: string, colunas: string[]): Promise<number> {
    const LOTE = 5000;
    const rl = readline.createInterface({
      input: fs.createReadStream(csvPath, { encoding: 'latin1' }),
      crlfDelay: Infinity,
    });
    let lote: string[][] = [];
    let total = 0;

    const flush = async () => {
      if (!lote.length) return;
      const placeholders = lote
        .map((row, ri) => `(${row.map((_, ci) => `$${ri * colunas.length + ci + 1}`).join(',')})`)
        .join(',');
      const flat = lote.flat().map((v) => (v === '' ? null : v.trim()));
      await this.dataSource.query(
        `INSERT INTO ${tabela} (${colunas.join(',')}) VALUES ${placeholders} ON CONFLICT DO NOTHING`,
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
