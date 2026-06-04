import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DOC_DIR = path.join(ROOT, 'doc');
const GENERATED_DIR = path.join(DOC_DIR, 'llms-generated');
const SOURCES_DIR = path.join(DOC_DIR, 'sources');
const GUIDES_DIR = path.join(DOC_DIR, 'guides');

const LLM_INDEX_URL = 'https://po-ui.io/llms.txt';
const LLM_FULL_URL = 'https://po-ui.io/llms-full.txt';
const GUIDE_MIRRORS = [
  {
    title: 'Instalacao e configuracao',
    officialUrl: 'https://po-ui.io/guides/getting-started',
    rawUrl: 'https://raw.githubusercontent.com/po-ui/po-angular/master/docs/guides/getting-started.md',
    localPath: 'guides/getting-started.md'
  },
  {
    title: 'Create theme customization',
    officialUrl: 'https://po-ui.io/guides/create-theme-customization',
    rawUrl: 'https://raw.githubusercontent.com/po-ui/po-angular/master/docs/guides/theme-service.md',
    localPath: 'guides/create-theme-customization.md'
  },
  {
    title: 'Personalizacao de tema com tokens CSS',
    officialUrl: 'https://po-ui.io/guides/theme-customization',
    rawUrl: 'https://raw.githubusercontent.com/po-ui/po-angular/master/docs/guides/theme-service.md',
    localPath: 'guides/theme-customization.md'
  }
];
const PO_THEME_PACKAGE_URL = 'https://registry.npmjs.org/@totvs/po-theme';
const PO_THEME_REPO_API_URL = 'https://api.github.com/repos/totvs/po-theme-totvs';
const PO_THEME_REPO_RAW_BASE = 'https://raw.githubusercontent.com/totvs/po-theme-totvs/main/';
const PO_THEME_REPO_SNAPSHOT_DIR = path.join(SOURCES_DIR, 'po-theme-totvs-repo');

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Falha ao baixar ${url}: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json'
    }
  });
  if (!response.ok) {
    throw new Error(`Falha ao baixar ${url}: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

function parseLlmsIndex(markdown) {
  const lines = markdown.split(/\r?\n/);
  const sections = [];
  let currentSection = null;

  for (const line of lines) {
    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      currentSection = {
        title: heading[1].trim(),
        entries: []
      };
      sections.push(currentSection);
      continue;
    }

    const item = line.match(/^- \[([^\]]+)\]\((https:\/\/po-ui\.io\/[^\)]+)\):\s*(.+)$/);
    if (!item || !currentSection) {
      continue;
    }

    const [, name, url, description] = item;
    currentSection.entries.push({
      name: name.trim(),
      url: url.trim(),
      description: description.trim()
    });
  }

  return sections;
}

function uniqueEntries(sections) {
  const map = new Map();

  for (const section of sections) {
    for (const entry of section.entries) {
      if (!entry.url.includes('/llms-generated/')) {
        continue;
      }
      if (!map.has(entry.url)) {
        map.set(entry.url, entry);
      }
    }
  }

  return [...map.values()];
}

async function runWithLimit(items, limit, worker) {
  const queue = [...items];
  const tasks = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      await worker(item);
    }
  });
  await Promise.all(tasks);
}

function localTargetFromUrl(url) {
  const pathname = new URL(url).pathname.replace(/^\/+/, '');
  return path.join(DOC_DIR, pathname);
}

function buildIndexMarkdown(sections, stats) {
  const generatedAt = new Date().toISOString();
  const guideLinks = new Map(GUIDE_MIRRORS.map(guide => [guide.officialUrl, `./${guide.localPath}`]));
  guideLinks.set('https://po-ui.io/guides/accessibility', './guides/accessibility.md');
  const lines = [
    '# PO UI Offline Docs',
    '',
    `Gerado automaticamente em \`${generatedAt}\`.`,
    '',
    'Este diretório espelha os arquivos markdown publicados em `https://po-ui.io/llms-generated/` para consulta local quando a documentação oficial ou o MCP estiverem indisponíveis.',
    '',
    '## Fontes',
    '',
    '- [llms.txt](./sources/llms.txt)',
    '- [llms-full.txt](./sources/llms-full.txt)',
    '- [po-theme-package.json](./sources/po-theme-package.json)',
    '- [po-theme-readme.md](./sources/po-theme-readme.md)',
    '- [po-theme-totvs-repo](./sources/po-theme-totvs-repo)',
    '',
    '## Resumo',
    '',
    `- Total de arquivos espelhados: **${stats.mirrored}**`,
    `- Total de seções encontradas no índice: **${stats.sections}**`,
    ''
  ];

  for (const section of sections) {
    lines.push(`## ${section.title}`);
    lines.push('');

    for (const entry of section.entries) {
      if (entry.url.includes('/llms-generated/')) {
        const pathname = new URL(entry.url).pathname.replace(/^\/+/, '');
        lines.push(`- [${entry.name}](./${pathname}): ${entry.description}`);
      } else if (guideLinks.has(entry.url)) {
        lines.push(`- [${entry.name}](${guideLinks.get(entry.url)}): ${entry.description}`);
      } else {
        lines.push(`- ${entry.name}: ${entry.description}`);
        lines.push(`  Fonte online: ${entry.url}`);
      }
    }

    lines.push('');
  }

  lines.push('## Guias Extras');
  lines.push('');
  lines.push('- [Tema Protheus / TOTVS (`@totvs/po-theme`)](./guides/po-theme.md): Instalacao, configuracao e referencias locais do tema padrao TOTVS para PO UI.');
  lines.push('');

  return lines.join('\n');
}

