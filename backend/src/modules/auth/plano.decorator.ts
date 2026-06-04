import { SetMetadata } from '@nestjs/common';
import { Plano } from '../../entities/token.entity';
import { PLANO_KEY } from './auth.guard';

export const PlanoMinimo = (plano: Plano) => SetMetadata(PLANO_KEY, plano);
