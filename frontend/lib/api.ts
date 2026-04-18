import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { env } from "../config/env";
import { useAuthStore, getAccessToken } from "../stores/authStore";
import type { ApiError } from "../types/api";

/**
 * Centralised HTTP client.
 *
 * - `withCredentials: true` so the httpOnly refresh cookie is sent on /auth/refresh.
 * - Request interceptor injects the bearer access token.
 * - Response interceptor transparently refreshes once on 401, then retries.
 *   Concurrent 401s are queued behind a single in-flight refresh.
 */
export const api: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// --- Refresh-on-401 plumbing -------------------------------------------------

interface RetriableConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await axios.post<{ accessToken: string }>(
      `${env.apiBaseUrl}/auth/refresh`,
      {},
      { withCredentials: true },
    );
    const newToken = res.data.accessToken;
    useAuthStore.getState().setAccessToken(newToken);
    return newToken;
  } catch {
    useAuthStore.getState().clear();
    return null;
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiError>) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    // No retry for the refresh endpoint itself, or login/register failures.
    const url = original?.url ?? "";
    const isAuthEndpoint =
      url.includes("/auth/refresh") ||
      url.includes("/auth/login") ||
      url.includes("/auth/register");

    if (status === 401 && original && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const newToken = await refreshPromise;
      if (newToken) {
        original.headers = original.headers ?? {};
        (original.headers as Record<string, string>)["Authorization"] =
          `Bearer ${newToken}`;
        return api.request(original);
      }
    }

    return Promise.reject(error);
  },
);

/**
 * Extracts a human-readable message from an axios error.
 * Falls back gracefully for network / unknown errors.
 */
export function getApiErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError<ApiError>(err)) {
    const data = err.response?.data;
    if (data?.error?.message) return data.error.message;
    if (err.message) return err.message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
