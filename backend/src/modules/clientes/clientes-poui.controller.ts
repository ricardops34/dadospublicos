import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtPortalGuard } from '../portal/jwt-portal.guard';
import { Perfil } from '../portal/perfil.decorator';
import { ClientesService } from './clientes.service';
import { AgendarExclusaoDto, CreateClienteDto, UpdateClienteDto } from './dto/create-cliente.dto';
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
    private readonly geocodeService: GeocodeService,
  ) {}

  private toPoUiListItem(cliente: any) {
    const safeCliente = this.clientesService.sanitizeAdminResponse(cliente);

    return {
      ...safeCliente,
      ativoStatus: cliente.ativo ? 1 : 0,
      emailVerificado: cliente.emailVerificado ? 1 : 0,
      plano: cliente.assinaturas?.find((assinatura: any) => assinatura.status === 'ativa')?.plano?.nome ?? '—',
    };
  }

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
      items: items.map((cliente) => this.toPoUiListItem(cliente)),
    };
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

  @Get('lookup/cnpj/:cnpj')
  async lookupCnpj(@Param('cnpj') cnpj: string) {
    return this.cnpjService.buscar(cnpj);
  }

  @Get('lookup/cep/:cep')
  async lookupCep(@Param('cep') cep: string) {
    return this.geocodeService.buscarCep(cep);
  }

  @Get('metadata')
  getMetadata() {
    return { version: 1, fields: [] };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cliente = await this.clientesService.findOne(id);
    return this.clientesService.sanitizeAdminResponse(cliente);
  }

  @Post()
  async create(@Body() createClienteDto: CreateClienteDto) {
    const res = await this.clientesService.signup(createClienteDto);
    const cliente = await this.clientesService.findOne(res.id);
    return this.clientesService.sanitizeAdminResponse(cliente);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    await this.clientesService.atualizar(id, updateClienteDto);
    const cliente = await this.clientesService.findOne(id);
    return this.clientesService.sanitizeAdminResponse(cliente);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.clientesService.agendarExclusaoAdmin(id, { agendarPara: 'agora' });
      return { success: true, ...result };
    } catch (e: any) {
      throw new HttpException(e.message || 'Erro ao excluir cliente.', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  @Patch(':id/ativo')
  async ativar(@Param('id') id: string, @Body('ativo') ativo: boolean) {
    return this.clientesService.ativar(id, ativo);
  }

  @Patch(':id/confirmar-email')
  async confirmarEmail(@Param('id') id: string) {
    return this.clientesService.confirmarEmail(id);
  }

  @Post(':id/enviar-reset-senha')
  async enviarResetSenha(@Param('id') id: string) {
    return this.clientesService.enviarResetPorAdmin(id);
  }

  @Post(':id/agendar-exclusao')
  async agendarExclusao(@Param('id') id: string, @Body() dto: AgendarExclusaoDto) {
    return this.clientesService.agendarExclusaoAdmin(id, dto);
  }

  @Post(':id/cancelar-exclusao')
  async cancelarExclusao(@Param('id') id: string) {
    return this.clientesService.cancelarExclusaoAdmin(id);
  }

  @Post('validate-cpf')
  validateCpf(@Body() body: any) {
    const cpf = (body.value ?? '').replace(/\D/g, '');
    if (!this.isValidCpf(cpf)) {
      return { value: body.value, fields: [{ property: 'cpf', message: 'CPF inválido' }] };
    }
    return { value: body.value };
  }

  private isValidCpf(cpf: string): boolean {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    const calc = (n: number) => {
      const sum = [...Array(n)].reduce((acc: number, _: any, i: number) => acc + +cpf[i] * (n + 1 - i), 0);
      const r = (sum * 10) % 11;
      return r >= 10 ? 0 : r;
    };
    return calc(9) === +cpf[9] && calc(10) === +cpf[10];
  }

  @Post('validate-tipo-pessoa')
  async validateTipoPessoa(@Body() body: any) {
    const tipo = body.value;
    if (tipo === 'F') {
      return {
        fields: [
          { property: 'cpf', visible: true, required: true },
          { property: 'dataNascimento', visible: true },
          { property: 'cnpj', visible: false, required: false, value: null },
          { property: 'razaoSocial', visible: false, value: null },
        ],
      };
    }

    return {
      fields: [
        { property: 'cpf', visible: false, required: false, value: null },
        { property: 'dataNascimento', visible: false, value: null },
        { property: 'cnpj', visible: true, required: true },
        { property: 'razaoSocial', visible: true },
      ],
    };
  }

  @Post('validate-cep')
  async validateCep(@Body() body: any) {
    const cep = body.value;
    if (!cep) return { value: {} };

    try {
      const data = await this.geocodeService.buscarCep(cep);
      return {
        value: {
          cep:        data.cep,
          logradouro: data.logradouro,
          complemento: data.complemento,
          bairro:     data.bairro,
          municipio:  data.municipio,
          uf:         data.ufSigla,
          lat:        data.lat,
          lng:        data.lng,
        },
      };
    } catch {
      return {
        value: { cep },
        fields: [{ property: 'cep', message: 'CEP não encontrado ou inválido' }],
      };
    }
  }

  @Post('validate-cnpj')
  async validateCnpj(@Body() body: any) {
    const cnpj = body.value;
    if (!cnpj) return { value: {} };

    try {
      const dados = await this.cnpjService.buscar(cnpj);
      if (!dados) {
        return {
          value: { cnpj },
          fields: [{ property: 'cnpj', message: 'CNPJ inválido ou não encontrado' }],
        };
      }

      return {
        value: {
          cnpj: dados.estabelecimento.cnpj,
          razaoSocial: dados.razao_social,
          cep: dados.estabelecimento.cep,
          logradouro: dados.estabelecimento.tipo_logradouro
            ? `${dados.estabelecimento.tipo_logradouro} ${dados.estabelecimento.logradouro}`
            : dados.estabelecimento.logradouro,
          numero: dados.estabelecimento.numero,
          complemento: dados.estabelecimento.complemento,
          bairro: dados.estabelecimento.bairro,
          municipio: dados.estabelecimento.municipio?.nome,
          uf: dados.estabelecimento.uf,
        },
      };
    } catch {
      return {
        value: { cnpj },
        fields: [{ property: 'cnpj', message: 'CNPJ inválido ou não encontrado na base' }],
      };
    }
  }
}
