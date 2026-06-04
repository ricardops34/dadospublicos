import { SetMetadata } from '@nestjs/common';

export const RECURSO_PORTAL_KEY = 'recurso_portal_requerido';
export const RecursoPortal = (...recursos: string[]) => SetMetadata(RECURSO_PORTAL_KEY, recursos);
