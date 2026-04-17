import { api } from "../../lib/api";
import type {
  PreviewResponse,
  Prompt,
  PromptSession,
  PromptType,
} from "../../types/api";

export interface CreateSessionPayload {
  promptType: PromptType;
  projectId?: string | null;
  answers?: Record<string, unknown>;
}

export interface UpdateSessionPayload {
  answers?: Record<string, unknown>;
  currentStep?: number;
}

export interface CompleteSessionPayload {
  title: string;
  /** Whether to also create a Project from this session. */
  projectName?: string;
}

export interface PreviewPayload {
  promptType: PromptType;
  answers: Record<string, unknown>;
}

export const sessionsApi = {
  /** Stateless live preview — no DB write. */
  preview: (payload: PreviewPayload) =>
    api.post<PreviewResponse>("/sessions/preview", payload).then((r) => r.data),

  create: (payload: CreateSessionPayload) =>
    api
      .post<{ session: PromptSession }>("/sessions", payload)
      .then((r) => r.data.session),

  get: (id: string) =>
    api
      .get<{ session: PromptSession }>(`/sessions/${id}`)
      .then((r) => r.data.session),

  update: (id: string, payload: UpdateSessionPayload) =>
    api
      .patch<{ session: PromptSession }>(`/sessions/${id}`, payload)
      .then((r) => r.data.session),

  /** Materialises the session into a saved Prompt + initial PromptVersion. */
  complete: (id: string, payload: CompleteSessionPayload) =>
    api
      .post<{ prompt: Prompt }>(`/sessions/${id}/complete`, payload)
      .then((r) => r.data.prompt),
};
