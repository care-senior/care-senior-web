import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http } from 'msw/http';

import { paths, type AppRoute } from '@/shared/routing';
import { authHandlers, nestError, staffUser } from '@/test/msw/auth';
import { server } from '@/test/msw/server';
import { renderRoutes } from '@/test/render';

import { AuthLayout } from '../components/AuthLayout';
import { RequireSession } from '../components/RequireSession';
import { authRoutes } from '../routes';
import { session } from '../session/session';

const testRoutes: AppRoute[] = [
  { element: <AuthLayout />, children: authRoutes },
  {
    path: paths.rooms,
    element: (
      <RequireSession>
        <h1>Quartos</h1>
      </RequireSession>
    ),
  },
];

async function fillAndSubmit(email: string, password: string) {
  const user = userEvent.setup();
  await user.type(await screen.findByLabelText('E-mail'), email);
  await user.type(screen.getByLabelText('Senha'), password);
  await user.click(screen.getByRole('button', { name: 'Entrar' }));
}

describe('LoginPage', () => {
  beforeEach(async () => {
    server.use(authHandlers.logoutSucceeds());
    await session.signOut();
  });

  it('entra e volta para a página que o colaborador tentou abrir', async () => {
    server.use(authHandlers.loginSucceeds());
    const { router } = renderRoutes(
      testRoutes,
      `${paths.login}?redirectTo=%2Fquartos`,
    );

    await fillAndSubmit(staffUser.email, 'careSenior123');

    expect(
      await screen.findByRole('heading', { name: 'Quartos' }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(paths.rooms);
  });

  it('avisa quando e-mail ou senha estão errados', async () => {
    server.use(
      http.post('*/api/v1/auth/staff/login', () =>
        nestError(401, 'Invalid credentials'),
      ),
    );
    renderRoutes(testRoutes, paths.login);

    await fillAndSubmit(staffUser.email, 'senha-errada');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'E-mail ou senha inválidos.',
    );
  });

  it('avisa quando o limite de tentativas foi atingido', async () => {
    server.use(
      http.post('*/api/v1/auth/staff/login', () =>
        nestError(429, 'ThrottlerException: Too Many Requests'),
      ),
    );
    renderRoutes(testRoutes, paths.login);

    await fillAndSubmit(staffUser.email, 'senha-errada');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Muitas tentativas seguidas',
    );
  });

  it('valida os campos antes de chamar a API', async () => {
    const user = userEvent.setup();
    renderRoutes(testRoutes, paths.login);

    await user.click(await screen.findByRole('button', { name: 'Entrar' }));

    expect(screen.getByLabelText('E-mail')).toHaveAccessibleDescription(
      'Informe seu e-mail.',
    );
    expect(screen.getByLabelText('Senha')).toHaveAccessibleDescription(
      'Informe sua senha.',
    );
  });

  it('explica quando a sessão foi encerrada por inatividade', async () => {
    await session.signOut('inactivity');
    renderRoutes(testRoutes, paths.login);

    expect(await screen.findByText(/30 minutos sem uso/)).toBeInTheDocument();
  });
});
