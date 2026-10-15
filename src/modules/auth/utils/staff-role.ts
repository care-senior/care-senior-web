import type { StaffRole } from '@/shared/api/generated/model';

export const staffRoleLabels: Record<StaffRole, string> = {
  coordinator: 'Coordenador(a)',
  nurse: 'Enfermeiro(a)',
  caregiver: 'Cuidador(a)',
};
