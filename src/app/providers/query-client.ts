import { QueryClient } from '@tanstack/react-query';

import { toApiError } from '@/shared/api/api-error';

const MAX_RETRIES = 2;

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        // Erro 4xx não melhora tentando de novo; rede/5xx sim.
        retry: (failureCount, error) =>
          !toApiError(error).isClientError && failureCount < MAX_RETRIES,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
