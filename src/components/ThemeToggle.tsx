import { Moon, Sun } from "lucide-react";
import { useTheme } from "../lib/theme";

export default function ThemeToggle() {
  const { mode, toggle } = useTheme();
  const dark = mode === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className="relative flex h-10 w-[4.5rem] shrink-0 items-center rounded-full border border-border bg-secondary p-1"
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full bg-navy text-gold shadow transition-transform duration-300 dark:bg-gold dark:text-navy ${
          dark ? "translate-x-8" : "translate-x-0"
        }`}
      >
        {dark ? <Moon size={16} /> : <Sun size={16} />}
      </span>
    </button>
  );
}
