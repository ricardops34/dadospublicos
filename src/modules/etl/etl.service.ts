import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as yauzl from 'yauzl';
import * as readline from 'readline';
import { EtlLog } from '../../entities/etl-log.entity';

// URLs base dos arquivos da RFB (atualizadas mensalmente)
const RFB_BASE_URL = 'https://dadosabertos.rfb.gov.br/CNPJ/';

const ARQUIVOS_RFB = [
  { grupo: 'lookup', nome: 'Cnaes.zip',         tabela: 'cnaes',              colunas: ['codigo', 'descricao'] },
  { grupo: 'lookup', nome: 'Naturezas.zip',      tabela: 'naturezas_juridicas', colunas: ['codigo', 'descricao'] },
  { grupo: 'lookup', nome: 'Qualificacoes.zip',  tabela: 'qualificacoes',      colunas: ['codigo', 'descricao'] },
  { grupo: 'lookup', nome: 'Motivos.zip',        tabela: 'motivos',            colunas: ['codigo', 'descricao'] },
  { grupo: 'lookup', nome: 'Municipios.zip',     tabela: 'municipios',         colunas: ['codigo_rfb', 'nome'] },
  { grupo: 'lookup', nome: 'Paises.zip',         tabela: 'paises',             colunas: ['codigo', 'nome'] },
  { grupo: 'dados',  nome: 'Empresas0.zip',      tabela: 'empresas_rfb',       tipo: 'empresa' },
  { grupo: 'dados',  nome: 'Estabelecimentos0.zip', tabela: 'estabelecimentos', tipo: 'estabelecimento' },
  { grupo: 'dados',  nome: 'Socios0.zip',        tabela: 'socios',             tipo: 'socio' },
  { grupo: 'dados',  nome: 'Simples.zip',        tabela: 'simples',            tipo: 'simples' },
];

@Injectable()
export class EtlService {
  private readonly logger = new Logger(EtlService.name);
  private rodando = false;

  constructor(
    @InjectRepository(EtlLog) private logs: Repository<EtlLog>,
    private dataSource: DataSource,
  ) {}

  // Executa no 1º dia de cada mês às 03:00
  @Cron('0 3 1 * *')
  async cargaMensal() {
    this.logger.log('ETL mensal iniciado pelo cron');
    await this.executar();
  }

  async executar(forcar = false): Promise<EtlLog> {
    if (this.rodando && !forcar) {
      this.logger.warn('ETL já está em execução.');
      return;
    }
    this.rodando = true;

    const log = await this.logs.save(this.logs.create({ status: 'iniciado', competencia: this.competenciaAtual() }));

    try {
      const downloadDir = process.env.ETL_DOWNLOAD_DIR ?? './etl-data/downloads';
      const extrairDir  = process.env.ETL_EXTRACT_DIR  ?? './etl-data/extraidos';
      fs.mkdirSync(downloadDir, { recursive: true });
      fs.mkdirSync(extrairDir, { recursive: true });

      // Fase 1 — Download
      log.status = 'download';
      await this.logs.save(log);
      this.logger.log('Fase 1: Download dos arquivos RFB...');
      for (const arq of ARQUIVOS_RFB) {
        await this.download(arq.nome, downloadDir);
      }

      // Fase 2 — Extração
      log.status = 'extracao';
      await this.logs.save(log);
      this.logger.log('Fase 2: Extraindo ZIPs...');
      for (const arq of ARQUIVOS_RFB) {
        await this.extrair(path.join(downloadDir, arq.nome), extrairDir);
      }

      // Fase 3 — Carga
      log.status = 'carga';
      await this.logs.save(log);
      this.logger.log('Fase 3: Carregando banco de dados...');
      await this.carregarLookups(extrairDir);
      const [totalEmp, totalEstab, totalSoc] = await Promise.all([
        this.carregarEmpresas(extrairDir),
        this.carregarEstabelecimentos(extrairDir),
        this.carregarSocios(extrairDir),
      ]);
      await this.carregarSimples(extrairDir);

      log.status = 'concluido';
      log.totalEmpresas = totalEmp;
      log.totalEstabelecimentos = totalEstab;
      log.totalSocios = totalSoc;
      log.concluidoEm = new Date();
      await this.logs.save(log);
      this.logger.log(`ETL concluído — empresas: ${totalEmp} | estab: ${totalEstab} | sócios: ${totalSoc}`);

    } catch (err) {
      log.status = 'erro';
      log.detalhe = String(err);
      log.concluidoEm = new Date();
      await this.logs.save(log);
      this.logger.error('ETL FALHOU:', err);
    } finally {
      this.rodando = false;
    }
    return log;
  }

