import { paths, type AppRoute } from '@/shared/routing';

export const staffRoutes: AppRoute[] = [
  {
    path: paths.staff,
    handle: { title: 'Colaboradores', subtitle: 'Cadastro e papéis da equipe' },
    lazy: async () => ({
      Component: (await import('./pages/StaffPage')).StaffPage,
    }),
  },
];
