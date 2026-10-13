import { paths, type AppRoute } from '@/shared/routing';

export const roomsRoutes: AppRoute[] = [
  {
    path: paths.rooms,
    handle: { title: 'Quartos', subtitle: 'Ocupação por andar e ala' },
    lazy: async () => ({
      Component: (await import('./pages/RoomsPage')).RoomsPage,
    }),
  },
];
