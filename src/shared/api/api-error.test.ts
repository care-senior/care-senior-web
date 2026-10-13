import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios';

import { ApiError, toApiError } from './api-error';

function axiosErrorWith(status: number, data: unknown) {
  const response = {
    status,
    data,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
  } satisfies AxiosResponse;
  return new AxiosError(
    'Request failed',
    'ERR_BAD_REQUEST',
    undefined,
    null,
    response,
  );
}

describe('toApiError', () => {
  it('lê o corpo de erro do NestJS', () => {
    const error = toApiError(
      axiosErrorWith(404, {
        statusCode: 404,
        message: 'Resident not found',
        error: 'Not Found',
      }),
    );

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(404);
    expect(error.isNotFound).toBe(true);
    expect(error.message).toBe('Resident not found');
  });

  it('mantém cada mensagem do ValidationPipe', () => {
    const error = toApiError(
      axiosErrorWith(400, {
        statusCode: 400,
        message: ['name should not be empty', 'age must be an integer'],
        error: 'Bad Request',
      }),
    );

    expect(error.messages).toEqual([
      'name should not be empty',
      'age must be an integer',
    ]);
    expect(error.isClientError).toBe(true);
  });

  it('trata falha de rede (sem resposta)', () => {
    const error = toApiError(new AxiosError('Network Error', 'ERR_NETWORK'));

    expect(error.status).toBeUndefined();
    expect(error.message).toBe('Não foi possível conectar ao servidor.');
  });
});
