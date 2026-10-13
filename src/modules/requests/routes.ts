import { paths, type AppRoute } from '@/shared/routing';

export const requestsRoutes: AppRoute[] = [
  {
    path: paths.requests,
    handle: {
      title: 'Solicitações',
      subtitle: 'Vínculo e saída aguardando decisão',
    },
    lazy: async () => ({
      Component: (await import('./pages/RequestsPage')).RequestsPage,
    }),
  },
];
