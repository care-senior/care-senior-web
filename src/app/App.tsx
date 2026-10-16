import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { connectSessionToHttpClient } from '@/modules/auth';

import { AppProviders } from './providers/AppProviders';
import { routes } from './router/routes';

connectSessionToHttpClient();

const router = createBrowserRouter(routes);

export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
