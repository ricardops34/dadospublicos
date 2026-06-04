import { SetMetadata } from '@nestjs/common';

export const PERFIL_KEY = 'perfil_requerido';
export const Perfil = (...perfis: ('admin' | 'cliente')[]) => SetMetadata(PERFIL_KEY, perfis);
