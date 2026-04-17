import { create } from "zustand";
import type { User } from "../types/api";
import { storage } from "../lib/storage";

const ACCESS_TOKEN_KEY = "apb.accessToken";
const USER_KEY = "apb.user";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  hydrated: boolean;
  setAuth: (payload: { user: User; accessToken: string }) => void;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  clear: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  hydrated: false,

  setAuth: ({ user, accessToken }) => {
    storage.set(ACCESS_TOKEN_KEY, accessToken);
    storage.set(USER_KEY, user);
    set({ user, accessToken });
  },

  setUser: (user) => {
    if (user) storage.set(USER_KEY, user);
    else storage.remove(USER_KEY);
    set({ user });
  },

  setAccessToken: (token) => {
    if (token) storage.set(ACCESS_TOKEN_KEY, token);
    else storage.remove(ACCESS_TOKEN_KEY);
    set({ accessToken: token });
  },

  clear: () => {
    storage.remove(ACCESS_TOKEN_KEY);
    storage.remove(USER_KEY);
    set({ user: null, accessToken: null });
  },

  hydrate: () => {
    const accessToken = storage.get<string | null>(ACCESS_TOKEN_KEY, null);
    const user = storage.get<User | null>(USER_KEY, null);
    set({ accessToken, user, hydrated: true });
  },
}));

/** Read the current access token outside of React (for the axios interceptor). */
export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}
