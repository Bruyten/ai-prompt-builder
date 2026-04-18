import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  Check,
  Save,
  Trash2,
  Download,
  History,
  FileText,
  FileJson,
  FileCode,
} from "lucide-react";
import { Container } from "../components/layout/Container";
import { Card, CardBody } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Label } from "../components/ui/Label";
import { ScoreBar } from "../components/ui/ScoreBar";
import { Modal } from "../components/ui/Modal";
import { PageSpinner } from "../components/ui/Spinner";
import {
  usePrompt,
  usePromptVersions,
  useUpdatePrompt,
  useDeletePrompt,
} from "../features/prompts/hooks";
import { promptsApi } from "../features/prompts/api";
import { questionnaires } from "../config/questionnaires";
import { copyToClipboard } from "../lib/clipboard";
import { downloadBlob, downloadText, downloadJson, safeFilename } from "../lib/download";
import { toast } from "../stores/toastStore";
import { getApiErrorMessage } from "../lib/api";
import { formatDateTime, relativeTime } from "../lib/format";
import type { ScoreBreakdown } from "../types/api";

const DIM_LABELS: Record<keyof ScoreBreakdown["dimensions"], string> = {
  clarity: "Clarity",
  specificity: "Specificity",
  context: "Context",
  constraints: "Constraints",
  structure: "Structure",
};

