import { http, HttpResponse } from 'msw/http';

import { server } from '@/test/msw/server';

import { ApiError } from './api-error';
import {
  httpClient,
  setAccessTokenGetter,
  setUnauthorizedHandler,
} from './http-client';

const RESIDENTS_URL = '*/api/v1/residents';

describe('httpClient', () => {
  let accessToken = 'expired-token';

  beforeEach(() => {
    accessToken = 'expired-token';
    setAccessTokenGetter(() => accessToken);
  });

  it('renova a sessão e refaz o request com o token novo depois de um 401', async () => {
    server.use(
      http.get(RESIDENTS_URL, ({ request }) =>
        request.headers.get('Authorization') === 'Bearer fresh-token'
          ? HttpResponse.json({ data: [] })
          : HttpResponse.json(
              { statusCode: 401, message: 'Invalid or expired token' },
              { status: 401 },
            ),
      ),
    );
    const handler = vi.fn((rejectedToken: string | undefined) => {
      expect(rejectedToken).toBe('expired-token');
      accessToken = 'fresh-token';
      return Promise.resolve(true);
    });
    setUnauthorizedHandler(handler);

    await expect(
      httpClient({ url: '/api/v1/residents', method: 'GET' }),
    ).resolves.toEqual({ data: [] });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('não tenta renovar quando o 401 vem de uma rota de autenticação', async () => {
    server.use(
      http.post('*/api/v1/auth/staff/login', () =>
        HttpResponse.json(
          { statusCode: 401, message: 'Invalid credentials' },
          { status: 401 },
        ),
      ),
    );
    const handler = vi.fn(() => Promise.resolve(true));
    setUnauthorizedHandler(handler);

    await expect(
      httpClient({ url: '/api/v1/auth/staff/login', method: 'POST', data: {} }),
    ).rejects.toMatchObject({ status: 401 });
    expect(handler).not.toHaveBeenCalled();
  });

  it('rejeita com ApiError quando a sessão não pode ser renovada', async () => {
    server.use(
      http.get(RESIDENTS_URL, () =>
        HttpResponse.json(
          { statusCode: 401, message: 'Session expired' },
          { status: 401 },
        ),
      ),
    );
    setUnauthorizedHandler(() => Promise.resolve(false));

    const request = httpClient({ url: '/api/v1/residents', method: 'GET' });
    await expect(request).rejects.toBeInstanceOf(ApiError);
    await expect(request).rejects.toMatchObject({ isUnauthorized: true });
  });
});
