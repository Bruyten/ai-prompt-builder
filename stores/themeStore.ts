import { create } from "zustand";
import { storage } from "../lib/storage";

export type Theme = "light" | "dark";

const KEY = "apb.theme";

interface ThemeState {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
  hydrate: () => void;
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  root.style.colorScheme = theme;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "dark",

  setTheme: (theme) => {
    storage.set(KEY, theme);
    applyTheme(theme);
    set({ theme });
  },

  toggle: () => {
    const next: Theme = get().theme === "dark" ? "light" : "dark";
    get().setTheme(next);
  },

  hydrate: () => {
    const stored = storage.get<Theme | null>(KEY, null);
    let theme: Theme = "dark";
    if (stored === "light" || stored === "dark") {
      theme = stored;
    } else if (typeof window !== "undefined" && window.matchMedia) {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    applyTheme(theme);
    set({ theme });
  },
}));
