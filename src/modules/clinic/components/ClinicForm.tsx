import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';

import type { ClinicResponseDto } from '@/shared/api/generated/model';
import { Button, TextField, useToast } from '@/shared/ui';

import { useUpdateClinic } from '../api/use-update-clinic';
import {
  buildUpdatePayload,
  hasChanges,
  toFormValues,
} from '../lib/clinic-form';
import { clinicFormSchema } from '../schemas/clinic-schema';

import { ActivitiesField } from './ActivitiesField';
import styles from './ClinicForm.module.css';

export interface ClinicFormProps {
  clinic: ClinicResponseDto;
}

export function ClinicForm({ clinic }: ClinicFormProps) {
  const toast = useToast();
  const update = useUpdateClinic();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: toFormValues(clinic),
  });

  const watched = useWatch({ control });
  const isDirty = hasChanges({ ...toFormValues(clinic), ...watched }, clinic);

  const submit = handleSubmit((values) => {
    if (!isDirty) return;

    update.mutate(
      { id: clinic.id, data: buildUpdatePayload(values, clinic) },
      {
        onSuccess: () => toast.success('Dados da clínica salvos.'),
        onError: (error) => toast.error(error.message),
      },
    );
  });

  return (
    <form
      noValidate
      className={styles.form}
      onSubmit={(event) => void submit(event)}
    >
      <div className={styles.row}>
        <TextField
          label="Nome da clínica"
          maxLength={150}
          error={errors.name?.message}
          {...register('name')}
        />
        <TextField
          label="Telefone"
          type="tel"
          maxLength={30}
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <TextField
        label="Endereço"
        maxLength={255}
        error={errors.address?.message}
        {...register('address')}
      />

      <div className={styles.row}>
        <TextField
          label="Horário de funcionamento"
          maxLength={150}
          {...register('operatingHours')}
        />
        <TextField
          label="WhatsApp"
          type="tel"
          maxLength={30}
          {...register('whatsappPhone')}
        />
      </div>

      <TextField
        label="Responsável técnico"
        maxLength={150}
        {...register('responsiblePeople')}
      />

      <Controller
        name="activities"
        control={control}
        render={({ field }) => (
          <ActivitiesField value={field.value} onChange={field.onChange} />
        )}
      />

      <div className={styles.actions}>
        <Button type="submit" disabled={!isDirty || update.isPending}>
          {update.isPending ? 'Salvando…' : 'Salvar alterações'}
        </Button>
        <Button
          variant="ghost"
          disabled={!isDirty || update.isPending}
          onClick={() => reset(toFormValues(clinic))}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
