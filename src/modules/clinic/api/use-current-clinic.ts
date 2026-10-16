import { useCurrentUser } from '@/modules/auth';
import { useClinicsFindOne } from '@/shared/api/generated/endpoints';

export function useCurrentClinic() {
  const { clinicId = '' } = useCurrentUser();
  return useClinicsFindOne(clinicId, { query: { enabled: clinicId !== '' } });
}
