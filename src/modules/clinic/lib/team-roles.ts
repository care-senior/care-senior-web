import type { BadgeTone } from '@/shared/ui';

/** Texto institucional do protótipo; não vem da API. */
export const teamRoles: readonly {
    label: string;
    tone: BadgeTone;
    dot: boolean;
    description: string;
}[] = [
        { label: 'Coordenadora', tone: 'role', dot: true, description: 'gerencia tudo' },
        { label: 'Enfermeira', tone: 'role', dot: true, description: 'gerencia tudo' },
        { label: 'Cuidador', tone: 'neutral', dot: false, description: 'operação diária' },
    ];
