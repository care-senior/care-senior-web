import { toApiError } from '@/shared/api/api-error';

export function authErrorMessage(error: unknown) {
  const apiError = toApiError(error);
  if (apiError.isTooManyRequests) {
    return 'Muitas tentativas seguidas. Aguarde um minuto e tente de novo.';
  }
  if (apiError.status === undefined) {
    return 'Não foi possível conectar ao servidor. Confira sua internet e tente de novo.';
  }
  return 'Não foi possível concluir agora. Tente novamente em instantes.';
}

export function loginErrorMessage(error: unknown) {
  return toApiError(error).isUnauthorized
    ? 'E-mail ou senha inválidos.'
    : authErrorMessage(error);
}

/** A API responde 400 a link de e-mail inválido, expirado ou já usado. */
export function tokenErrorMessage(error: unknown, invalidLinkMessage: string) {
  return toApiError(error).status === 400
    ? invalidLinkMessage
    : authErrorMessage(error);
}