function buildAccessibilityGuide() {
  return [
    '# Acessibilidade',
    '',
    '**Fonte oficial:** https://po-ui.io/guides/accessibility',
    '',
    'Este arquivo foi gerado como fallback local. A rota oficial de acessibilidade nao estava disponivel em markdown bruto no momento da geracao, entao este guia resume o que pode ser consultado offline no espelho local do PO UI.',
    '',
    '## O que consultar offline',
    '',
    '- Os componentes espelhados em `doc/llms-generated/*.md` frequentemente possuem a secao `Acessibilidade tratada no componente`.',
    '- O guia [Customizacao de tema com tokens CSS](./theme-customization.md) cobre o suporte a temas com niveis de acessibilidade `AA/AAA` via servico de tema.',
    '- O arquivo [llms-full.txt](../sources/llms-full.txt) concentra toda a documentacao LLM espelhada e pode ser pesquisado localmente.',
    '',
    '## Pesquisa recomendada',
    '',
    'Para localizar rapidamente orientacoes de acessibilidade nos componentes, pesquise por:',
    '',
    '```text',
    'Acessibilidade tratada no componente',
    '```',
    '',
    '## Observacao',
    '',
    'Se a equipe do PO UI publicar a fonte markdown desse guia no repositorio, este gerador pode ser ajustado para espelhar o conteudo oficial integralmente.'
  ].join('\n');
}

function buildPoThemeGuide({ npmPackage, repoMeta, readme }) {
  const latest = npmPackage['dist-tags']?.latest;
  const latestVersion = latest ? npmPackage.versions?.[latest] : null;
  const generatedAt = new Date().toISOString();

  return [
    '# Tema Protheus / TOTVS para PO UI',
    '',
    `Gerado automaticamente em \`${generatedAt}\`.`,
    '',
    `- Pacote npm: \`@totvs/po-theme\``,
    `- Versao \`latest\`: \`${latest ?? '-'}\``,
    `- Repositorio publico: ${repoMeta.html_url}`,
    `- Ultima atualizacao publica observada: \`${repoMeta.pushed_at ?? '-'}\``,
    '',
    '## Status',
    '',
    'O repositorio publico informa que esta em processo de descontinuacao e que novas evolucoes passaram para um projeto interno/privado. Apesar disso, o pacote segue publicado no npm e pode ser usado como tema padrao TOTVS para aplicacoes com PO UI.',
    '',
    '## Instalacao',
    '',
    '```bash',
    'npm i @totvs/po-theme',
    '```',
    '',
    '## Configuracao no `angular.json`',
    '',
    'Adicione os estilos nesta ordem:',
    '',
    '```json',
    '"styles": [',
    '  "node_modules/@totvs/po-theme/css/po-theme-default-variables.min.css",',
    '  "node_modules/@totvs/po-theme/css/po-theme-default.min.css",',
    '  "node_modules/@po-ui/style/css/po-theme-core.min.css"',
    ']',
    '```',
    '',
    '## Observacoes',
    '',
    '- O pacote se apresenta como `PO Theme - Totvs Default Theme`.',
    '- O repositório publico e marcado como descontinuado; trate-o como referencia historica e snapshot tecnico.',
    '- Para customizacoes avancadas de tema no PO UI, consulte tambem [theme-customization.md](./theme-customization.md).',
    '',
    '## Fontes locais espelhadas',
    '',
    '- [README do tema](../sources/po-theme-readme.md)',
    '- [package.json do tema](../sources/po-theme-package.json)',
    '- [Snapshot do repositorio publico](../sources/po-theme-totvs-repo/README.md)',
    '',
    '## Metadados tecnicos do pacote',
    '',
    '```json',
    JSON.stringify(
      {
        name: npmPackage.name,
        description: npmPackage.description,
        distTags: npmPackage['dist-tags'],
        latestVersion: latestVersion
          ? {
              version: latestVersion.version,
              repository: latestVersion.repository,
              license: latestVersion.license,
              devDependencies: latestVersion.devDependencies,
              dist: latestVersion.dist
            }
          : null
      },
      null,
      2
    ),
    '```',
    '',
    '## Trecho oficial do README',
    '',
    '```md',
    readme.trim(),
    '```'
  ].join('\n');
}

