import axios, { type AxiosRequestConfig } from 'axios';

import { env } from '@/shared/config/env';

import { toApiError, type ApiError } from './api-error';

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

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(undefined, (error: unknown) =>
  Promise.reject(toApiError(error)),
);

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
