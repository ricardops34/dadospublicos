import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as yauzl from 'yauzl';
import * as readline from 'readline';
import { EtlLog, EtlFase } from '../../entities/etl-log.entity';

const RFB_BASE_URL = 'https://dadosabertos.rfb.gov.br/CNPJ/';

interface ArquivoRfb {
  grupo: 'lookup' | 'dados';
  nome: string;
  tabela: string;
  colunas?: string[];
  tipo?: string;
}

const ARQUIVOS_RFB: ArquivoRfb[] = [
  { grupo: 'lookup', nome: 'Cnaes.zip',            tabela: 'cnaes',               colunas: ['codigo', 'descricao'] },
  { grupo: 'lookup', nome: 'Naturezas.zip',         tabela: 'naturezas_juridicas', colunas: ['codigo', 'descricao'] },
  { grupo: 'lookup', nome: 'Qualificacoes.zip',     tabela: 'qualificacoes',       colunas: ['codigo', 'descricao'] },
  { grupo: 'lookup', nome: 'Motivos.zip',           tabela: 'motivos',             colunas: ['codigo', 'descricao'] },
  { grupo: 'lookup', nome: 'Municipios.zip',        tabela: 'municipios',          colunas: ['codigo_rfb', 'nome'] },
  { grupo: 'lookup', nome: 'Paises.zip',            tabela: 'paises',              colunas: ['codigo', 'nome'] },
  { grupo: 'dados',  nome: 'Empresas0.zip',         tabela: 'empresas_rfb',        tipo: 'empresa' },
  { grupo: 'dados',  nome: 'Estabelecimentos0.zip', tabela: 'estabelecimentos',    tipo: 'estabelecimento' },
  { grupo: 'dados',  nome: 'Socios0.zip',           tabela: 'socios',              tipo: 'socio' },
  { grupo: 'dados',  nome: 'Simples.zip',           tabela: 'simples',             tipo: 'simples' },
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
  ) {}

  // Cron: 1º dia do mês às 03:00
  @Cron('0 3 1 * *')
  async cargaMensal() {
    this.logger.log('ETL mensal iniciado pelo cron');
    await this.executar('completo');
  }

  // ─── Métodos públicos ──────────────────────────────────────────────────────

  async executar(fase: EtlFase = 'completo'): Promise<{ mensagem: string }> {
    if (this.rodando) return { mensagem: 'ETL já está em execução.' };
    this.rodando = true;

    const log = await this.logs.save(
      this.logs.create({ status: 'iniciado', fase, competencia: this.competenciaAtual() }),
    );

    this.runAsync(log, fase).catch(() => {});
    return { mensagem: `ETL [${fase}] iniciado em background. Acompanhe em GET /etl/status.` };
  }

  async status() {
    const logs = await this.logs.find({ order: { iniciadoEm: 'DESC' }, take: 10 });
    return {
      rodando: this.rodando,
      progresso: this.rodando ? this.progresso : null,
      historico: logs,
    };
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
        await this.faseDownload(log);
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

  private async faseDownload(log: EtlLog) {
    log.status = 'download';
    await this.logs.save(log);
    this.progresso.fase = 'Download';
    this.progresso.total = ARQUIVOS_RFB.length;
    this.progresso.feitos = 0;

    for (const arq of ARQUIVOS_RFB) {
      this.progresso.arquivoAtual = arq.nome;
      this.progresso.percentual = Math.round((this.progresso.feitos / this.progresso.total) * 100);
      await this.download(arq.nome);
      this.progresso.feitos++;
    }
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

  private download(arquivo: string): Promise<void> {
    const destPath = path.join(this.downloadDir, arquivo);
    if (fs.existsSync(destPath)) {
      this.logger.log(`  Já existe: ${arquivo}`);
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      this.logger.log(`  Baixando: ${arquivo}`);
      const file = fs.createWriteStream(destPath);
      https.get(`${RFB_BASE_URL}${arquivo}`, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} para ${arquivo}`));
          return;
        }
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      }).on('error', (err) => { fs.unlink(destPath, () => {}); reject(err); });
    });
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

  private competenciaAtual(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
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
