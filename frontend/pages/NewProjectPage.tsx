import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { NarrowContainer } from "../components/layout/Container";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Label, FieldError } from "../components/ui/Label";
import { Card, CardBody } from "../components/ui/Card";
import { allQuestionnaires } from "../config/questionnaires";
import type { PromptType } from "../types/api";
import { useCreateProject } from "../features/projects/hooks";
import { cn } from "../utils/cn";
import { toast } from "../stores/toastStore";
import { getApiErrorMessage } from "../lib/api";

const schema = z.object({
  name: z.string().trim().min(1, "Required").max(120),
  description: z.string().trim().max(1000).optional(),
});
type FormValues = z.infer<typeof schema>;

export default function NewProjectPage() {
  const navigate = useNavigate();
  const create = useCreateProject();
  const [promptType, setPromptType] = useState<PromptType>("GENERAL");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      const project = await create.mutateAsync({
        name: values.name,
        description: values.description || undefined,
        promptType,
      });
      toast.success("Project created");
      navigate(`/projects/${project.id}/wizard`);
    } catch (e) {
      toast.error(getApiErrorMessage(e, "Could not create project"));
    }
  }

  return (
    <NarrowContainer>
      <h1 className="text-2xl font-bold">New prompt project</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Pick a prompt type and we'll guide you through the right questions.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        {/* Type picker */}
        <div>
          <Label>Prompt type</Label>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {allQuestionnaires.map((q) => {
              const selected = promptType === q.promptType;
              return (
                <button
                  key={q.promptType}
                  type="button"
                  onClick={() => setPromptType(q.promptType)}
                  className={cn(
                    "rounded-lg border p-4 text-left transition-colors",
                    "border-slate-300 hover:border-brand-400 dark:border-slate-700 dark:hover:border-brand-500",
                    selected &&
                      "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20 dark:bg-brand-500/10",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{q.icon}</div>
                    <div className="font-medium">{q.label}</div>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {q.tagline}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <Card>
          <CardBody className="space-y-4">
            <div>
              <Label htmlFor="name" required>
                Project name
              </Label>
              <Input
                id="name"
                placeholder="e.g. Onboarding emails"
                invalid={!!errors.name}
                className="mt-1.5"
                {...register("name")}
              />
              <FieldError message={errors.name?.message} />
            </div>

            <div>
              <Label htmlFor="description" help="Optional. Describe what this project is for.">
                Description
              </Label>
              <Textarea
                id="description"
                rows={3}
                invalid={!!errors.description}
                className="mt-1.5"
                {...register("description")}
              />
              <FieldError message={errors.description?.message} />
            </div>
          </CardBody>
        </Card>

        <div className="flex items-center justify-between">
          <Button variant="ghost" type="button" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={create.isPending}
            rightIcon={<ArrowRight className="size-4" />}
          >
            Continue to wizard
          </Button>
        </div>
      </form>
    </NarrowContainer>
  );
}
