import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Modal } from './Modal';

describe('Modal', () => {
  it('não renderiza conteúdo fechado', () => {
    render(
      <Modal open={false} onClose={() => {}} title="Novo colaborador">
        corpo
      </Modal>,
    );

    expect(screen.queryByText('corpo')).not.toBeInTheDocument();
  });

  it('mostra título, descrição e corpo quando aberto', () => {
    render(
      <Modal
        open
        onClose={() => {}}
        title="Novo colaborador"
        description="Cadastra o acesso e o cargo dentro da clínica."
      >
        corpo
      </Modal>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Novo colaborador' });
    expect(dialog).toHaveAccessibleDescription(
      'Cadastra o acesso e o cargo dentro da clínica.',
    );
    expect(screen.getByText('corpo')).toBeInTheDocument();
  });

  it('chama onClose pelo botão de fechar', async () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} title="Trocar quarto" />);

    await userEvent.click(screen.getByRole('button', { name: 'Fechar' }));

    expect(onClose).toHaveBeenCalledOnce();
  });
});
