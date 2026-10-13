import { paths, type AppRoute } from '@/shared/routing';

export const residentsRoutes: AppRoute[] = [
  {
    path: paths.residents,
    handle: { title: 'Idosos', subtitle: 'Idosos vinculados a esta clínica' },
    lazy: async () => ({
      Component: (await import('./pages/ResidentsPage')).ResidentsPage,
    }),
  },
];
