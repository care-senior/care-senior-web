import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';

import type { AppRoute } from '@/shared/routing';
import { ToastProvider } from '@/shared/ui';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
}

function TestProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={createTestQueryClient()}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );
}

/** Renderiza um componente com os mesmos providers da aplicação. */
export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: TestProviders, ...options });
}

/** Renderiza uma árvore de rotas numa URL inicial, com os providers. */
export function renderRoutes(routes: AppRoute[], initialPath = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] });
  return { router, ...renderWithProviders(<RouterProvider router={router} />) };
}
