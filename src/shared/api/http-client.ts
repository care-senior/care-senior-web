import axios, { isAxiosError, type AxiosRequestConfig } from 'axios';

import { env } from '@/shared/config/env';

import { toApiError, type ApiError } from './api-error';

declare module 'axios' {
  interface AxiosRequestConfig {
    retriedAfterUnauthorized?: boolean;
  }
}

const AUTH_ROUTES_PREFIX = '/api/v1/auth/';
const BEARER_PREFIX = 'Bearer ';

export const axiosInstance = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'x-client-platform': 'web',
  },
});

let getAccessToken: () => string | null | undefined = () => null;

/**
 * Registra de onde vem o token Bearer (a API declara `addBearerAuth`). Quem
 * implementar a autenticação chama isso uma vez — o cliente HTTP não conhece
 * o storage da sessão.
 */
export function setAccessTokenGetter(getter: typeof getAccessToken) {
  getAccessToken = getter;
}

let renewAfterUnauthorized: (
  rejectedAccessToken: string | undefined,
) => Promise<boolean> = () => Promise.resolve(false);

/**
 * Registra quem renova a sessão quando a API responde 401. Se a renovação der
 * certo (`true`), o request é refeito uma única vez com o token novo.
 */
export function setUnauthorizedHandler(handler: typeof renewAfterUnauthorized) {
  renewAfterUnauthorized = handler;
}

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `${BEARER_PREFIX}${token}`;
  return config;
});

axiosInstance.interceptors.response.use(undefined, async (error: unknown) => {
  if (
    isAxiosError(error) &&
    error.response?.status === 401 &&
    error.config &&
    !error.config.retriedAfterUnauthorized &&
    !error.config.url?.startsWith(AUTH_ROUTES_PREFIX)
  ) {
    const { config } = error;
    const authorization = config.headers.Authorization;
    const rejectedAccessToken =
      typeof authorization === 'string'
        ? authorization.replace(BEARER_PREFIX, '')
        : undefined;

    if (await renewAfterUnauthorized(rejectedAccessToken)) {
      return axiosInstance.request({
        ...config,
        retriedAfterUnauthorized: true,
      });
    }
  }
  return Promise.reject(toApiError(error));
});

/**
 * Mutator do Orval: todo hook/função gerado em `./generated` passa por aqui.
 * Devolve só o `data` da resposta e rejeita sempre com `ApiError`.
 */
export const httpClient = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> =>
  axiosInstance.request<T>({ ...config, ...options }).then(({ data }) => data);

/** Tipo de erro que o Orval usa nos hooks gerados. */
export type ErrorType<_Error> = ApiError;

/** Tipo de body que o Orval usa nas mutations geradas. */
export type BodyType<BodyData> = BodyData;
