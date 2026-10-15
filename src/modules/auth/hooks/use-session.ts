import { useEffect, useSyncExternalStore } from 'react';

import type { AuthUserDto } from '@/shared/api/generated/model';

import { session, type SessionState } from '../session/session';

export function useSession(): SessionState {
  return useSyncExternalStore(session.subscribe, session.getState);
}

/** Estado da sessão depois de tentar recuperá-la pelo cookie (reload, nova aba). */
export function useRestoredSession(): SessionState {
  useEffect(() => {
    void session.restore();
  }, []);
  return useSession();
}

/** Só para telas dentro de `RequireSession`, onde a sessão já existe. */
export function useCurrentUser(): AuthUserDto {
  const state = useSession();
  if (state.status !== 'authenticated') {
    throw new Error('useCurrentUser usado fora de uma rota autenticada.');
  }
  return state.user;
}
