import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    clinicsUpdate,
    getClinicsFindAllQueryKey,
    getClinicsFindOneQueryKey,
} from '@/shared/api/generated/endpoints';
import type {
    ClinicResponseDto,
    UpdateClinicDto,
} from '@/shared/api/generated/model';
import type { ErrorType } from '@/shared/api/http-client';

interface UpdateClinicVariables {
    id: string;
    data: UpdateClinicDto;
}

/**
 * TEMPORÁRIO: o Orval gerou o PATCH como `useQuery`. Quando o
 * `orval.config.ts` for corrigido, delegar para o `useClinicsUpdate` gerado.
 */
export function useUpdateClinic() {
    const queryClient = useQueryClient();

    return useMutation<ClinicResponseDto, ErrorType<unknown>, UpdateClinicVariables>({
        mutationFn: ({ id, data }) => clinicsUpdate(id, data),
        onSuccess: (_updated, { id }) =>
            Promise.all([
                queryClient.invalidateQueries({ queryKey: getClinicsFindOneQueryKey(id) }),
                queryClient.invalidateQueries({ queryKey: getClinicsFindAllQueryKey() }),
            ]),
    });
}
