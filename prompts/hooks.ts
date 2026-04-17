import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  promptsApi,
  type PromptsListParams,
  type UpdatePromptPayload,
} from "./api";
import { queryKeys } from "../../lib/queryClient";

export function usePrompts(params?: PromptsListParams) {
  return useQuery({
    queryKey: queryKeys.prompts(params),
    queryFn: () => promptsApi.list(params),
  });
}

export function usePrompt(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.prompt(id ?? ""),
    queryFn: () => promptsApi.get(id!),
    enabled: !!id,
  });
}

export function usePromptVersions(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.promptVersions(id ?? ""),
    queryFn: () => promptsApi.versions(id!),
    enabled: !!id,
  });
}

export function useUpdatePrompt(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePromptPayload) => promptsApi.update(id, payload),
    onSuccess: (prompt) => {
      qc.setQueryData(queryKeys.prompt(id), prompt);
      qc.invalidateQueries({ queryKey: ["prompts"] });
      qc.invalidateQueries({ queryKey: queryKeys.promptVersions(id) });
    },
  });
}

export function useDeletePrompt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => promptsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
}
