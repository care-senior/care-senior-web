import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

import { useRestoredSession } from '../hooks/use-session';
import { loginPathFor } from '../utils/redirect';

import { InactivityWarning } from './InactivityWarning';
import { SessionSplash } from './SessionSplash';

export function RequireSession({ children }: { children: ReactNode }) {
  const state = useRestoredSession();
  const location = useLocation();

  if (state.status === 'unknown') return <SessionSplash fullScreen />;
  if (state.status === 'anonymous') {
    return <Navigate to={loginPathFor(location)} replace />;
  }
  return (
    <>
      {children}
      <InactivityWarning />
    </>
  );
}
