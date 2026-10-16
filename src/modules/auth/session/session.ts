import { toApiError } from '@/shared/api/api-error';
import {
  authLoginStaff,
  authLogout,
  authRefresh,
} from '@/shared/api/generated/endpoints';
import type {
  AuthResponseDto,
  AuthUserDto,
  LoginDto,
} from '@/shared/api/generated/model';
import {
  setAccessTokenGetter,
  setUnauthorizedHandler,
} from '@/shared/api/http-client';

import { clearActivity, markActivity, msUntilInactive } from './inactivity';

export type SessionEndReason = 'signedOut' | 'expired' | 'inactivity';

export type SessionState =
  | { status: 'unknown' }
  | { status: 'anonymous'; endReason?: SessionEndReason }
  | { status: 'authenticated'; user: AuthUserDto };

type SessionMessage =
  { type: 'signedIn' } | { type: 'signedOut'; reason: SessionEndReason };

export interface Session {
  getState: () => SessionState;
  getAccessToken: () => string | undefined;
  subscribe: (listener: () => void) => () => void;
  onEnd: (listener: () => void) => () => void;
  restore: () => Promise<void>;
  signIn: (credentials: LoginDto) => Promise<void>;
  signOut: (reason?: SessionEndReason) => Promise<void>;
  refresh: () => Promise<boolean>;
  renewAfterUnauthorized: (
    rejectedAccessToken: string | undefined,
  ) => Promise<boolean>;
}

interface SessionOptions {
  channelName?: string;
  lockName?: string;
}

/**
 * Cada `POST /auth/refresh` troca o refresh token, e reapresentar um já usado
 * derruba a sessão inteira na API. Por isso a renovação roda uma por vez: na
 * aba (todos os 401 simultâneos esperam a mesma) e entre abas (Web Locks), e
 * a próxima aba só renova depois que o cookie novo já chegou.
 */
function runExclusively<T>(lockName: string, task: () => Promise<T>) {
  const locks = navigator.locks as LockManager | undefined;
  return locks ? locks.request(lockName, task) : task();
}

export function createSession({
  channelName = 'care-senior:session',
  lockName = 'care-senior:session-refresh',
}: SessionOptions = {}): Session {
  let state: SessionState = { status: 'unknown' };
  let accessToken: string | undefined;
  let restoring: Promise<void> | undefined;
  let refreshing: Promise<boolean> | undefined;
  let signingOut: Promise<void> | undefined;
  const listeners = new Set<() => void>();
  const endListeners = new Set<() => void>();
  const channel =
    typeof BroadcastChannel === 'undefined'
      ? undefined
      : new BroadcastChannel(channelName);

  function setState(next: SessionState) {
    state = next;
    listeners.forEach((listener) => listener());
  }

  function establish(response: AuthResponseDto) {
    accessToken = response.accessToken;
    setState({ status: 'authenticated', user: response.user });
  }

  function end(endReason?: SessionEndReason) {
    const wasAuthenticated = state.status === 'authenticated';
    accessToken = undefined;
    clearActivity();
    setState({ status: 'anonymous', endReason });
    if (wasAuthenticated) endListeners.forEach((listener) => listener());
  }

  async function requestRefresh() {
    try {
      establish(await authRefresh({}));
      return true;
    } catch (error) {
      if (toApiError(error).isUnauthorized) {
        end(state.status === 'authenticated' ? 'expired' : undefined);
      }
      return false;
    }
  }

  function refresh() {
    refreshing ??= runExclusively(lockName, requestRefresh).finally(() => {
      refreshing = undefined;
    });
    return refreshing;
  }

  async function restoreFromCookie() {
    if (msUntilInactive() <= 0) {
      await authLogout({}).catch(() => undefined);
      end('inactivity');
      return;
    }
    const renewed = await refresh();
    if (renewed) markActivity();
    else if (state.status === 'unknown') end();
  }

  channel?.addEventListener(
    'message',
    (event: MessageEvent<SessionMessage>) => {
      const message = event.data;
      if (message.type === 'signedOut' && state.status === 'authenticated') {
        end(message.reason);
      }
      if (message.type === 'signedIn' && state.status !== 'authenticated') {
        void refresh();
      }
    },
  );

  return {
    getState: () => state,
    getAccessToken: () => accessToken,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    onEnd(listener) {
      endListeners.add(listener);
      return () => endListeners.delete(listener);
    },
    restore() {
      if (state.status !== 'unknown') return Promise.resolve();
      restoring ??= restoreFromCookie();
      return restoring;
    },
    async signIn(credentials) {
      establish(await authLoginStaff(credentials));
      markActivity();
      channel?.postMessage({ type: 'signedIn' } satisfies SessionMessage);
    },
    signOut(reason = 'signedOut') {
      signingOut ??= (async () => {
        await authLogout({}).catch(() => undefined);
        end(reason);
        channel?.postMessage({
          type: 'signedOut',
          reason,
        } satisfies SessionMessage);
      })().finally(() => {
        signingOut = undefined;
      });
      return signingOut;
    },
    refresh,
    renewAfterUnauthorized(rejectedAccessToken) {
      if (accessToken && accessToken !== rejectedAccessToken) {
        return Promise.resolve(true);
      }
      return refresh();
    },
  };
}

export const session = createSession();

export function connectSessionToHttpClient() {
  setAccessTokenGetter(session.getAccessToken);
  setUnauthorizedHandler(session.renewAfterUnauthorized);
}
