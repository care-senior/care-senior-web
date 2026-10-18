import { useQueryClient } from '@tanstack/react-query';

import {
  getClinicsFindAllQueryKey,
  getClinicsFindOneQueryKey,
  useClinicsUpdate,
} from '@/shared/api/generated/endpoints';

export function useUpdateClinic() {
  const queryClient = useQueryClient();

  return useClinicsUpdate({
    mutation: {
      onSuccess: (_updated, { id }) =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: getClinicsFindOneQueryKey(id),
          }),
          queryClient.invalidateQueries({
            queryKey: getClinicsFindAllQueryKey(),
          }),
        ]),
    },
  });
}
