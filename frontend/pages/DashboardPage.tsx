import { Link } from "react-router-dom";
import { Plus, FolderOpen, FileText, Trash2 } from "lucide-react";
import { Container } from "../components/layout/Container";
import { useProjects, useDeleteProject } from "../features/projects/hooks";
import { usePrompts } from "../features/prompts/hooks";
import { Button } from "../components/ui/Button";
import { Card, CardBody } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { ScoreBar } from "../components/ui/ScoreBar";
import { EmptyState } from "../components/ui/EmptyState";
import { PageSpinner } from "../components/ui/Spinner";
import { questionnaires } from "../config/questionnaires";
import { relativeTime, truncate } from "../lib/format";
import { toast } from "../stores/toastStore";
import { getApiErrorMessage } from "../lib/api";

export default function DashboardPage() {
  const projects = useProjects();
  const prompts = usePrompts();
  const del = useDeleteProject();

  if (projects.isLoading || prompts.isLoading) return <PageSpinner />;

  const projectList = projects.data ?? [];
  const promptList = (prompts.data ?? []).slice(0, 6);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this project and all its prompts?")) return;
    try {
      await del.mutateAsync(id);
      toast.success("Project deleted");
    } catch (e) {
      toast.error(getApiErrorMessage(e, "Could not delete"));
    }
  }

  return (
    <Container>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Your prompt projects and recent versions.
          </p>
        </div>
        <Link to="/projects/new">
          <Button leftIcon={<Plus className="size-4" />}>New project</Button>
        </Link>
      </div>

      {/* Projects */}
      <section className="mt-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Projects
        </h2>

        {projectList.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="size-6" />}
            title="No projects yet"
            description="Create your first project to start building prompts."
            action={
              <Link to="/projects/new">
                <Button leftIcon={<Plus className="size-4" />}>
                  Create your first project
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projectList.map((p) => {
              const q = questionnaires[p.promptType];
              return (
                <Card key={p.id} className="group relative">
                  <CardBody>
                    <div className="flex items-start justify-between">
                      <div className="text-2xl">{q?.icon ?? "📝"}</div>
                      <Badge variant="brand">{q?.label}</Badge>
                    </div>
                    <h3 className="mt-3 line-clamp-1 text-base font-semibold">
                      {p.name}
                    </h3>
                    {p.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                        {truncate(p.description, 100)}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <span>{p._count?.prompts ?? 0} prompts</span>
                      <span>Updated {relativeTime(p.updatedAt)}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <Link to={`/projects/${p.id}/wizard`} className="flex-1">
                        <Button size="sm" fullWidth>
                          Build prompt
                        </Button>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                        aria-label="Delete project"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent prompts */}
      <section className="mt-12">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Recent prompts
        </h2>

        {promptList.length === 0 ? (
          <EmptyState
            icon={<FileText className="size-6" />}
            title="No prompts yet"
            description="Open a project and run the wizard to generate your first prompt."
          />
        ) : (
          <div className="grid gap-3">
            {promptList.map((p) => (
              <Link key={p.id} to={`/prompts/${p.id}`}>
                <Card className="transition-colors hover:border-brand-400 dark:hover:border-brand-500">
                  <CardBody className="flex flex-wrap items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate font-medium">{p.title}</h3>
                        <Badge variant="neutral">v{p.currentVersion}</Badge>
                      </div>
                      <p className="mt-1 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
                        {truncate(p.currentText, 140)}
                      </p>
                    </div>
                    <div className="w-40">
                      <ScoreBar score={p.score} size="sm" />
                    </div>
                    <span className="text-xs text-slate-500">
                      {relativeTime(p.updatedAt)}
                    </span>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}
