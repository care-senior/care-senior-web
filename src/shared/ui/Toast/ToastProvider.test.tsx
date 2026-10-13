import { act, render, screen } from '@testing-library/react';

import { useToast } from './toast-context';
import { ToastProvider } from './ToastProvider';

function SaveButton() {
  const toast = useToast();
  return (
    <button
      type="button"
      onClick={() => toast.success('Colaborador cadastrado.')}
    >
      Salvar
    </button>
  );
}

describe('ToastProvider', () => {
  it('mostra o toast e some depois de alguns segundos', () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <SaveButton />
      </ToastProvider>,
    );

    act(() => {
      screen.getByRole('button', { name: 'Salvar' }).click();
    });
    expect(screen.getByRole('status')).toHaveTextContent(
      'Colaborador cadastrado.',
    );

    act(() => {
      vi.advanceTimersByTime(3200);
    });
    expect(screen.getByRole('status')).toBeEmptyDOMElement();

    vi.useRealTimers();
  });

  it('exige o provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<SaveButton />)).toThrow(/ToastProvider/);
  });
});
