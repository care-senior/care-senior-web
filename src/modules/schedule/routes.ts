import { paths, type AppRoute } from '@/shared/routing';

export const scheduleRoutes: AppRoute[] = [
  {
    path: paths.schedule,
    handle: {
      title: 'Agenda & Rotinas',
      subtitle: 'Planejamento semanal e recorrente',
    },
    lazy: async () => ({
      Component: (await import('./pages/SchedulePage')).SchedulePage,
    }),
  },
];
