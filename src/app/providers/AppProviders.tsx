import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState, type ReactNode } from 'react';

import { session } from '@/modules/auth';
import { ToastProvider } from '@/shared/ui';

import { createQueryClient } from './query-client';

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  useEffect(() => session.onEnd(() => queryClient.clear()), [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
