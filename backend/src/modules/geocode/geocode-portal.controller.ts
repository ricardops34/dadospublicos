import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtPortalGuard } from '../portal/jwt-portal.guard';
import { GeocodeService } from './geocode.service';
import { CnpjService } from '../cnpj/cnpj.service';

@ApiTags('Geocode (Portal)')
@ApiSecurity('bearer')
@Controller('portal/geocode')
@UseGuards(JwtPortalGuard)
export class GeocodePortalController {
  constructor(
    private readonly geocode: GeocodeService,
    private readonly cnpj: CnpjService,
  ) {}

  @Get('cep/:cep')
  @ApiOperation({ summary: 'Consulta CEP — portal (qualquer perfil, sem token de API)' })
  @ApiParam({ name: 'cep', example: '01310100' })
  buscarCep(@Param('cep') cep: string) {
    return this.geocode.buscarCep(cep);
  }

  @Get('cnaes')
  @ApiOperation({ summary: 'Pesquisa CNAEs no catálogo RFB — formato combo PO-UI' })
  pesquisarCnaes(@Query('filter') filter?: string, @Query('value') value?: string) {
    return this.cnpj.pesquisarCnaes(filter, value);
  }

  @Get('cnaes/:codigo')
  @ApiOperation({ summary: 'Busca um CNAE pelo código' })
  @ApiParam({ name: 'codigo', example: '6201501' })
  obterCnae(@Param('codigo') codigo: string) {
    return this.cnpj.obterCnae(codigo);
  }

  @Get('cnpj/:cnpj')
  @ApiOperation({ summary: 'Consulta CNPJ — portal (qualquer perfil, sem token de API)' })
  @ApiParam({ name: 'cnpj', example: '27865757000102' })
  async buscarCnpj(@Param('cnpj') cnpj: string) {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    const dados = await this.cnpj.buscar(cnpjLimpo);
    if (!dados) return null;

    const estab = dados.estabelecimento ?? {};
    const codigosSecundarios: string[] = estab.atividades_secundarias ?? [];
    const catalogoSecundarios = await this.cnpj.obterCnaesPorCodigos(codigosSecundarios);

    return {
      cnpj:        estab.cnpj,
      razaoSocial: dados.razao_social,
      cep:         estab.cep,
      logradouro:  estab.tipo_logradouro
        ? `${estab.tipo_logradouro} ${estab.logradouro}`
        : estab.logradouro,
      numero:      estab.numero,
      complemento: estab.complemento,
      bairro:      estab.bairro,
      municipio:   estab.municipio?.nome,
      uf:          estab.estado?.sigla ?? estab.uf,
      cnaePrincipal:          estab.atividade_principal?.id ?? null,
      cnaePrincipalDescricao: estab.atividade_principal?.descricao ?? null,
      cnaesSecundarios: codigosSecundarios.map((codigo) => ({
        codigo,
        descricao: catalogoSecundarios.find((c) => c.codigo === codigo)?.descricao ?? null,
      })),
    };
  }
}
