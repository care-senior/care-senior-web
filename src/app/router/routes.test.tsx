import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { paths } from '@/shared/routing';
import { renderRoutes } from '@/test/render';

import { routes } from './routes';

describe('rotas da aplicação', () => {
  it('abre o dashboard na raiz, com o item do menu ativo', async () => {
    renderRoutes(routes, paths.dashboard);

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Dashboard' }),
    ).toBeInTheDocument();
    const menu = screen.getByRole('navigation', { name: 'Menu principal' });
    expect(
      within(menu).getByRole('link', { name: /Dashboard/ }),
    ).toHaveAttribute('aria-current', 'page');
    await waitFor(() => {
      expect(document.title).toBe('Dashboard · Care Senior');
    });
  });

  it('navega pelo menu lateral e atualiza a topbar', async () => {
    const user = userEvent.setup();
    const { router } = renderRoutes(routes, paths.dashboard);
    await screen.findByRole('heading', { level: 1, name: 'Dashboard' });

    await user.click(screen.getByRole('link', { name: /Solicitações/ }));

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Solicitações' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Vínculo e saída aguardando decisão'),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(paths.requests);
  });

  it('mostra página de não encontrado para URL desconhecida', async () => {
    renderRoutes(routes, '/nao-existe');

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Página não encontrada',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Voltar ao dashboard' }),
    ).toBeInTheDocument();
  });
});
