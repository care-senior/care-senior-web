import type {
  ClinicResponseDto,
  UpdateClinicDto,
} from '@/shared/api/generated/model';

export interface ClinicFormValues {
  name: string;
  phone: string;
  address: string;
  operatingHours: string;
  whatsappPhone: string;
  responsiblePeople: string;
  activities: string[];
}

const textFields = [
  'name',
  'phone',
  'address',
  'operatingHours',
  'whatsappPhone',
  'responsiblePeople',
] as const;

export function toFormValues(clinic: ClinicResponseDto): ClinicFormValues {
  return {
    name: clinic.name,
    phone: clinic.phone,
    address: clinic.address,
    operatingHours: clinic.operatingHours,
    whatsappPhone: clinic.whatsappPhone,
    responsiblePeople: clinic.responsiblePeople,
    activities: clinic.activities,
  };
}

/**
 * Monta o PATCH só com o que mudou. Payload vazio = formulário sem alterações,
 * então a mesma função alimenta o estado "dirty" e o envio.
 */
export function buildUpdatePayload(
  values: ClinicFormValues,
  clinic: ClinicResponseDto,
): UpdateClinicDto {
  const original = toFormValues(clinic);
  const payload: UpdateClinicDto = {};

  for (const field of textFields) {
    const next = values[field].trim();
    if (next !== original[field].trim()) payload[field] = next;
  }

  const sameActivities =
    values.activities.length === original.activities.length &&
    values.activities.every(
      (item, index) => item === original.activities[index],
    );
  if (!sameActivities) payload.activities = values.activities;

  return payload;
}
