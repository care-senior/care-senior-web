import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PasswordField } from './PasswordField';

describe('PasswordField', () => {
  it('alterna entre esconder e mostrar a senha', async () => {
    const user = userEvent.setup();
    render(<PasswordField label="Senha" />);
    const input = screen.getByLabelText('Senha');

    expect(input).toHaveAttribute('type', 'password');
    await user.click(screen.getByRole('button', { name: 'Mostrar senha' }));
    expect(input).toHaveAttribute('type', 'text');
    await user.click(screen.getByRole('button', { name: 'Ocultar senha' }));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('liga a mensagem de erro ao campo', () => {
    render(<PasswordField label="Senha" error="Informe sua senha." />);

    const input = screen.getByLabelText('Senha');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Informe sua senha.');
  });
});
