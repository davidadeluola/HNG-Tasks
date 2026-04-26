function addDays(isoDate: string, delta: number): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + delta);
  return date.toISOString().slice(0, 10);
}

export function calculateCurrentStreak(completions: string[], today?: string): number {
  const targetDay = today ?? new Date().toISOString().slice(0, 10);
  const uniqueSorted = [...new Set(completions)].sort();

  if (!uniqueSorted.includes(targetDay)) {
    return 0;
  }

  const completionSet = new Set(uniqueSorted);
  let streak = 0;
  let cursor = targetDay;

  while (completionSet.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}
