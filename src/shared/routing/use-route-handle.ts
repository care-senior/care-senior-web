import { useEffect } from 'react';
import { useMatches } from 'react-router';

import { isRouteHandle, type RouteHandle } from './route-handle';

export const APP_NAME = 'Care Senior';

export function useRouteHandle(): RouteHandle | undefined {
  return useMatches()
    .map((match) => match.handle)
    .findLast(isRouteHandle);
}

export function useDocumentTitle(title: string | undefined) {
  useEffect(() => {
    document.title = title ? `${title} · ${APP_NAME}` : APP_NAME;
  }, [title]);
}
