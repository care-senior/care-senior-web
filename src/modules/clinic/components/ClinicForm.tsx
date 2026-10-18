import {
  useState,
  type HTMLInputTypeAttribute,
  type SyntheticEvent,
} from 'react';

import type { ClinicResponseDto } from '@/shared/api/generated/model';
import { Button, useToast } from '@/shared/ui';

import { useUpdateClinic } from '../api/use-update-clinic';
import {
  buildUpdatePayload,
  toFormValues,
  type ClinicFormValues,
} from '../lib/clinic-form';

import { ActivitiesField } from './ActivitiesField';
import styles from './ClinicForm.module.css';

export interface ClinicFormProps {
  clinic: ClinicResponseDto;
}

export function ClinicForm({ clinic }: ClinicFormProps) {
  const toast = useToast();
  const update = useUpdateClinic();
  const [values, setValues] = useState<ClinicFormValues>(() =>
    toFormValues(clinic),
  );

  const payload = buildUpdatePayload(values, clinic);
  const isDirty = Object.keys(payload).length > 0;

  function setField<K extends keyof ClinicFormValues>(
    key: K,
    value: ClinicFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    if (!isDirty) return;

    update.mutate(
      { id: clinic.id, data: payload },
      {
        onSuccess: () => toast.success('Dados da clínica salvos.'),
        onError: (error) => toast.error(error.message),
      },
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <TextField
          label="Nome da clínica"
          value={values.name}
          onChange={(v) => setField('name', v)}
          maxLength={150}
          required
        />
        <TextField
          label="Telefone"
          type="tel"
          value={values.phone}
          onChange={(v) => setField('phone', v)}
          maxLength={30}
          required
        />
      </div>

      <TextField
        label="Endereço"
        value={values.address}
        onChange={(v) => setField('address', v)}
        maxLength={255}
        required
      />

      <div className={styles.row}>
        <TextField
          label="Horário de funcionamento"
          value={values.operatingHours}
          onChange={(v) => setField('operatingHours', v)}
          maxLength={150}
        />
        <TextField
          label="WhatsApp"
          type="tel"
          value={values.whatsappPhone}
          onChange={(v) => setField('whatsappPhone', v)}
          maxLength={30}
        />
      </div>

      <TextField
        label="Responsável técnico"
        value={values.responsiblePeople}
        onChange={(v) => setField('responsiblePeople', v)}
        maxLength={150}
      />

      <ActivitiesField
        value={values.activities}
        onChange={(next) => setField('activities', next)}
      />

      <div className={styles.actions}>
        <Button type="submit" disabled={!isDirty || update.isPending}>
          {update.isPending ? 'Salvando…' : 'Salvar alterações'}
        </Button>
        <Button
          variant="ghost"
          disabled={!isDirty || update.isPending}
          onClick={() => setValues(toFormValues(clinic))}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
}

function TextField({
  label,
  value,
  onChange,
  maxLength,
  type = 'text',
  required,
}: TextFieldProps) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input
        type={type}
        value={value}
        maxLength={maxLength}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
