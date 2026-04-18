import { useState } from "react";
import { Search, Copy, Check } from "lucide-react";
import { Container } from "../components/layout/Container";
import { useTemplates } from "../features/templates/hooks";
import { Card, CardBody } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { EmptyState } from "../components/ui/EmptyState";
import { Modal } from "../components/ui/Modal";
import { allQuestionnaires, questionnaires } from "../config/questionnaires";
import type { PromptType, Template } from "../types/api";
import { copyToClipboard } from "../lib/clipboard";
import { toast } from "../stores/toastStore";
import { cn } from "../utils/cn";

export default function TemplatesPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<PromptType | "ALL">("ALL");
  const [active, setActive] = useState<Template | null>(null);
  const [copied, setCopied] = useState(false);

  const templates = useTemplates({
    promptType: type === "ALL" ? undefined : type,
    search: search || undefined,
  });

  async function handleCopy(text: string) {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      toast.success("Copied");
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <Container>
      <div>
        <h1 className="text-2xl font-bold">Template library</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Curated starting points across every prompt type. Copy and tweak.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[14rem]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search templates…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <FilterPill
            active={type === "ALL"}
            onClick={() => setType("ALL")}
            label="All"
          />
          {allQuestionnaires.map((q) => (
            <FilterPill
              key={q.promptType}
              active={type === q.promptType}
              onClick={() => setType(q.promptType)}
              label={`${q.icon} ${q.label}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-8">
        {templates.isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner className="size-6" />
          </div>
        ) : (templates.data ?? []).length === 0 ? (
          <EmptyState
            title="No templates found"
            description="Try a different search or filter."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(templates.data ?? []).map((t) => {
              const q = questionnaires[t.promptType];
              return (
                <Card
                  key={t.id}
                  className="flex h-full cursor-pointer flex-col transition-colors hover:border-brand-400 dark:hover:border-brand-500"
                  onClick={() => setActive(t)}
                >
                  <CardBody className="flex h-full flex-col">
                    <div className="flex items-start justify-between">
                      <div className="text-2xl">{q?.icon ?? "📝"}</div>
                      <Badge variant="brand">{q?.label}</Badge>
                    </div>
                    <h3 className="mt-3 text-base font-semibold">{t.title}</h3>
                    {t.description && (
                      <p className="mt-1 line-clamp-3 text-sm text-slate-500 dark:text-slate-400">
                        {t.description}
                      </p>
                    )}
                    {t.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {t.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        title={active?.title}
        size="lg"
        footer={
          active && (
            <>
              <Button variant="ghost" onClick={() => setActive(null)}>
                Close
              </Button>
              <Button
                onClick={() => handleCopy(active.body)}
                leftIcon={
                  copied ? <Check className="size-4" /> : <Copy className="size-4" />
                }
              >
                {copied ? "Copied" : "Copy template"}
              </Button>
            </>
          )
        }
      >
        {active && (
          <div className="space-y-3">
            {active.description && (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {active.description}
              </p>
            )}
            <pre className="max-h-[55vh] overflow-auto whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
              {active.body}
            </pre>
          </div>
        )}
      </Modal>
    </Container>
  );
}

function FilterPill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-brand-500 bg-brand-500 text-white"
          : "border-slate-300 text-slate-600 hover:border-brand-400 dark:border-slate-700 dark:text-slate-400",
      )}
    >
      {label}
    </button>
  );
}
