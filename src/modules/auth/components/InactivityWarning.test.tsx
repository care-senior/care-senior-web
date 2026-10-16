import { act, fireEvent, render, screen } from '@testing-library/react';

import {
  INACTIVITY_LIMIT_MS,
  markActivity,
  readLastActivity,
} from '../session/inactivity';
import { session } from '../session/session';

import { InactivityWarning } from './InactivityWarning';

describe('InactivityWarning', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('avisa no último minuto e mantém a sessão se o colaborador continuar', () => {
    markActivity(Date.now() - INACTIVITY_LIMIT_MS + 30_000);
    render(<InactivityWarning />);

    act(() => {
      vi.advanceTimersByTime(1_000);
    });
    expect(
      screen.getByRole('dialog', { name: 'Você ainda está aí?' }),
    ).toHaveAccessibleDescription(/29 segundos/);

    fireEvent.click(
      screen.getByRole('button', { name: 'Continuar conectado' }),
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(readLastActivity()).toBe(Date.now());
  });

  it('encerra a sessão quando o tempo acaba', () => {
    const signOut = vi.spyOn(session, 'signOut').mockResolvedValue();
    markActivity(Date.now() - INACTIVITY_LIMIT_MS + 2_000);
    render(<InactivityWarning />);

    act(() => {
      vi.advanceTimersByTime(3_000);
    });

    expect(signOut).toHaveBeenCalledWith('inactivity');
  });
});
