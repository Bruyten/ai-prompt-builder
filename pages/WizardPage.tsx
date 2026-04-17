import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Container } from "../components/layout/Container";
import { useProject } from "../features/projects/hooks";
import {
  useCompleteSession,
  useCreateSession,
  useLivePreview,
} from "../features/sessions/hooks";
import { getQuestionnaire } from "../config/questionnaires";
import { WizardRenderer } from "../features/wizard/WizardRenderer";
import { PromptPreview } from "../components/PromptPreview";
import { PageSpinner } from "../components/ui/Spinner";
import { Card, CardBody } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { toast } from "../stores/toastStore";
import { getApiErrorMessage } from "../lib/api";
import type { Answers } from "../features/wizard/types";

export default function WizardPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const projectQ = useProject(projectId);
  const createSession = useCreateSession();
  const [answers, setAnswers] = useState<Answers>({});
  const [sessionId, setSessionId] = useState<string | null>(null);
  const completeSession = useCompleteSession(sessionId ?? "");

  const project = projectQ.data;
  const config = project ? getQuestionnaire(project.promptType) : null;

  // Live preview — debounced inside the hook.
  const preview = useLivePreview(
    {
      promptType: project?.promptType ?? "GENERAL",
      answers,
    },
    !!project,
  );

  if (projectQ.isLoading) return <PageSpinner />;

  if (!project || !config) {
    return (
      <Container>
        <p className="text-sm text-slate-500">Project not found.</p>
      </Container>
    );
  }

  async function handleComplete() {
    if (!project) return;
    try {
      // Lazily create the session on first completion attempt.
      let sid = sessionId;
      if (!sid) {
        const session = await createSession.mutateAsync({
          promptType: project.promptType,
          projectId: project.id,
          answers,
        });
        sid = session.id;
        setSessionId(sid);
      }
      const title = `${project.name} — ${new Date().toLocaleDateString()}`;
      const prompt = await completeSession.mutateAsync({ title });
      toast.success("Prompt generated and saved");
      navigate(`/prompts/${prompt.id}`);
    } catch (e) {
      toast.error(getApiErrorMessage(e, "Could not generate prompt"));
    }
  }

  return (
    <Container>
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>
        <Badge variant="brand">
          {config.icon} {config.label}
        </Badge>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        {project.description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {project.description}
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <WizardRenderer
            config={config}
            answers={answers}
            onChange={setAnswers}
            onComplete={handleComplete}
            submitting={createSession.isPending || completeSession.isPending}
          />
        </div>

        <div className="min-w-0">
          {Object.keys(answers).length === 0 ? (
            <Card className="sticky top-20">
              <CardBody>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Live preview
                </h3>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                  As you answer questions, your prompt will appear here in real
                  time — along with a quality score.
                </p>
              </CardBody>
            </Card>
          ) : (
            <PromptPreview
              text={preview.data?.text ?? ""}
              score={preview.data?.score}
              breakdown={preview.data?.scoreBreakdown ?? null}
              loading={preview.isFetching}
            />
          )}
        </div>
      </div>
    </Container>
  );
}
