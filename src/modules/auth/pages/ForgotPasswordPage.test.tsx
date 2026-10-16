import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw/http';

import { paths } from '@/shared/routing';
import { server } from '@/test/msw/server';
import { renderRoutes } from '@/test/render';

import { AuthLayout } from '../components/AuthLayout';
import { authRoutes } from '../routes';

describe('ForgotPasswordPage', () => {
  it('confirma o envio sem revelar se o e-mail existe', async () => {
    const forgotPassword = vi.fn(() => new HttpResponse(null, { status: 204 }));
    server.use(
      http.post('*/api/v1/auth/staff/forgot-password', forgotPassword),
    );
    const user = userEvent.setup();
    renderRoutes(
      [{ element: <AuthLayout />, children: authRoutes }],
      paths.forgotPassword,
    );

    await user.type(
      await screen.findByLabelText('E-mail'),
      ' Ana@CareSenior.dev ',
    );
    await user.click(screen.getByRole('button', { name: 'Enviar link' }));

    expect(
      await screen.findByRole('heading', { name: 'Confira seu e-mail' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Se Ana@CareSenior.dev estiver cadastrado/),
    ).toBeInTheDocument();
    expect(forgotPassword).toHaveBeenCalledTimes(1);
  });
});
