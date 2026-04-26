"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "../components/shared/ProtectedRoute";
import { HabitForm } from "../components/habits/HabitForm";
import { HabitList } from "../components/habits/HabitList";
import { getSession, logout } from "../lib/auth";
import {
  createHabit,
  deleteHabit,
  getUserHabits,
  saveHabit,
  toggleHabitCompletion,
  updateHabit,
} from "../lib/habits";
import type { Habit } from "../types/habit";

type HabitValues = {
  name: string;
  description: string;
};

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }

    setUserId(session.userId);
    setHabits(getUserHabits(session.userId));
  }, [router]);

  const showForm = useMemo(() => showCreateForm || editingHabit !== null, [showCreateForm, editingHabit]);

  function refreshHabits(ownerId: string): void {
    setHabits(getUserHabits(ownerId));
  }

  function handleCreate(values: HabitValues): void {
    if (!userId) {
      return;
    }
    createHabit(userId, values);
    refreshHabits(userId);
    setShowCreateForm(false);
  }

  function handleEditSave(values: HabitValues): void {
    if (!editingHabit || !userId) {
      return;
    }
    updateHabit(editingHabit.id, values);
    refreshHabits(userId);
    setEditingHabit(null);
  }

  function handleToggleComplete(habit: Habit): void {
    const today = new Date().toISOString().slice(0, 10);
    const updated = toggleHabitCompletion(habit, today);
    saveHabit(updated);
    if (userId) {
      refreshHabits(userId);
    }
  }

  function handleDelete(habit: Habit): void {
    deleteHabit(habit.id);
    if (userId) {
      refreshHabits(userId);
    }
  }

  function handleLogout(): void {
    logout();
    router.replace("/login");
  }

  return (
    <ProtectedRoute>
      <main className="page-shell" data-testid="dashboard-page">
        <header className="top-bar">
          <h1>Your Habits</h1>
          <button data-testid="auth-logout-button" onClick={handleLogout} type="button">
            Logout
          </button>
        </header>

        {!showForm ? (
          <button data-testid="create-habit-button" onClick={() => setShowCreateForm(true)} type="button">
            Create Habit
          </button>
        ) : null}

        {showForm ? (
          <HabitForm
            initialValues={
              editingHabit
                ? {
                    name: editingHabit.name,
                    description: editingHabit.description,
                  }
                : undefined
            }
            onSubmit={editingHabit ? handleEditSave : handleCreate}
            submitLabel={editingHabit ? "Save changes" : "Save habit"}
          />
        ) : null}

        {showForm ? (
          <button
            onClick={() => {
              setShowCreateForm(false);
              setEditingHabit(null);
            }}
            type="button"
          >
            Cancel
          </button>
        ) : null}

        {habits.length === 0 ? (
          <section className="card" data-testid="empty-state">
            <p>No habits yet. Create your first daily habit.</p>
          </section>
        ) : (
          <HabitList
            habits={habits}
            onToggleComplete={handleToggleComplete}
            onEdit={(habit) => {
              setEditingHabit(habit);
              setShowCreateForm(false);
            }}
            onDelete={handleDelete}
          />
        )}
      </main>
    </ProtectedRoute>
  );
}
