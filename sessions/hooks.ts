import { useMutation, useQuery } from "@tanstack/react-query";
import {
  sessionsApi,
  type CompleteSessionPayload,
  type CreateSessionPayload,
  type PreviewPayload,
  type UpdateSessionPayload,
} from "./api";
import { useDebounce } from "../../hooks/useDebounce";
import { queryKeys } from "../../lib/queryClient";

/**
 * Live preview hook — debounces the answers payload so we don't spam
 * the backend on every keystroke.
 */
export function useLivePreview(payload: PreviewPayload, enabled = true) {
  const debounced = useDebounce(payload, 350);
  return useQuery({
    queryKey: ["preview", debounced],
    queryFn: () => sessionsApi.preview(debounced),
    enabled: enabled && Object.keys(debounced.answers).length > 0,
    staleTime: 0,
  });
}

export function useSession(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.session(id ?? ""),
    queryFn: () => sessionsApi.get(id!),
    enabled: !!id,
  });
}

export function useCreateSession() {
  return useMutation({
    mutationFn: (payload: CreateSessionPayload) => sessionsApi.create(payload),
  });
}

export function useUpdateSession(id: string) {
  return useMutation({
    mutationFn: (payload: UpdateSessionPayload) => sessionsApi.update(id, payload),
  });
}

export function useCompleteSession(id: string) {
  return useMutation({
    mutationFn: (payload: CompleteSessionPayload) =>
      sessionsApi.complete(id, payload),
  });
}
