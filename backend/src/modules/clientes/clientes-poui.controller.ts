import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtPortalGuard } from '../portal/jwt-portal.guard';
import { Perfil } from '../portal/perfil.decorator';
import { ClientesService } from './clientes.service';
import { CreateClienteDto, UpdateClienteDto } from './dto/create-cliente.dto';
import { Request } from 'express';
import { CnpjService } from '../cnpj/cnpj.service';
import { GeocodeService } from '../geocode/geocode.service';

@ApiTags('Clientes (PO-UI)')
@ApiBearerAuth()
@Controller('admin/clientes-poui')
@UseGuards(JwtPortalGuard)
@Perfil('admin')
export class ClientesPoUiController {
  constructor(
    private readonly clientesService: ClientesService,
    private readonly cnpjService: CnpjService,
    private readonly geocodeService: GeocodeService
  ) {}

  @Get()
  async findAll(@Query('page') page = '1', @Query('pageSize') pageSize = '10', @Query() reqQuery: any) {
    const pagina = parseInt(page, 10);
    const limite = parseInt(pageSize, 10);
    const search = reqQuery.search;
    const filters = { ...reqQuery };
    delete filters.page;
    delete filters.pageSize;
    delete filters.search;
    
    const [items, total] = await this.clientesService.findAll(pagina, limite, search, filters);
    
    return {
      hasNext: (pagina * limite) < total,
      items: items.map(c => ({
        ...c,
        ativoStatus: c.ativo ? ['ativo'] : ['suspenso'],
        emailVerificado: c.emailVerificado ? ['verificado'] : ['nao_verificado'],
        plano: c.assinaturas?.find((a: any) => a.status === 'ativa')?.plano?.nome ?? '—',
      }))
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.clientesService.findOne(id);
  }

  @Post()
  async create(@Body() createClienteDto: CreateClienteDto) {
    // A API do PO-UI manda os dados e espera um retorno.
    const res = await this.clientesService.signup(createClienteDto);
    return this.clientesService.findOne(res.id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    await this.clientesService.atualizar(id, updateClienteDto);
    return this.clientesService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.clientesService.excluirConta(id);
    return { success: true };
  }

  // --- Endpoints de Validação (PO-UI p-validate) ---

  @Post('validate-tipo-pessoa')
  async validateTipoPessoa(@Body() body: any) {
    const tipo = body.value;
    if (tipo === 'F') {
      return {
        fields: [
          { property: 'cpf', visible: true, required: true },
          { property: 'dataNascimento', visible: true },
          { property: 'cnpj', visible: false, required: false, value: null },
          { property: 'razaoSocial', visible: false, value: null }
        ]
      };
    } else {
      return {
        fields: [
          { property: 'cpf', visible: false, required: false, value: null },
          { property: 'dataNascimento', visible: false, value: null },
          { property: 'cnpj', visible: true, required: true },
          { property: 'razaoSocial', visible: true }
        ]
      };
    }
  }
  
  @Post('validate-cep')
  async validateCep(@Body() body: any) {
    const cep = body.value;
    if (!cep) return { value: {} };

    try {
      const data = await this.geocodeService.buscarCep(cep);
      return {
        value: {
          cep: data.cep,
          logradouro: data.logradouro,
          bairro: data.bairro,
          municipio: data.municipio,
          uf: data.ufSigla,
          lat: data.lat,
          lng: data.lng
        }
      };
    } catch (err) {
      return {
        value: { cep },
        fields: [ { property: 'cep', message: 'CEP não encontrado ou inválido' } ]
      };
    }
  }

  @Post('validate-cnpj')
  async validateCnpj(@Body() body: any) {
    const cnpj = body.value;
    if (!cnpj) return { value: {} };

    try {
      // Chama o modulo CNPJ interno
      const dados = await this.cnpjService.buscar(cnpj);
      if (!dados) {
        return {
          value: { cnpj },
          fields: [ { property: 'cnpj', message: 'CNPJ inválido ou não encontrado' } ]
        };
      }

      return {
        value: {
          cnpj: dados.estabelecimento.cnpj,
          razaoSocial: dados.razao_social,
          cep: dados.estabelecimento.cep,
          logradouro: dados.estabelecimento.tipo_logradouro ? dados.estabelecimento.tipo_logradouro + ' ' + dados.estabelecimento.logradouro : dados.estabelecimento.logradouro,
          numero: dados.estabelecimento.numero,
          complemento: dados.estabelecimento.complemento,
          bairro: dados.estabelecimento.bairro,
          municipio: dados.estabelecimento.municipio?.nome,
          uf: dados.estabelecimento.uf
        }
      };
    } catch (err) {
      return { value: {} };
    }
  }

  @Get('ufs')
  getUfs(@Query('filter') filter?: string) {
    return this.geocodeService.getUfs(filter);
  }

  @Get('municipios/:uf')
  getMunicipios(@Param('uf') uf: string, @Query('filter') filter?: string) {
    return this.geocodeService.getMunicipios(uf, filter);
  }

  @Get('seed-ibge')
  async seedIbge() {
    const res = await this.geocodeService.syncIbge();
    return { success: true, ...res, message: 'IBGE sincronizado com sucesso!' };
  }
}
