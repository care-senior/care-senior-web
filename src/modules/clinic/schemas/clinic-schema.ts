import { z } from 'zod';

export const clinicFormSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome da clínica.'),
  phone: z.string().trim().min(1, 'Informe o telefone.'),
  address: z.string().trim().min(1, 'Informe o endereço.'),
  operatingHours: z.string().trim(),
  whatsappPhone: z.string().trim(),
  responsiblePeople: z.string().trim(),
  activities: z.array(z.string()),
});

export type ClinicFormValues = z.infer<typeof clinicFormSchema>;