export default function PromptResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const promptQ = usePrompt(id);
  const versionsQ = usePromptVersions(id);
  const update = useUpdatePrompt(id ?? "");
  const del = useDeletePrompt();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [showVersions, setShowVersions] = useState(false);

  // Initialise editable fields when the prompt loads.
  useEffect(() => {
    if (promptQ.data) {
      setTitle(promptQ.data.title);
      setText(promptQ.data.currentText);
    }
  }, [promptQ.data]);

  if (promptQ.isLoading) return <PageSpinner />;
  const prompt = promptQ.data;
  if (!prompt) {
    return (
      <Container>
        <p className="text-sm text-slate-500">Prompt not found.</p>
      </Container>
    );
  }

  const q = questionnaires[prompt.promptType];
  const dirty = title !== prompt.title || text !== prompt.currentText;

  async function handleCopy() {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      toast.success("Copied");
      setTimeout(() => setCopied(false), 1500);
    } else {
      toast.error("Could not copy");
    }
  }

  async function handleSave() {
    try {
      await update.mutateAsync({ title, text });
      toast.success("Saved as new version");
    } catch (e) {
      toast.error(getApiErrorMessage(e, "Could not save"));
    }
  }

  async function handleDelete() {
    if (!prompt) return;
    if (!window.confirm("Delete this prompt and all its versions?")) return;
    try {
      await del.mutateAsync(prompt.id);
      toast.success("Prompt deleted");
      navigate("/dashboard");
    } catch (e) {
      toast.error(getApiErrorMessage(e, "Could not delete"));
    }
  }

  async function handleExport(format: "txt" | "md" | "json") {
    if (!prompt) return;
    const base = safeFilename(prompt.title);
    try {
      // Prefer client-side export so we don't depend on the backend file route
      // having been wired up for SaveAs in every browser.
      if (format === "json") {
        downloadJson(`${base}.json`, {
          id: prompt.id,
          title: prompt.title,
          promptType: prompt.promptType,
          version: prompt.currentVersion,
          score: prompt.score,
          scoreBreakdown: prompt.scoreBreakdown,
          text: prompt.currentText,
          createdAt: prompt.createdAt,
          updatedAt: prompt.updatedAt,
        });
      } else if (format === "md") {
        const md =
          `# ${prompt.title}\n\n` +
          `> Type: **${q?.label ?? prompt.promptType}** · Score: **${Math.round(prompt.score)}** · v${prompt.currentVersion}\n\n` +
          `${prompt.currentText}\n`;
        downloadText(`${base}.md`, md, "text/markdown");
      } else {
        // Try server export for TXT (in case it adds metadata headers); fall back to client.
        try {
          const blob = await promptsApi.exportAsBlob(prompt.id, "txt");
          downloadBlob(`${base}.txt`, blob);
        } catch {
          downloadText(`${base}.txt`, prompt.currentText);
        }
      }
      toast.success(`Exported as .${format}`);
    } catch (e) {
      toast.error(getApiErrorMessage(e, "Export failed"));
    }
  }

  return (
    <Container>
      <button
        onClick={() => navigate("/dashboard")}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
      >
        <ArrowLeft className="size-4" />
        Back to dashboard
      </button>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">{q?.icon} {q?.label}</Badge>
            <Badge variant="neutral">v{prompt.currentVersion}</Badge>
            {prompt.project && (
              <Badge variant="neutral">📁 {prompt.project.name}</Badge>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-bold">{prompt.title}</h1>
          <p className="mt-1 text-xs text-slate-500">
            Updated {relativeTime(prompt.updatedAt)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Editor */}
        <div className="space-y-4">
          <Card>
            <CardBody className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label
                  htmlFor="text"
                  help="Edit freely. Saving will create a new version."
                >
                  Prompt
                </Label>
                <Textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={18}
                  className="mt-1.5 font-mono text-xs leading-relaxed"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={handleSave}
                  disabled={!dirty}
                  loading={update.isPending}
                  leftIcon={<Save className="size-4" />}
                >
                  Save as new version
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleCopy}
                  leftIcon={
                    copied ? <Check className="size-4" /> : <Copy className="size-4" />
                  }
                >
                  {copied ? "Copied" : "Copy prompt"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowVersions(true)}
                  leftIcon={<History className="size-4" />}
                >
                  Version history
                </Button>
                <div className="ml-auto" />
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  loading={del.isPending}
                  leftIcon={<Trash2 className="size-4" />}
                >
                  Delete
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Export */}
          <Card>
            <CardBody>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Export
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Download this prompt for use anywhere.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleExport("txt")}
                  leftIcon={<FileText className="size-4" />}
                >
                  Plain text (.txt)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport("md")}
                  leftIcon={<FileCode className="size-4" />}
                >
                  Markdown (.md)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport("json")}
                  leftIcon={<FileJson className="size-4" />}
                >
                  JSON (.json)
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Score sidebar */}
        <div>
          <Card className="sticky top-20">
            <CardBody className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Quality score
              </h3>
              <ScoreBar score={prompt.score} size="lg" />
              {prompt.scoreBreakdown && (
                <>
                  <div className="space-y-2">
                    {(
                      Object.keys(DIM_LABELS) as Array<keyof typeof DIM_LABELS>
                    ).map((k) => (
                      <div key={k}>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">
                            {DIM_LABELS[k]}
                          </span>
                          <span className="font-medium tabular-nums">
                            {Math.round(prompt.scoreBreakdown!.dimensions[k])}
                          </span>
                        </div>
                        <ScoreBar
                          score={prompt.scoreBreakdown!.dimensions[k]}
                          size="sm"
                          showNumber={false}
                          label=""
                        />
                      </div>
                    ))}
                  </div>
                  {prompt.scoreBreakdown.suggestions.length > 0 && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs dark:border-amber-500/30 dark:bg-amber-500/10">
                      <p className="font-semibold text-amber-800 dark:text-amber-300">
                        Suggestions
                      </p>
                      <ul className="mt-1.5 space-y-1 text-amber-700 dark:text-amber-200/90">
                        {prompt.scoreBreakdown.suggestions.map((s, i) => (
                          <li key={i} className="flex gap-1.5">
                            <span>•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Versions modal */}
      <Modal
        open={showVersions}
        onClose={() => setShowVersions(false)}
        title="Version history"
        size="lg"
      >
        {versionsQ.isLoading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <div className="max-h-[60vh] space-y-3 overflow-y-auto">
            {(versionsQ.data ?? []).map((v) => (
              <Card key={v.id}>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="brand">v{v.version}</Badge>
                      <span className="text-xs text-slate-500">
                        {formatDateTime(v.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium tabular-nums">
                        {Math.round(v.score)}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        leftIcon={<Download className="size-3.5" />}
                        onClick={() => {
                          downloadText(
                            safeFilename(`${prompt.title}-v${v.version}`) + ".txt",
                            v.text,
                          );
                        }}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                  <pre className="mt-3 max-h-40 overflow-y-auto whitespace-pre-wrap break-words rounded-md bg-slate-50 p-3 font-mono text-xs text-slate-700 dark:bg-slate-950 dark:text-slate-300">
                    {v.text}
                  </pre>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </Modal>
    </Container>
  );
}
