import type { RouteObject } from 'react-router';

/** Metadados que cada rota publica para o layout (título e subtítulo da topbar). */
export interface RouteHandle {
  title: string;
  subtitle?: string;
}

export type AppRoute = RouteObject & { handle?: RouteHandle };

export function isRouteHandle(handle: unknown): handle is RouteHandle {
  return (
    typeof handle === 'object' &&
    handle !== null &&
    'title' in handle &&
    typeof handle.title === 'string'
  );
}
