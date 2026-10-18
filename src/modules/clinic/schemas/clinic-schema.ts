import { z } from 'zod';

export const clinicFormSchema = z.object({
  name: z.string().trim(),
  phone: z.string().trim(),
  address: z.string().trim(),
  operatingHours: z.string().trim(),
  whatsappPhone: z.string().trim(),
  responsiblePeople: z.string().trim(),
  activities: z.array(z.string()),
});

export type ClinicFormValues = z.infer<typeof clinicFormSchema>;
