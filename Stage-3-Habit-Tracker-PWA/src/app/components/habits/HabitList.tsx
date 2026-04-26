import type { Habit } from "../../types/habit";
import { HabitCard } from "./HabitCard";

type HabitListProps = {
  habits: Habit[];
  onToggleComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
};

export function HabitList({ habits, onToggleComplete, onEdit, onDelete }: HabitListProps) {
  return (
    <div className="habit-list">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
