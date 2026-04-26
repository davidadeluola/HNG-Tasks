"use client";

import { FormEvent, useEffect, useState } from "react";
import { validateHabitName } from "../../lib/validators";

type HabitFormValues = {
  name: string;
  description: string;
};

type HabitFormProps = {
  initialValues?: HabitFormValues;
  onSubmit: (values: HabitFormValues) => void;
  submitLabel: string;
};

export function HabitForm({ initialValues, onSubmit, submitLabel }: HabitFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(initialValues?.name ?? "");
    setDescription(initialValues?.description ?? "");
    setError(null);
  }, [initialValues]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateHabitName(name);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    onSubmit({
      name: validation.value,
      description: description.trim(),
    });
    setError(null);
  }

  return (
    <form className="card form-grid" data-testid="habit-form" onSubmit={handleSubmit}>
      <label htmlFor="habit-name">Habit name</label>
      <input
        id="habit-name"
        data-testid="habit-name-input"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <label htmlFor="habit-description">Description</label>
      <textarea
        id="habit-description"
        data-testid="habit-description-input"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <label htmlFor="habit-frequency">Frequency</label>
      <select id="habit-frequency" data-testid="habit-frequency-select" defaultValue="daily" disabled>
        <option value="daily">Daily</option>
      </select>

      {error ? <p className="error-text">{error}</p> : null}

      <button data-testid="habit-save-button" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
