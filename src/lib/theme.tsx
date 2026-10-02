import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeMode = "light" | "dark";
const KEY = "fi:theme";

const ThemeContext = createContext<{ mode: ThemeMode; toggle: () => void }>({
  mode: "light",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((m) => {
      const next = m === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return <ThemeContext.Provider value={{ mode, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
