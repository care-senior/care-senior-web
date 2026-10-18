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
});
