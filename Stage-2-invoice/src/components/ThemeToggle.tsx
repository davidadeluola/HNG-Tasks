import { useTheme } from "../hooks/useTheme";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-12 w-12 items-center justify-center text-(--color-text-subtle) transition duration-300 ease-out hover:text-(--color-primary)"
      type="button"
      onClick={toggleTheme}
    >
      {isDark ? (
        <Moon size={22} strokeWidth={1.6} fill="currentColor" />
      ) : (
        <Sun size={22} strokeWidth={2} fill="currentColor" />
      )}
    </button>
  );
}
