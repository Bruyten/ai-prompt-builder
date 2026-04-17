import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error: unknown) => {
        // Don't retry auth/validation/permission errors.
        const status =
          (error as { response?: { status?: number } } | undefined)?.response?.status ?? 0;
        if (status >= 400 && status < 500) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

export const queryKeys = {
  me: ["auth", "me"] as const,
  projects: (params?: object) => ["projects", "list", params ?? {}] as const,
  project: (id: string) => ["projects", "detail", id] as const,
  prompts: (params?: object) => ["prompts", "list", params ?? {}] as const,
  prompt: (id: string) => ["prompts", "detail", id] as const,
  promptVersions: (id: string) => ["prompts", "versions", id] as const,
  templates: (params?: object) => ["templates", "list", params ?? {}] as const,
  template: (id: string) => ["templates", "detail", id] as const,
  session: (id: string) => ["sessions", "detail", id] as const,
};
