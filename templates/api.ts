import { api } from "../../lib/api";
import type { PromptType, Template } from "../../types/api";

export interface TemplatesListParams {
  promptType?: PromptType;
  scope?: "all" | "mine" | "public";
  search?: string;
}

export const templatesApi = {
  list: (params?: TemplatesListParams) =>
    api
      .get<{ items: Template[] }>("/templates", { params })
      .then((r) => r.data.items),

  get: (id: string) =>
    api
      .get<{ template: Template }>(`/templates/${id}`)
      .then((r) => r.data.template),
};
