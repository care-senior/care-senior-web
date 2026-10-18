import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw/http';

import type { ClinicResponseDto } from '@/shared/api/generated/model';
import { server } from '@/test/msw/server';
import { renderWithProviders } from '@/test/render';

import { ClinicForm } from './ClinicForm';

const clinic: ClinicResponseDto = {
  id: 'clinic-1',
  name: 'Lar Bem Viver',
  address: 'Rua das Flores, 100',
  phone: '(11) 3333-4444',
  operatingHours: 'Seg a Sex, 8h às 18h',
  activities: ['Fisioterapia'],
  responsiblePeople: 'Dra. Ana',
  whatsappPhone: '(11) 99999-0000',
  latitude: -23.5,
  longitude: -46.6,
};

describe('ClinicForm', () => {
  it('não salva quando o nome da clínica fica só com espaços', async () => {
    const updateClinic = vi.fn(() => HttpResponse.json(clinic));
    server.use(http.patch('*/api/v1/clinics/:id', updateClinic));
    const user = userEvent.setup();
    renderWithProviders(<ClinicForm clinic={clinic} />);

    const name = screen.getByLabelText('Nome da clínica');
    await user.clear(name);
    await user.type(name, '   ');
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }));

    expect(
      await screen.findByText('Informe o nome da clínica.'),
    ).toBeInTheDocument();
    expect(updateClinic).not.toHaveBeenCalled();
  });

  it('salva a atividade digitada mesmo sem apertar Enter', async () => {
    let body: unknown;
    server.use(
      http.patch('*/api/v1/clinics/:id', async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(clinic);
      }),
    );
    const user = userEvent.setup();
    renderWithProviders(<ClinicForm clinic={clinic} />);

    await user.click(screen.getByRole('button', { name: '+ Adicionar' }));
    await user.type(screen.getByLabelText('Nova atividade'), 'Musicoterapia');
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }));

    expect(
      await screen.findByText('Dados da clínica salvos.'),
    ).toBeInTheDocument();
    expect(body).toEqual({ activities: ['Fisioterapia', 'Musicoterapia'] });
  });

  it('descarta a atividade digitada ao apertar Esc', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ClinicForm clinic={clinic} />);

    await user.click(screen.getByRole('button', { name: '+ Adicionar' }));
    await user.type(screen.getByLabelText('Nova atividade'), 'Musicoterapia');
    await user.keyboard('{Escape}');

    expect(screen.queryByText('Musicoterapia')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Salvar alterações' }),
    ).toBeDisabled();
  });
});
