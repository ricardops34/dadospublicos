import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assinatura } from '../../entities/assinatura.entity';
import { RECURSO_PORTAL_KEY } from './recurso.decorator';

@Injectable()
export class RecursoGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(Assinatura, 'buscadados')
    private readonly assinaturas: Repository<Assinatura>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const recursosRequeridos = this.reflector.getAllAndOverride<string[]>(RECURSO_PORTAL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!recursosRequeridos?.length) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const usuario = req['usuario'];

    if (!usuario) {
      throw new ForbiddenException('Sessao do portal nao encontrada.');
    }

    if (usuario.perfil === 'admin') {
      return true;
    }

    const clienteId = usuario.clienteId ?? usuario.contaId ?? null;
    if (!clienteId) {
      throw new ForbiddenException('Nenhum cliente vinculado encontrado para este usuário.');
    }

    const assinatura = await this.assinaturas.findOne({
      where: { clienteId, status: 'ativa' },
      relations: ['plano', 'plano.recursos', 'plano.recursos.recurso'],
    });

    if (!assinatura?.plano) {
      throw new ForbiddenException('Nenhum plano ativo encontrado para este cliente.');
    }

    const recursosAtivos = new Set(
      (assinatura.plano.recursos ?? [])
        .filter((item) => item.recurso?.ativo)
        .map((item) => item.recurso.slug),
    );

    if (!recursosRequeridos.every((recurso) => recursosAtivos.has(recurso))) {
      throw new ForbiddenException('Seu plano atual nao possui acesso a este recurso.');
    }

    req['recursosPlanoAtivo'] = [...recursosAtivos];
    return true;
  }
}
