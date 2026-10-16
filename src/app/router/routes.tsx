import { AuthLayout, authRoutes, RequireSession } from '@/modules/auth';
import { clinicRoutes } from '@/modules/clinic';
import { dashboardRoutes } from '@/modules/dashboard';
import { reportsRoutes } from '@/modules/reports';
import { requestsRoutes } from '@/modules/requests';
import { residentsRoutes } from '@/modules/residents';
import { roomsRoutes } from '@/modules/rooms';
import { scheduleRoutes } from '@/modules/schedule';
import { staffRoutes } from '@/modules/staff';
import type { AppRoute } from '@/shared/routing';

import { AppShell } from '../layout/AppShell';

import { NotFoundPage } from './NotFoundPage';
import { RouteError } from './RouteError';

/**
 * Árvore de rotas: cada módulo exporta as suas (com página em lazy, então
 * cada módulo vira um chunk próprio) e o app só as compõe dentro do layout.
 */
export const routes: AppRoute[] = [
  {
    element: <AuthLayout />,
    errorElement: <RouteError />,
    children: authRoutes,
  },
  {
    element: (
      <RequireSession>
        <AppShell />
      </RequireSession>
    ),
    errorElement: <RouteError />,
    children: [
      {
        errorElement: <RouteError />,
        children: [
          ...dashboardRoutes,
          ...staffRoutes,
          ...residentsRoutes,
          ...roomsRoutes,
          ...scheduleRoutes,
          ...requestsRoutes,
          ...reportsRoutes,
          ...clinicRoutes,
          {
            path: '*',
            handle: { title: 'Página não encontrada' },
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
];
