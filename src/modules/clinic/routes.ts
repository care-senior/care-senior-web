import { paths, type AppRoute } from '@/shared/routing';

export const clinicRoutes: AppRoute[] = [
  {
    path: paths.clinic,
    handle: { title: 'Clínica', subtitle: 'Dados institucionais' },
    lazy: async () => ({
      Component: (await import('./pages/ClinicPage')).ClinicPage,
    }),
  },
];
