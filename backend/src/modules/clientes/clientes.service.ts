import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Assinatura } from '../../entities/assinatura.entity';
import { ClienteCnae } from '../../entities/cliente-cnae.entity';
import { Cliente } from '../../entities/cliente.entity';
import { Usuario } from '../../entities/usuario.entity';
import { CnpjService } from '../cnpj/cnpj.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { AgendarExclusaoDto, CnaeSecundarioInput } from '../usuarios/dto/create-usuario.dto';
import { CreateClienteDto, UpdateClienteDto } from './dto/create-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente, 'buscadados') private clientes: Repository<Cliente>,
    @InjectRepository(ClienteCnae, 'buscadados') private clienteCnaes: Repository<ClienteCnae>,
    @InjectRepository(Assinatura, 'buscadados') private assinaturas: Repository<Assinatura>,
    @InjectRepository(Usuario, 'buscadados') private usuarios: Repository<Usuario>,
    private cnpjService: CnpjService,
    private usuariosService: UsuariosService,
  ) {}

  private nomeExibicao(cliente: Partial<Cliente>) {
    return cliente.tipoPessoa === 'F'
      ? (cliente.nome ?? '—')
      : (cliente.nomeFantasia ?? cliente.razaoSocial ?? cliente.nome ?? '—');
  }

  private async aplicarCnaesCliente(
    cliente: Cliente,
    dto: { cnaePrincipal?: string | null; cnaePrincipalDescricao?: string | null; cnaesSecundarios?: CnaeSecundarioInput[] | null },
  ) {
    if (dto.cnaePrincipal !== undefined) {
      const codigo = (dto.cnaePrincipal ?? '').toString().replace(/\D/g, '') || null;
      cliente.cnaePrincipal = codigo;
      cliente.cnaePrincipalDescricao = null;
      if (codigo) {
        const [catalogo] = await this.cnpjService.obterCnaesPorCodigos([codigo]);
        cliente.cnaePrincipalDescricao = dto.cnaePrincipalDescricao || catalogo?.descricao || null;
      }
      await this.clientes.save(cliente);
    }

    if (dto.cnaesSecundarios !== undefined && dto.cnaesSecundarios !== null) {
      const itens = dto.cnaesSecundarios
        .map((item) => (typeof item === 'string' ? { codigo: item, descricao: null as string | null } : { codigo: item?.codigo ?? '', descricao: item?.descricao ?? null }))
        .map((item) => ({ codigo: item.codigo.toString().replace(/\D/g, ''), descricao: item.descricao }))
        .filter((item) => item.codigo && item.codigo !== cliente.cnaePrincipal);

      const unicos = new Map(itens.map((item) => [item.codigo, item]));
      const catalogo = await this.cnpjService.obterCnaesPorCodigos([...unicos.keys()]);

      await this.clienteCnaes.delete({ clienteId: cliente.id });
      const registros = [...unicos.values()].map((item) =>
        this.clienteCnaes.create({
          clienteId: cliente.id,
          codigo: item.codigo,
          descricao: item.descricao || catalogo.find((c) => c.codigo === item.codigo)?.descricao || null,
        }),
      );
      if (registros.length) await this.clienteCnaes.save(registros);
    }
  }

  private mapDto(dto: CreateClienteDto | UpdateClienteDto) {
    return {
      tipoPessoa: dto.tipoPessoa,
      nome: dto.nome ?? undefined,
      cpf: dto.cpf ?? undefined,
      dataNascimento: dto.dataNascimento !== undefined ? (dto.dataNascimento ? new Date(dto.dataNascimento) : null) : undefined,
      email: dto.email ?? undefined,
      cnpj: dto.cnpj ?? undefined,
      razaoSocial: dto.razaoSocial ?? undefined,
      nomeFantasia: dto.nomeFantasia ?? undefined,
      porteEmpresa: dto.porteEmpresa ?? undefined,
      situacaoCadastral: dto.situacaoCadastral ?? undefined,
      telefone: dto.telefone ?? undefined,
      cep: dto.cep ?? undefined,
      logradouro: dto.logradouro ?? undefined,
      numero: dto.numero ?? undefined,
      complemento: dto.complemento ?? undefined,
      bairro: dto.bairro ?? undefined,
      municipio: dto.municipio ?? undefined,
      uf: dto.uf ?? undefined,
      inscricaoEstadual: dto.inscricaoEstadual ?? undefined,
      inscricaoMunicipal: dto.inscricaoMunicipal ?? undefined,
      naturezaJuridicaCodigo: dto.naturezaJuridicaCodigo ?? undefined,
      naturezaJuridicaDescricao: dto.naturezaJuridicaDescricao ?? undefined,
      ativo: dto.ativo ?? undefined,
    };
  }

  private normalizarClienteAdmin(cliente: Cliente & { usuarioPrincipal?: Usuario | null }) {
    return {
      ...cliente,
      nome: this.nomeExibicao(cliente),
      emailVerificado: cliente.usuarioPrincipal?.emailVerificado ?? false,
      usuarioPrincipalId: cliente.proprietarioId,
      cnaesSecundarios: (cliente.cnaesSecundarios ?? []).map((c) => c.codigo),
      cnaesSecundariosDetalhe: (cliente.cnaesSecundarios ?? []).map((c) => ({ codigo: c.codigo, descricao: c.descricao })),
    };
  }

  async findAll(pagina = 1, limite = 20, busca?: string, filtros?: any, ordenacao?: string) {
    const baseWhere: any = {};
    if (filtros?.tipoPessoa) baseWhere.tipoPessoa = filtros.tipoPessoa;
    if (filtros?.ativoStatus !== undefined && filtros.ativoStatus !== '') {
      const valor = Array.isArray(filtros.ativoStatus) ? filtros.ativoStatus[0] : filtros.ativoStatus;
      baseWhere.ativo = Number(valor) === 1;
    }
    if (filtros?.nome) baseWhere.nome = ILike(`%${filtros.nome}%`);
    if (filtros?.email) baseWhere.email = ILike(`%${filtros.email}%`);
    if (filtros?.cpf) baseWhere.cpf = ILike(`%${filtros.cpf}%`);
    if (filtros?.cnpj) baseWhere.cnpj = ILike(`%${filtros.cnpj}%`);

    let where: any = baseWhere;
    if (busca) {
      where = [
        { ...baseWhere, nome: ILike(`%${busca}%`) },
        { ...baseWhere, razaoSocial: ILike(`%${busca}%`) },
        { ...baseWhere, nomeFantasia: ILike(`%${busca}%`) },
        { ...baseWhere, email: ILike(`%${busca}%`) },
        { ...baseWhere, cnpj: ILike(`%${busca}%`) },
        { ...baseWhere, cpf: ILike(`%${busca}%`) },
      ];
    }

    const camposOrdenaveis = ['nome', 'email', 'criadoEm', 'razaoSocial', 'nomeFantasia'];
    let order: any = { criadoEm: 'DESC' };
    if (ordenacao) {
      const desc = ordenacao.startsWith('-');
      const campo = desc ? ordenacao.slice(1) : ordenacao;
      if (camposOrdenaveis.includes(campo)) order = { [campo]: desc ? 'DESC' : 'ASC' };
    }

    const [items, total] = await this.clientes.findAndCount({
      where,
      order,
      skip: (pagina - 1) * limite,
      take: limite,
      relations: ['assinaturas', 'assinaturas.plano', 'cnaesSecundarios'],
    });

    const principalIds = items.map((item) => item.proprietarioId).filter(Boolean) as string[];
    const principais = principalIds.length ? await this.usuarios.find({ where: principalIds.map((id) => ({ id })) }) : [];
    const principalMap = new Map(principais.map((usuario) => [usuario.id, usuario]));

    return [items.map((item) => this.normalizarClienteAdmin({ ...item, usuarioPrincipal: item.proprietarioId ? principalMap.get(item.proprietarioId) ?? null : null } as any)), total] as const;
  }

  async findOne(id: string) {
    const cliente = await this.clientes.findOne({
      where: { id },
      relations: ['assinaturas', 'assinaturas.plano', 'assinaturas.token', 'assinaturas.faturas', 'cnaesSecundarios'],
    });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    const usuarioPrincipal = cliente.proprietarioId ? await this.usuarios.findOne({ where: { id: cliente.proprietarioId } }) : null;
    return this.normalizarClienteAdmin({ ...cliente, usuarioPrincipal } as any);
  }

  async createAdmin(dto: CreateClienteDto) {
    const payload = this.mapDto(dto);
    const cliente = this.clientes.create({
      ...payload,
      proprietarioId: null,
      ativo: payload.ativo ?? true,
      onboardingPendente: true,
    });
    if (dto.tipoPessoa === 'J') cliente.nome = null;
    await this.clientes.save(cliente);
    await this.aplicarCnaesCliente(cliente, {
      cnaePrincipal: dto.cnaePrincipal,
      cnaePrincipalDescricao: dto.cnaePrincipalDescricao,
      cnaesSecundarios: dto.cnaesSecundarios,
    });
    return { id: cliente.id };
  }

  async updateAdmin(id: string, dto: UpdateClienteDto) {
    const cliente = await this.clientes.findOne({ where: { id } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');

    const payload = this.mapDto(dto);
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined) (cliente as any)[key] = value;
    });
    if ((dto.tipoPessoa ?? cliente.tipoPessoa) === 'J') cliente.nome = null;
    await this.clientes.save(cliente);
    await this.aplicarCnaesCliente(cliente, {
      cnaePrincipal: dto.cnaePrincipal,
      cnaePrincipalDescricao: dto.cnaePrincipalDescricao,
      cnaesSecundarios: dto.cnaesSecundarios,
    });
    return this.findOne(id);
  }

  async criarUsuarioPrincipal(id: string) {
    const cliente = await this.clientes.findOne({ where: { id } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    if (cliente.proprietarioId) throw new BadRequestException('Cliente já possui usuário principal.');
    if (!cliente.email) throw new BadRequestException('Cliente sem e-mail de contato para criar o usuário principal.');

    const existe = await this.usuarios.findOne({ where: { email: cliente.email } });
    if (existe) throw new BadRequestException('Já existe um usuário com este e-mail.');

    const senhaTemporaria = randomBytes(12).toString('hex');
    const usuario = this.usuarios.create({
      clienteId: cliente.id,
      nome: cliente.tipoPessoa === 'F'
        ? (cliente.nome ?? 'Usuário Principal')
        : (cliente.nomeFantasia ?? cliente.razaoSocial ?? 'Usuário Principal'),
      email: cliente.email,
      senhaHash: await bcrypt.hash(senhaTemporaria, 10),
      telefone: cliente.telefone ?? null,
      cpf: cliente.tipoPessoa === 'F' ? (cliente.cpf ?? null) : null,
      dataNascimento: cliente.tipoPessoa === 'F' ? (cliente.dataNascimento ?? null) : null,
      perfil: 'cliente',
      ativo: true,
      emailVerificado: true,
      onboardingPendente: true,
    });
    await this.usuarios.save(usuario);

    cliente.proprietarioId = usuario.id;
    await this.clientes.save(cliente);
    await this.usuariosService.enviarResetPorAdmin(usuario.id);

    return {
      id: usuario.id,
      clienteId: cliente.id,
      email: usuario.email,
      nome: usuario.nome,
      mensagem: 'Usuário principal criado com sucesso.',
    };
  }

  async ativar(id: string, ativo: boolean) {
    const cliente = await this.clientes.findOne({ where: { id } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    cliente.ativo = ativo;
    await this.clientes.save(cliente);
    await this.usuarios.update({ clienteId: id }, { ativo });
    return { mensagem: ativo ? 'Cliente ativado.' : 'Cliente bloqueado.' };
  }

  private temPlanoPagoAtivo(assinaturas: Array<{ status?: string | null; plano?: { precoMensal?: number | null } | null }> = []) {
    return assinaturas.some((assinatura) => assinatura?.status === 'ativa' && Number(assinatura?.plano?.precoMensal ?? 0) > 0);
  }

  private async anonimizarCliente(cliente: Cliente) {
    cliente.ativo = false;
    cliente.proprietarioId = null;
    cliente.nome = cliente.tipoPessoa === 'F' ? `Cliente ${cliente.id.slice(0, 8)}` : null;
    cliente.cpf = null;
    cliente.dataNascimento = null;
    cliente.email = cliente.email ? `${cliente.id}@anonimizado.invalid` : null;
    cliente.cnpj = null;
    cliente.razaoSocial = null;
    cliente.nomeFantasia = null;
    cliente.porteEmpresa = null;
    cliente.situacaoCadastral = null;
    cliente.telefone = null;
    cliente.cep = null;
    cliente.logradouro = null;
    cliente.numero = null;
    cliente.complemento = null;
    cliente.bairro = null;
    cliente.municipio = null;
    cliente.uf = null;
    cliente.inscricaoEstadual = null;
    cliente.inscricaoMunicipal = null;
    cliente.cnaePrincipal = null;
    cliente.cnaePrincipalDescricao = null;
    cliente.naturezaJuridicaCodigo = null;
    cliente.naturezaJuridicaDescricao = null;
    cliente.agendarExclusaoEm = null;
    await this.clientes.save(cliente);
    await this.clienteCnaes.delete({ clienteId: cliente.id });
    await this.usuarios.update({ clienteId: cliente.id }, { ativo: false, agendarExclusaoEm: null });
  }

  async agendarExclusao(id: string, dto: AgendarExclusaoDto) {
    const cliente = await this.clientes.findOne({
      where: { id },
      relations: ['assinaturas', 'assinaturas.plano'],
    });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');

    if (!this.temPlanoPagoAtivo(cliente.assinaturas)) {
      await this.anonimizarCliente(cliente);
      return { mensagem: 'Cliente excluído e dados anonimizados.', tipoFluxo: 'exclusao-imediata' as const, agendarExclusaoEm: null };
    }

    const assinaturaAtiva = cliente.assinaturas
      .filter((assinatura) => assinatura.status === 'ativa' && assinatura.proximoVencimento)
      .sort((a, b) => new Date(a.proximoVencimento as any).getTime() - new Date(b.proximoVencimento as any).getTime())[0];

    const data = dto.agendarPara === 'fim-plano' && assinaturaAtiva?.proximoVencimento
      ? new Date(assinaturaAtiva.proximoVencimento as any)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    cliente.agendarExclusaoEm = data;
    await this.clientes.save(cliente);
    return { mensagem: `Anonimização agendada para ${data.toLocaleDateString('pt-BR')}.`, tipoFluxo: 'anonimizacao-agendada' as const, agendarExclusaoEm: data };
  }

  async cancelarExclusao(id: string) {
    const cliente = await this.clientes.findOne({ where: { id } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    if (!cliente.agendarExclusaoEm) throw new BadRequestException('Cliente sem exclusão agendada.');
    cliente.agendarExclusaoEm = null;
    await this.clientes.save(cliente);
    return { mensagem: 'Exclusão agendada cancelada.', agendarExclusaoEm: null };
  }

  sanitizeAdminResponse<T extends Record<string, any>>(cliente: T) {
    const { usuarioPrincipal, ...safe } = cliente as any;
    return safe;
  }
}
