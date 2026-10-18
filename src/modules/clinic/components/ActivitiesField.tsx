import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

import { Badge, Button } from '@/shared/ui';

import styles from './ActivitiesField.module.css';

const MAX_ITEMS = 50; // limites do UpdateClinicDto
const MAX_LENGTH = 100;

export interface ActivitiesFieldProps {
  value: string[];
  onChange: (next: string[]) => void;
}

export function ActivitiesField({ value, onChange }: ActivitiesFieldProps) {
  const labelId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  function commit() {
    const name = draft.trim();
    const exists = value.some(
      (item) => item.toLowerCase() === name.toLowerCase(),
    );
    if (name && !exists) onChange([...value, name]);
    setDraft('');
    setAdding(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault(); // não enviar o formulário da clínica
      commit();
    }
    if (event.key === 'Escape') {
      event.stopPropagation();
      setDraft('');
      setAdding(false);
    }
  }

  return (
    <div role="group" aria-labelledby={labelId} className={styles.field}>
      <span id={labelId} className={styles.label}>
        Atividades oferecidas
      </span>
      <div className={styles.list}>
        {value.map((activity) => (
          <Badge key={activity} tone="role" dot={false}>
            {activity}
            <button
              type="button"
              className={styles.remove}
              aria-label={`Remover ${activity}`}
              onClick={() =>
                onChange(value.filter((item) => item !== activity))
              }
            >
              ✕
            </button>
          </Badge>
        ))}

        {adding ? (
          <input
            ref={inputRef}
            className={styles.input}
            value={draft}
            maxLength={MAX_LENGTH}
            placeholder="Nova atividade"
            aria-label="Nova atividade"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (!draft.trim()) setAdding(false);
            }}
          />
        ) : (
          value.length < MAX_ITEMS && (
            <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
              + Adicionar
            </Button>
          )
        )}
      </div>
    </div>
  );
}
