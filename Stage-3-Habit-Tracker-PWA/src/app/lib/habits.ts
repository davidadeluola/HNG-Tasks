import type { Habit } from "../types/habit";
import { STORAGE_KEYS } from "./constants";
import { getJsonStorageItem, setJsonStorageItem } from "./storage";

type HabitInput = {
	name: string;
	description: string;
};

function makeId(): string {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
		return crypto.randomUUID();
	}
	return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getAllHabits(): Habit[] {
	return getJsonStorageItem<Habit[]>(STORAGE_KEYS.habits, []);
}

export function saveAllHabits(habits: Habit[]): void {
	setJsonStorageItem(STORAGE_KEYS.habits, habits);
}

export function getUserHabits(userId: string): Habit[] {
	return getAllHabits().filter((habit) => habit.userId === userId);
}

export function createHabit(userId: string, input: HabitInput): Habit {
	const allHabits = getAllHabits();
	const newHabit: Habit = {
		id: makeId(),
		userId,
		name: input.name.trim(),
		description: input.description.trim(),
		frequency: "daily",
		createdAt: new Date().toISOString(),
		completions: [],
	};

	saveAllHabits([...allHabits, newHabit]);
	return newHabit;
}

export function updateHabit(habitId: string, input: HabitInput): Habit | null {
	const allHabits = getAllHabits();
	const found = allHabits.find((habit) => habit.id === habitId);
	if (!found) {
		return null;
	}

	const updated: Habit = {
		...found,
		name: input.name.trim(),
		description: input.description.trim(),
	};

	saveAllHabits(allHabits.map((habit) => (habit.id === habitId ? updated : habit)));
	return updated;
}

export function deleteHabit(habitId: string): void {
	const allHabits = getAllHabits();
	saveAllHabits(allHabits.filter((habit) => habit.id !== habitId));
}

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
	const completionSet = new Set(habit.completions);
	if (completionSet.has(date)) {
		completionSet.delete(date);
	} else {
		completionSet.add(date);
	}

	return {
		...habit,
		completions: Array.from(completionSet).sort(),
	};
}

export function saveHabit(habit: Habit): void {
	const allHabits = getAllHabits();
	saveAllHabits(allHabits.map((item) => (item.id === habit.id ? habit : item)));
}
