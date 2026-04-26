function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getStorageItem(key: string): string | null {
  if (!canUseStorage()) {
    return null;
  }
  return window.localStorage.getItem(key);
}

export function setStorageItem(key: string, value: string): void {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(key, value);
}

export function removeStorageItem(key: string): void {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.removeItem(key);
}

export function getJsonStorageItem<T>(key: string, fallback: T): T {
  const raw = getStorageItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setJsonStorageItem<T>(key: string, value: T): void {
  setStorageItem(key, JSON.stringify(value));
}
