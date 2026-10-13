import type { AppRoute } from '@/shared/routing';

export const dashboardRoutes: AppRoute[] = [
  {
    index: true,
    handle: { title: 'Dashboard', subtitle: 'Visão geral da clínica' },
    lazy: async () => ({
      Component: (await import('./pages/DashboardPage')).DashboardPage,
    }),
  },
];
