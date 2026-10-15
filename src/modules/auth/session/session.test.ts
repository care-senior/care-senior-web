import { http, HttpResponse } from 'msw/http';

import { authHandlers, authResponse, staffUser } from '@/test/msw/auth';
import { server } from '@/test/msw/server';

import {
  INACTIVITY_LIMIT_MS,
  markActivity,
  readLastActivity,
} from './inactivity';
import { createSession } from './session';

let sessionCount = 0;

function newSession() {
  sessionCount += 1;
  return createSession({
    channelName: `test-session-${sessionCount}`,
    lockName: `test-lock-${sessionCount}`,
  });
}

describe('session', () => {
  it('recupera a sessão pelo cookie ao abrir a página', async () => {
    server.use(authHandlers.refreshSucceeds('restored-token'));
    const session = newSession();

    await session.restore();

    expect(session.getState()).toEqual({
      status: 'authenticated',
      user: staffUser,
    });
    expect(session.getAccessToken()).toBe('restored-token');
    expect(readLastActivity()).toBeDefined();
  });

  it('fica anônima, sem motivo, quando não há sessão para recuperar', async () => {
    server.use(authHandlers.refreshFails());
    const session = newSession();

    await session.restore();

    expect(session.getState()).toEqual({
      status: 'anonymous',
      endReason: undefined,
    });
  });

  it('encerra por inatividade quando a página volta depois de 30 minutos parada', async () => {
    const refresh = vi.fn();
    server.use(
      authHandlers.logoutSucceeds(),
      http.post('*/api/v1/auth/refresh', refresh),
    );
    markActivity(Date.now() - INACTIVITY_LIMIT_MS - 1000);
    const session = newSession();

    await session.restore();

    expect(session.getState()).toEqual({
      status: 'anonymous',
      endReason: 'inactivity',
    });
    expect(refresh).not.toHaveBeenCalled();
  });

  it('faz uma única renovação para vários 401 ao mesmo tempo', async () => {
    let calls = 0;
    server.use(
      http.post('*/api/v1/auth/refresh', () => {
        calls += 1;
        return HttpResponse.json(authResponse(`token-${calls}`));
      }),
    );
    const session = newSession();

    const results = await Promise.all([
      session.renewAfterUnauthorized(undefined),
      session.renewAfterUnauthorized(undefined),
      session.renewAfterUnauthorized(undefined),
    ]);

    expect(results).toEqual([true, true, true]);
    expect(calls).toBe(1);
    expect(session.getAccessToken()).toBe('token-1');
  });

  it('não renova de novo quando o 401 veio de um token que já foi trocado', async () => {
    server.use(authHandlers.loginSucceeds());
    const session = newSession();
    await session.signIn({ email: staffUser.email, password: 'careSenior123' });

    await expect(session.renewAfterUnauthorized('old-token')).resolves.toBe(
      true,
    );
  });

  it('marca a sessão como expirada quando a renovação é recusada', async () => {
    server.use(authHandlers.loginSucceeds(), authHandlers.refreshFails());
    const session = newSession();
    const onEnd = vi.fn();
    session.onEnd(onEnd);
    await session.signIn({ email: staffUser.email, password: 'careSenior123' });

    await expect(session.refresh()).resolves.toBe(false);

    expect(session.getState()).toEqual({
      status: 'anonymous',
      endReason: 'expired',
    });
    expect(session.getAccessToken()).toBeUndefined();
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it('sai chamando o logout da API e limpa a atividade', async () => {
    const logout = vi.fn(() => new HttpResponse(null, { status: 204 }));
    server.use(
      authHandlers.loginSucceeds(),
      http.post('*/api/v1/auth/logout', logout),
    );
    const session = newSession();
    await session.signIn({ email: staffUser.email, password: 'careSenior123' });

    await session.signOut();

    expect(logout).toHaveBeenCalledTimes(1);
    expect(session.getState()).toEqual({
      status: 'anonymous',
      endReason: 'signedOut',
    });
    expect(readLastActivity()).toBeUndefined();
  });

  it('encerra a sessão das outras abas quando uma delas sai', async () => {
    server.use(
      authHandlers.loginSucceeds(),
      authHandlers.refreshSucceeds(),
      authHandlers.logoutSucceeds(),
    );
    const options = {
      channelName: 'test-shared-tabs',
      lockName: 'test-shared-lock',
    };
    const firstTab = createSession(options);
    const secondTab = createSession(options);
    await firstTab.signIn({
      email: staffUser.email,
      password: 'careSenior123',
    });
    await secondTab.signIn({
      email: staffUser.email,
      password: 'careSenior123',
    });

    await firstTab.signOut('inactivity');

    await vi.waitFor(() => {
      expect(secondTab.getState()).toEqual({
        status: 'anonymous',
        endReason: 'inactivity',
      });
    });
  });
});
