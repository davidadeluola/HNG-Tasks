import type { Session, User } from "../types/auth";
import { STORAGE_KEYS } from "./constants";
import { getJsonStorageItem, setJsonStorageItem } from "./storage";

type AuthResult = {
  ok: boolean;
  error: string | null;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function makeId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getUsers(): User[] {
  return getJsonStorageItem<User[]>(STORAGE_KEYS.users, []);
}

export function saveUsers(users: User[]): void {
  setJsonStorageItem(STORAGE_KEYS.users, users);
}

export function getSession(): Session | null {
  return getJsonStorageItem<Session | null>(STORAGE_KEYS.session, null);
}

export function saveSession(session: Session | null): void {
  setJsonStorageItem(STORAGE_KEYS.session, session);
}

export function signup(email: string, password: string): AuthResult {
  const normalizedEmail = normalizeEmail(email);
  const trimmedPassword = password.trim();

  if (!normalizedEmail || !trimmedPassword) {
    return { ok: false, error: "Email and password are required" };
  }

  const users = getUsers();
  const exists = users.some((user) => user.email === normalizedEmail);
  if (exists) {
    return { ok: false, error: "User already exists" };
  }

  const newUser: User = {
    id: makeId(),
    email: normalizedEmail,
    password: trimmedPassword,
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, newUser]);
  saveSession({ userId: newUser.id, email: newUser.email });
  return { ok: true, error: null };
}

export function login(email: string, password: string): AuthResult {
  const normalizedEmail = normalizeEmail(email);
  const trimmedPassword = password.trim();
  const users = getUsers();

  const existingUser = users.find(
    (user) => user.email === normalizedEmail && user.password === trimmedPassword,
  );

  if (!existingUser) {
    return { ok: false, error: "Invalid email or password" };
  }

  saveSession({ userId: existingUser.id, email: existingUser.email });
  return { ok: true, error: null };
}

export function logout(): void {
  saveSession(null);
}
