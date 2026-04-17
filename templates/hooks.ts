import { useQuery } from "@tanstack/react-query";
import { templatesApi, type TemplatesListParams } from "./api";
import { queryKeys } from "../../lib/queryClient";

export function useTemplates(params?: TemplatesListParams) {
  return useQuery({
    queryKey: queryKeys.templates(params),
    queryFn: () => templatesApi.list(params),
  });
}

export function useTemplate(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.template(id ?? ""),
    queryFn: () => templatesApi.get(id!),
    enabled: !!id,
  });
}
