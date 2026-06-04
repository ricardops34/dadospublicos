import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

type LegalTipo = 'termos' | 'privacidade';

interface LegalSection {
  titulo: string;
  paragrafos: string[];
}

interface LegalLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-legal',
  standalone: false,
  templateUrl: './legal.component.html',
  styleUrl: './legal.component.scss',
})
export class LegalComponent {
  tipo: LegalTipo;
  titulo: string;
  subtitulo: string;
  destaque: string;
  secoes: LegalSection[];
  destaquesLaterais: string[];
  basesLegais: LegalLink[];
  ultimaAtualizacao: string;
  emailContato: string;

  constructor(private route: ActivatedRoute) {
    this.tipo = (this.route.snapshot.data['tipo'] as LegalTipo) ?? 'termos';
    this.ultimaAtualizacao = '03 de junho de 2026';
    this.emailContato = 'contato@bjsoft.com.br';

    if (this.tipo === 'privacidade') {
      this.titulo = 'Política de privacidade';
      this.subtitulo = 'Tratamento de dados pessoais, segurança da informação, compartilhamento e exercício de direitos do titular.';
      this.destaque =
        'Esta política disciplina como a BJ Soft coleta, utiliza, compartilha, armazena e protege dados pessoais relacionados ao uso da plataforma BuscaDados e de seus serviços de API.';
      this.destaquesLaterais = [
        'Controladora: BJ Soft, CNPJ 19.654.062/0001-45.',
        'Canal de privacidade e atendimento: contato@bjsoft.com.br.',
        'Aplicável ao site, à área autenticada, à contratação, ao suporte e ao uso da API.',
        'Interpretada conforme a LGPD, o Marco Civil da Internet e a legislação civil e consumerista aplicável.',
      ];
      this.secoes = [
        {
          titulo: '1. Escopo e dados tratados',
          paragrafos: [
            'Esta Política de Privacidade aplica-se ao tratamento de dados pessoais realizado no contexto do website, da documentação, da contratação de planos, da área do cliente, do suporte e do uso das APIs disponibilizadas pela BJ Soft por meio da plataforma BuscaDados.',
            'Podem ser tratados dados cadastrais e de contato, como nome, e-mail, telefone, empresa, CNPJ, cargo, endereço de cobrança, identificadores de conta, histórico de contratação, preferências comerciais e informações fornecidas pelo próprio titular ou por representantes autorizados.',
            'Também podem ser tratados dados técnicos e operacionais, incluindo logs de acesso, endereço IP, data e hora de uso, dados de navegador e dispositivo, eventos de autenticação, criação e revogação de tokens, métricas de consumo, limites aplicados, falhas técnicas, incidentes de segurança e interações com o suporte.',
          ],
        },
        {
          titulo: '2. Finalidades e bases legais do tratamento',
          paragrafos: [
            'Os dados são tratados para permitir o cadastro do cliente, habilitar o acesso a áreas restritas, autenticar usuários, emitir e gerenciar tokens, disponibilizar recursos vinculados ao plano contratado, controlar consumo, aplicar limites técnicos, processar cobranças, responder solicitações de suporte e manter trilhas de auditoria.',
            'O tratamento também pode ocorrer para prevenção à fraude, segurança da informação, detecção de abuso, melhoria de estabilidade e desempenho, comunicações operacionais e comerciais relacionadas ao serviço, cumprimento de obrigações legais e regulatórias e exercício regular de direitos em processos administrativos, arbitrais ou judiciais.',
            'As bases legais aplicáveis incluem, conforme o caso concreto, a execução de contrato e de procedimentos preliminares, o cumprimento de obrigação legal ou regulatória, o exercício regular de direitos, o legítimo interesse do controlador e o consentimento do titular quando ele for especificamente exigido.',
          ],
        },
        {
          titulo: '3. Compartilhamento, operadores e transferências',
          paragrafos: [
            'A BJ Soft não comercializa dados pessoais. O compartilhamento pode ocorrer apenas com operadores e parceiros essenciais à prestação do serviço, como provedores de hospedagem, banco de dados, monitoramento, e-mail transacional, meios de pagamento, suporte técnico e ferramentas de segurança, sempre dentro do necessário para a finalidade contratada.',
            'Informações também podem ser compartilhadas com autoridades públicas, órgãos reguladores ou judiciais quando houver determinação legal, ordem competente, necessidade de defesa de direitos ou prevenção de fraude e incidente de segurança.',
            'Se houver uso de infraestrutura ou fornecedores localizados fora do Brasil, a BJ Soft adotará medidas contratuais e organizacionais razoáveis para assegurar nível de proteção compatível com a legislação aplicável.',
          ],
        },
        {
          titulo: '4. Cookies, logs, retenção e segurança',
          paragrafos: [
            'A plataforma pode utilizar cookies, armazenamento local e recursos similares para autenticação, segurança de sessão, preferência de navegação, medição de desempenho e melhoria da experiência do usuário. O titular pode gerenciar parte dessas preferências no navegador, ciente de que isso pode afetar a funcionalidade do serviço.',
            'Registros de acesso, logs operacionais e evidências técnicas podem ser mantidos pelo prazo necessário para cumprimento das finalidades descritas nesta política, atendimento a exigências legais, auditoria, segurança, prevenção a abuso e exercício regular de direitos.',
            'A BJ Soft adota medidas técnicas e administrativas razoáveis para proteger dados pessoais contra acesso não autorizado, destruição, perda, alteração, comunicação ou qualquer forma de tratamento inadequado ou ilícito. Apesar disso, nenhum ambiente conectado à internet é absolutamente imune a riscos, razão pela qual não há garantia absoluta de inviolabilidade.',
          ],
        },
        {
          titulo: '5. Direitos do titular e canal de atendimento',
          paragrafos: [
            'O titular pode solicitar confirmação da existência de tratamento, acesso, correção de dados incompletos, inexatos ou desatualizados, anonimização, bloqueio ou eliminação quando cabível, portabilidade, informações sobre compartilhamento, revogação de consentimento e revisão de decisões, nos limites e hipóteses previstos em lei.',
            'As solicitações relacionadas a dados pessoais podem ser encaminhadas para contato@bjsoft.com.br. Para proteger o próprio titular e terceiros, a BJ Soft pode solicitar informações adicionais para validar identidade, legitimidade e escopo do pedido antes de responder.',
            'Esta política pode ser atualizada para refletir a evolução do serviço, mudanças regulatórias ou melhorias de governança. A versão vigente será sempre a publicada nesta página, com indicação da data de atualização.',
          ],
        },
      ];
    } else {
      this.titulo = 'Termos de uso';
      this.subtitulo = 'Regras de acesso, contratação, uso da plataforma, utilização da API, consumo, limites técnicos e responsabilidades das partes.';
      this.destaque =
        'Estes termos regem a utilização do website, da área do cliente, da documentação e dos serviços disponibilizados pela BJ Soft na plataforma BuscaDados.';
      this.destaquesLaterais = [
        'Prestadora: BJ Soft, CNPJ 19.654.062/0001-45.',
        'Aplicável ao site, à área autenticada, à contratação, à documentação e à API.',
        'Recursos, limites e autorizações dependem do plano ativo e da situação da conta.',
        'Contato comercial e jurídico: contato@bjsoft.com.br.',
      ];
      this.secoes = [
        {
          titulo: '1. Objeto, escopo e aceite',
          paragrafos: [
            'Os presentes Termos de Uso disciplinam o acesso e a utilização da plataforma BuscaDados, do website institucional, da documentação técnica, da área do cliente, dos serviços de API e dos recursos comerciais e operacionais disponibilizados pela BJ Soft.',
            'Ao navegar no site, solicitar cadastro, contratar um plano, gerar credenciais, acessar área restrita ou utilizar qualquer endpoint da plataforma, o usuário declara que leu, compreendeu e concorda com estes Termos, com a Política de Privacidade e com a legislação brasileira aplicável.',
            'Caso o aceite seja realizado em nome de pessoa jurídica, o usuário declara possuir poderes suficientes para vincular a empresa contratante às regras aqui previstas.',
          ],
        },
        {
          titulo: '2. Cadastro, conta, credenciais e segurança',
          paragrafos: [
            'O cliente deve fornecer informações verdadeiras, completas e atualizadas no cadastro, mantendo seus representantes, contatos, dados fiscais e dados de cobrança corretamente informados enquanto houver relação contratual ativa.',
            'Credenciais, senhas, tokens e chaves de acesso são pessoais, sigilosos e de responsabilidade do cliente. Cabe ao contratante adotar controles internos adequados para armazenamento seguro, rotação, revogação e restrição de uso por pessoas autorizadas.',
            'O cliente deve comunicar imediatamente à BJ Soft qualquer suspeita de uso indevido, vazamento de credenciais, acesso não autorizado ou incidente que possa comprometer a integridade da conta ou dos dados processados por meio da plataforma.',
          ],
        },
        {
          titulo: '3. Uso permitido, vedações e conformidade',
          paragrafos: [
            'A plataforma deve ser utilizada apenas para finalidades lícitas, empresariais ou operacionais compatíveis com a natureza dos serviços oferecidos, em conformidade com a legislação de proteção de dados, defesa do consumidor, propriedade intelectual, concorrência e demais normas aplicáveis.',
            'É proibido utilizar o serviço para fraudar controles, contornar limites técnicos, compartilhar credenciais de forma indevida, realizar engenharia reversa não autorizada, automatizar tráfego abusivo, explorar vulnerabilidades, reproduzir indevidamente conteúdo da documentação ou utilizar os dados obtidos em desconformidade com a lei.',
            'A BJ Soft poderá adotar medidas de mitigação, suspensão preventiva, bloqueio técnico ou cancelamento em caso de suspeita fundada de abuso, risco operacional, incidente de segurança, ordem legal ou violação destes Termos.',
          ],
        },
        {
          titulo: '4. Planos, recursos, consumo e faturamento',
          paragrafos: [
            'Os recursos disponíveis, os limites de consumo, o rate limit, a autorização de funcionalidades, os canais de suporte e as condições comerciais dependem do plano contratado, da situação financeira da conta e das regras vigentes de provisionamento definidas pela BJ Soft.',
            'O consumo da API pode ser medido por requisições, operações, chamadas autenticadas ou outros critérios técnicos indicados na plataforma ou na documentação. Ao atingir os limites contratados, a BJ Soft poderá restringir novas operações, aplicar políticas de degradação, suspender recursos específicos ou exigir upgrade de plano.',
            'Planos pagos, renovações, cobranças, eventual inadimplência, suspensão e cancelamento obedecerão às condições comerciais informadas no momento da contratação, sem prejuízo dos direitos assegurados pela legislação aplicável e pelos instrumentos contratuais firmados entre as partes.',
          ],
        },
        {
          titulo: '5. Disponibilidade, dados e limitação de responsabilidade',
          paragrafos: [
            'A BJ Soft envidará esforços razoáveis para manter o serviço disponível, seguro e atualizado, mas não garante funcionamento ininterrupto, ausência total de falhas, compatibilidade irrestrita com ambientes de terceiros ou continuidade integral de fontes externas e bases públicas utilizadas para composição dos serviços.',
            'Os dados e consultas disponibilizados pela plataforma possuem caráter informativo, cadastral e de apoio operacional. O cliente permanece responsável por validar informações em processos críticos, jurídicos, regulados, financeiros ou que exijam confirmação adicional em fonte oficial ou procedimento próprio.',
            'Na extensão permitida pela legislação aplicável, a BJ Soft não responde por lucros cessantes, perdas indiretas, danos decorrentes de mau uso da plataforma, integrações desenvolvidas por terceiros, indisponibilidade de infraestrutura externa, alterações em bases públicas ou decisões tomadas exclusivamente com base nas informações consultadas.',
          ],
        },
        {
          titulo: '6. Propriedade intelectual, alterações e disposições finais',
          paragrafos: [
            'A estrutura da plataforma, o software, a identidade visual, a documentação, os textos, as marcas, as interfaces e demais ativos protegidos associados ao BuscaDados pertencem à BJ Soft ou a seus licenciantes, sendo vedada a reprodução, distribuição ou exploração indevida sem autorização prévia, salvo nos limites expressamente permitidos em lei.',
            'A BJ Soft pode alterar funcionalidades, fluxos, limites técnicos, layout, política comercial, integrações, textos legais e especificações da plataforma para refletir a evolução do produto, exigências legais, mudanças de mercado ou necessidade de segurança. Sempre que razoável, as alterações relevantes serão comunicadas de forma adequada.',
            'Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca do domicílio da BJ Soft, salvo competência legal diversa, para dirimir controvérsias relacionadas ao uso da plataforma.',
          ],
        },
      ];
    }

    this.basesLegais = [
      {
        label: 'LGPD - Lei nº 13.709/2018',
        href: 'https://www.planalto.gov.br/ccivil_03/_Ato2015-2018/2018/Lei/L13709compilado.htm',
      },
      {
        label: 'Marco Civil da Internet - Lei nº 12.965/2014',
        href: 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l12965.htm',
      },
      {
        label: 'Código de Defesa do Consumidor - Lei nº 8.078/1990',
        href: 'https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm',
      },
    ];
  }
}
