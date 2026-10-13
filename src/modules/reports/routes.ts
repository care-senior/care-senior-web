import { paths, type AppRoute } from '@/shared/routing';

export const reportsRoutes: AppRoute[] = [
  {
    path: paths.reports,
    handle: { title: 'Relatórios', subtitle: 'Indicadores da clínica' },
    lazy: async () => ({
      Component: (await import('./pages/ReportsPage')).ReportsPage,
    }),
  },
];
