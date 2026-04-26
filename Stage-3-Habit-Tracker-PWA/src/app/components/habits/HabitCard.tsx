"use client";

import { useMemo, useState } from "react";
import type { Habit } from "../../types/habit";
import { getHabitSlug } from "../../lib/slug";
import { calculateCurrentStreak } from "../../lib/streaks";

type HabitCardProps = {
  habit: Habit;
  onToggleComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
};

export function HabitCard({ habit, onToggleComplete, onEdit, onDelete }: HabitCardProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const slug = useMemo(() => getHabitSlug(habit.name), [habit.name]);
  const today = new Date().toISOString().slice(0, 10);
  const isCompletedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions, today);

  return (
    <article className={`card ${isCompletedToday ? "habit-completed" : "habit-incomplete"}`} data-testid={`habit-card-${slug}`}>
      <h3>{habit.name}</h3>
      <p>{habit.description || "No description"}</p>

      <p data-testid={`habit-streak-${slug}`}>Current streak: {streak}</p>

      <div className="row-actions">
        <button data-testid={`habit-complete-${slug}`} onClick={() => onToggleComplete(habit)} type="button">
          {isCompletedToday ? "Unmark today" : "Mark complete"}
        </button>
        <button data-testid={`habit-edit-${slug}`} onClick={() => onEdit(habit)} type="button">
          Edit
        </button>
        <button data-testid={`habit-delete-${slug}`} onClick={() => setIsConfirmingDelete(true)} type="button">
          Delete
        </button>
      </div>

      {isConfirmingDelete ? (
        <div className="confirm-delete">
          <p>Confirm delete?</p>
          <button
            data-testid="confirm-delete-button"
            onClick={() => {
              onDelete(habit);
              setIsConfirmingDelete(false);
            }}
            type="button"
          >
            Confirm
          </button>
          <button onClick={() => setIsConfirmingDelete(false)} type="button">
            Cancel
          </button>
        </div>
      ) : null}
    </article>
  );
}
