import { api } from "../../lib/api";
import type { Prompt, PromptStatus, PromptVersion } from "../../types/api";

export interface PromptsListParams {
  projectId?: string;
  status?: PromptStatus;
  search?: string;
}

export interface UpdatePromptPayload {
  title?: string;
  text?: string;
  status?: PromptStatus;
}

export const promptsApi = {
  list: (params?: PromptsListParams) =>
    api
      .get<{ items: Prompt[] }>("/prompts", { params })
      .then((r) => r.data.items),

  get: (id: string) =>
    api.get<{ prompt: Prompt }>(`/prompts/${id}`).then((r) => r.data.prompt),

  versions: (id: string) =>
    api
      .get<{ items: PromptVersion[] }>(`/prompts/${id}/versions`)
      .then((r) => r.data.items),

  update: (id: string, payload: UpdatePromptPayload) =>
    api
      .patch<{ prompt: Prompt }>(`/prompts/${id}`, payload)
      .then((r) => r.data.prompt),

  delete: (id: string) =>
    api.delete<{ ok: true }>(`/prompts/${id}`).then((r) => r.data),

  /** The backend supports `?format=txt|md|json` and returns a file body. */
  exportUrl: (id: string, format: "txt" | "md" | "json") =>
    `/prompts/${id}/export?format=${format}`,

  exportAsBlob: (id: string, format: "txt" | "md" | "json") =>
    api
      .get<Blob>(`/prompts/${id}/export`, {
        params: { format },
        responseType: "blob",
      })
      .then((r) => r.data),
};