async function syncGithubRepoSnapshot({ apiUrl, rawBaseUrl, targetDir }) {
  const tree = await fetchJson(`${apiUrl}/git/trees/main?recursive=1`);
  const files = (tree.tree || []).filter(entry => entry.type === 'blob');

  await runWithLimit(files, 6, async file => {
    const targetPath = path.join(targetDir, file.path);
    await mkdir(path.dirname(targetPath), { recursive: true });

    const response = await fetch(`${rawBaseUrl}${file.path}`);
    if (!response.ok) {
      throw new Error(`Falha ao baixar arquivo do repo ${file.path}: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    await writeFile(targetPath, Buffer.from(arrayBuffer));
  });

  return files.length;
}

async function main() {
  await mkdir(GENERATED_DIR, { recursive: true });
  await mkdir(SOURCES_DIR, { recursive: true });
  await mkdir(GUIDES_DIR, { recursive: true });
  await mkdir(PO_THEME_REPO_SNAPSHOT_DIR, { recursive: true });

  const [llmsIndex, llmsFull, poThemePackage, poThemeRepoMeta, poThemeReadme] = await Promise.all([
    fetchText(LLM_INDEX_URL),
    fetchText(LLM_FULL_URL),
    fetchJson(PO_THEME_PACKAGE_URL),
    fetchJson(PO_THEME_REPO_API_URL),
    fetchText(`${PO_THEME_REPO_RAW_BASE}README.md`)
  ]);

  await writeFile(path.join(SOURCES_DIR, 'llms.txt'), llmsIndex, 'utf8');
  await writeFile(path.join(SOURCES_DIR, 'llms-full.txt'), llmsFull, 'utf8');
  await writeFile(path.join(SOURCES_DIR, 'po-theme-package.json'), JSON.stringify(poThemePackage, null, 2), 'utf8');
  await writeFile(path.join(SOURCES_DIR, 'po-theme-readme.md'), poThemeReadme, 'utf8');

  const sections = parseLlmsIndex(llmsIndex);
  const entries = uniqueEntries(sections);

  await runWithLimit(entries, 8, async entry => {
    const targetPath = localTargetFromUrl(entry.url);
    await mkdir(path.dirname(targetPath), { recursive: true });
    const content = await fetchText(entry.url);
    await writeFile(targetPath, content, 'utf8');
  });

  await runWithLimit(GUIDE_MIRRORS, 4, async guide => {
    const targetPath = path.join(DOC_DIR, guide.localPath);
    await mkdir(path.dirname(targetPath), { recursive: true });
    const content = await fetchText(guide.rawUrl);
    await writeFile(targetPath, content, 'utf8');
  });

  await writeFile(path.join(GUIDES_DIR, 'accessibility.md'), buildAccessibilityGuide(), 'utf8');
  await writeFile(path.join(GUIDES_DIR, 'po-theme.md'), buildPoThemeGuide({
    npmPackage: poThemePackage,
    repoMeta: poThemeRepoMeta,
    readme: poThemeReadme
  }), 'utf8');

  const poThemeRepoFileCount = await syncGithubRepoSnapshot({
    apiUrl: PO_THEME_REPO_API_URL,
    rawBaseUrl: PO_THEME_REPO_RAW_BASE,
    targetDir: PO_THEME_REPO_SNAPSHOT_DIR
  });

  const indexMarkdown = buildIndexMarkdown(sections, {
    mirrored: entries.length,
    sections: sections.length,
    poThemeRepoFileCount
  });

  await writeFile(path.join(DOC_DIR, 'index.md'), indexMarkdown, 'utf8');

  console.log(`Arquivos espelhados: ${entries.length}`);
  console.log(`Arquivos no snapshot do po-theme: ${poThemeRepoFileCount}`);
  console.log(`Indice gerado em: ${path.join(DOC_DIR, 'index.md')}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
