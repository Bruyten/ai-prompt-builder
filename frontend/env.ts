/**
 * Frontend environment.
 *
 * Set `VITE_API_BASE_URL` in `.env` (or Render env vars) to point at the backend.
 * Defaults to `http://localhost:4000/api` for local dev.
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api",
} as const;
