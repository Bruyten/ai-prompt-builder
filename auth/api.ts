import { api } from "../../lib/api";
import type { AuthResponse, User } from "../../types/api";

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>("/auth/register", payload).then((r) => r.data),

  login: (payload: LoginPayload) =>
    api.post<AuthResponse>("/auth/login", payload).then((r) => r.data),

  me: () => api.get<{ user: User }>("/auth/me").then((r) => r.data.user),

  logout: () => api.post<{ ok: true }>("/auth/logout").then((r) => r.data),

  refresh: () =>
    api.post<{ accessToken: string }>("/auth/refresh").then((r) => r.data),
};
