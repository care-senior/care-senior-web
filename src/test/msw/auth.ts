import { http, HttpResponse } from 'msw/http';

import type {
  AuthResponseDto,
  AuthUserDto,
  ClinicResponseDto,
} from '@/shared/api/generated/model';

export const staffUser: AuthUserDto = {
  id: 'staff-1',
  role: 'staff',
  staffRole: 'nurse',
  name: 'Ana Souza',
  email: 'enfermeira@caresenior.dev',
  photoPath: null,
  clinicId: 'clinic-1',
};

export const clinic: ClinicResponseDto = {
  id: 'clinic-1',
  name: 'Residencial Vida Plena',
  address: 'Rua das Flores, 100',
  phone: '1133334444',
  operatingHours: '24h',
  activities: [],
  responsiblePeople: 'Coordenação',
  whatsappPhone: '11999998888',
  latitude: 0,
  longitude: 0,
  photoPath: null,
};

export function authResponse(accessToken = 'access-token'): AuthResponseDto {
  return { accessToken, expiresIn: 900, user: staffUser };
}

export function nestError(status: number, message: string) {
  return HttpResponse.json(
    { statusCode: status, message, error: 'Error' },
    { status },
  );
}

export const authHandlers = {
  loginSucceeds: () =>
    http.post('*/api/v1/auth/staff/login', () =>
      HttpResponse.json(authResponse()),
    ),
  refreshSucceeds: (accessToken = 'refreshed-token') =>
    http.post('*/api/v1/auth/refresh', () =>
      HttpResponse.json(authResponse(accessToken)),
    ),
  refreshFails: () =>
    http.post('*/api/v1/auth/refresh', () =>
      nestError(401, 'Missing refresh token'),
    ),
  logoutSucceeds: () =>
    http.post(
      '*/api/v1/auth/logout',
      () => new HttpResponse(null, { status: 204 }),
    ),
  clinicFound: () =>
    http.get('*/api/v1/clinics/:id', () => HttpResponse.json(clinic)),
};
