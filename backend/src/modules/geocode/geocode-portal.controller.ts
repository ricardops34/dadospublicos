import { Controller, Get, Param, UseGuards } from '@nestjs/common';
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

  @Get('cnpj/:cnpj')
  @ApiOperation({ summary: 'Consulta CNPJ — portal (qualquer perfil, sem token de API)' })
  @ApiParam({ name: 'cnpj', example: '27865757000102' })
  async buscarCnpj(@Param('cnpj') cnpj: string) {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    const dados = await this.cnpj.buscar(cnpjLimpo);
    if (!dados) return null;

    const estab = dados.estabelecimento ?? {};
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
    };
  }
}
