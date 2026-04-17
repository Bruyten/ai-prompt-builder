import { api } from "../../lib/api";
import type { Project, PromptType } from "../../types/api";

export interface CreateProjectPayload {
  name: string;
  description?: string | null;
  promptType: PromptType;
}

export type UpdateProjectPayload = Partial<
  Omit<CreateProjectPayload, "promptType">
> & { archived?: boolean };

export interface ProjectsListParams {
  search?: string;
  archived?: boolean;
}

export const projectsApi = {
  list: (params?: ProjectsListParams) =>
    api
      .get<{ items: Project[] }>("/projects", { params })
      .then((r) => r.data.items),

  get: (id: string) =>
    api.get<{ project: Project }>(`/projects/${id}`).then((r) => r.data.project),

  create: (payload: CreateProjectPayload) =>
    api
      .post<{ project: Project }>("/projects", payload)
      .then((r) => r.data.project),

  update: (id: string, payload: UpdateProjectPayload) =>
    api
      .patch<{ project: Project }>(`/projects/${id}`, payload)
      .then((r) => r.data.project),

  delete: (id: string) =>
    api.delete<{ ok: true }>(`/projects/${id}`).then((r) => r.data),
};
