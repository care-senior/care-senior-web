import type { Location } from 'react-router';

import { paths } from '@/shared/routing';

export const REDIRECT_PARAM = 'redirectTo';

export function loginPathFor({ pathname, search, hash }: Location) {
  const target = `${pathname}${search}${hash}`;
  if (target === paths.dashboard) return paths.login;
  return `${paths.login}?${new URLSearchParams({ [REDIRECT_PARAM]: target }).toString()}`;
}

/** Só aceita caminhos internos, para o login não virar um redirecionador aberto. */
export function safeRedirectPath(target: string | null) {
  if (
    !target?.startsWith('/') ||
    target.startsWith('//') ||
    target.startsWith('/\\')
  ) {
    return paths.dashboard;
  }
  return target;
}