  private competenciaAtual(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  private download(arquivo: string, destDir: string): Promise<void> {
    const destPath = path.join(destDir, arquivo);
    if (fs.existsSync(destPath)) {
      this.logger.log(`  Já existe: ${arquivo}`);
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      this.logger.log(`  Baixando: ${arquivo}`);
      const file = fs.createWriteStream(destPath);
      https.get(`${RFB_BASE_URL}${arquivo}`, res => {
        if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode} para ${arquivo}`)); return; }
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      }).on('error', err => { fs.unlink(destPath, () => {}); reject(err); });
    });
  }

  private extrair(zipPath: string, destDir: string): Promise<void> {
    return new Promise((resolve, reject) => {
      yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
        if (err) return reject(err);
        zipfile.readEntry();
        zipfile.on('entry', entry => {
          const dest = path.join(destDir, entry.fileName);
          if (/\/$/.test(entry.fileName)) { fs.mkdirSync(dest, { recursive: true }); zipfile.readEntry(); return; }
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

  private async carregarLookups(dir: string) {
    const lookups = ARQUIVOS_RFB.filter(a => a.grupo === 'lookup');
    for (const lk of lookups) {
      const csvPath = path.join(dir, lk.nome.replace('.zip', '.csv'));
      if (!fs.existsSync(csvPath)) { this.logger.warn(`  Arquivo não encontrado: ${csvPath}`); continue; }
      await this.dataSource.query(`TRUNCATE TABLE ${lk.tabela} CASCADE`);
      this.logger.log(`  Carregando ${lk.tabela}...`);
      await this.carregarCsv(csvPath, lk.tabela, lk.colunas);
    }
  }

  private async carregarEmpresas(dir: string): Promise<number> {
    const colunas = ['cnpj_basico','razao_social','natureza_juridica','qualificacao_responsavel','capital_social','porte_empresa','ente_federativo'];
    return this.carregarCsvParalelo(dir, 'Empresas', 'empresas_rfb', colunas);
  }

  private async carregarEstabelecimentos(dir: string): Promise<number> {
    const colunas = ['cnpj_basico','cnpj_ordem','cnpj_dv','identificador_matriz_filial','nome_fantasia',
      'situacao_cadastral','data_situacao_cadastral','motivo_situacao_cadastral','nome_cidade_exterior','pais',
      'data_inicio_atividade','cnae_fiscal_principal','cnae_fiscal_secundaria','tipo_logradouro','logradouro',
      'numero','complemento','bairro','cep','uf','municipio','ddd1','telefone1','ddd2','telefone2',
      'ddd_fax','fax','email','situacao_especial','data_situacao_especial'];
    return this.carregarCsvParalelo(dir, 'Estabelecimentos', 'estabelecimentos', colunas);
  }

  private async carregarSocios(dir: string): Promise<number> {
    const colunas = ['cnpj_basico','identificador_socio','nome_socio','cnpj_cpf_socio','qualificacao_socio',
      'data_entrada_sociedade','pais','representante_legal','nome_representante','qualificacao_representante','faixa_etaria'];
    return this.carregarCsvParalelo(dir, 'Socios', 'socios', colunas);
  }

  private async carregarSimples(dir: string) {
    const colunas = ['cnpj_basico','opcao_pelo_simples','data_opcao_simples','data_exclusao_simples',
      'opcao_pelo_mei','data_opcao_mei','data_exclusao_mei'];
    await this.dataSource.query(`TRUNCATE TABLE simples CASCADE`);
    const csvPath = path.join(dir, 'Simples.csv');
    if (fs.existsSync(csvPath)) await this.carregarCsv(csvPath, 'simples', colunas);
  }

  private async carregarCsvParalelo(dir: string, prefixo: string, tabela: string, colunas: string[]): Promise<number> {
    await this.dataSource.query(`TRUNCATE TABLE ${tabela} CASCADE`);
    let total = 0;
    let idx = 0;
    while (true) {
      const csvPath = path.join(dir, `${prefixo}${idx}.csv`);
      if (!fs.existsSync(csvPath)) break;
      this.logger.log(`  Carregando ${tabela} parte ${idx}...`);
      total += await this.carregarCsv(csvPath, tabela, colunas);
      idx++;
    }
    return total;
  }

  private async carregarCsv(csvPath: string, tabela: string, colunas: string[]): Promise<number> {
    const LOTE = 5000;
    const rl = readline.createInterface({ input: fs.createReadStream(csvPath, { encoding: 'latin1' }), crlfDelay: Infinity });
    let lote: string[][] = [];
    let total = 0;

    const flush = async () => {
      if (!lote.length) return;
      const valores = lote.map(row => `(${row.map(v => v === '' ? 'NULL' : `$${total + lote.indexOf(row) * colunas.length + row.indexOf(v) + 1}`).join(',')})`);
      // Simplificado: usa INSERT com pg driver diretamente
      const placeholders = lote.map((row, ri) => `(${row.map((_, ci) => `$${ri * colunas.length + ci + 1}`).join(',')})`).join(',');
      const flat = lote.flat().map(v => v === '' ? null : v.trim());
      await this.dataSource.query(
        `INSERT INTO ${tabela} (${colunas.join(',')}) VALUES ${placeholders} ON CONFLICT DO NOTHING`,
        flat,
      );
      total += lote.length;
      lote = [];
    };

    for await (const line of rl) {
      if (!line.trim()) continue;
      const row = line.split(';').map(v => v.replace(/^"|"$/g, '').trim());
      lote.push(row);
      if (lote.length >= LOTE) await flush();
    }
    await flush();
    return total;
  }

  async status() {
    const logs = await this.logs.find({ order: { iniciadoEm: 'DESC' }, take: 10 });
    return { rodando: this.rodando, historico: logs };
  }
}
