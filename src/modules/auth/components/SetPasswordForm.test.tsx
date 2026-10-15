import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw/http';

import { paths } from '@/shared/routing';
import { nestError } from '@/test/msw/auth';
import { server } from '@/test/msw/server';
import { renderRoutes } from '@/test/render';

import { authRoutes } from '../routes';

import { AuthLayout } from './AuthLayout';

const routes = [{ element: <AuthLayout />, children: authRoutes }];

async function choosePassword(password: string, confirmation = password) {
  const user = userEvent.setup();
  await user.type(await screen.findByLabelText('Nova senha'), password);
  await user.type(screen.getByLabelText('Confirme a nova senha'), confirmation);
  await user.click(screen.getByRole('button', { name: 'Criar senha' }));
}

describe('páginas de criar senha', () => {
  it('cria a senha do colaborador com o token do convite', async () => {
    let body: unknown;
    server.use(
      http.post('*/api/v1/auth/staff/accept-invite', async ({ request }) => {
        body = await request.json();
        return new HttpResponse(null, { status: 204 });
      }),
    );
    renderRoutes(routes, `${paths.staffInvite}?token=invite-token`);

    await choosePassword('senhaNova123');

    expect(await screen.findByText(/Senha criada!/)).toBeInTheDocument();
    expect(body).toEqual({ token: 'invite-token', password: 'senhaNova123' });
    expect(
      screen.getByRole('link', { name: 'Ir para o login' }),
    ).toBeInTheDocument();
  });

  it('pede que as duas senhas sejam iguais', async () => {
    renderRoutes(routes, `${paths.staffInvite}?token=invite-token`);

    await choosePassword('senhaNova123', 'outraSenha123');

    expect(
      screen.getByLabelText('Confirme a nova senha'),
    ).toHaveAccessibleDescription('As senhas não são iguais.');
  });

  it('explica quando o convite expirou ou já foi usado', async () => {
    server.use(
      http.post('*/api/v1/auth/staff/accept-invite', () =>
        nestError(400, 'Invalid or expired token'),
      ),
    );
    renderRoutes(routes, `${paths.staffInvite}?token=old-token`);

    await choosePassword('senhaNova123');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Este convite é inválido',
    );
  });

  it('não mostra o formulário sem token no link', async () => {
    renderRoutes(routes, paths.resetPassword);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Este link é inválido',
    );
    expect(screen.queryByLabelText('Nova senha')).not.toBeInTheDocument();
  });

  it('manda o responsável de volta para o app depois de criar a senha', async () => {
    server.use(
      http.post(
        '*/api/v1/auth/guardian/accept-invite',
        () => new HttpResponse(null, { status: 204 }),
      ),
    );
    renderRoutes(routes, `${paths.guardianInvite}?token=invite-token`);

    await choosePassword('senhaNova123');

    expect(
      await screen.findByText(/Abra o app Care Senior/),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /login/ }),
    ).not.toBeInTheDocument();
  });
});
