import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Card, CardBody } from "./ui/Card";
import { ScoreBar } from "./ui/ScoreBar";
import { Button } from "./ui/Button";
import { copyToClipboard } from "../lib/clipboard";
import { toast } from "../stores/toastStore";
import type { ScoreBreakdown } from "../types/api";

interface Props {
  text: string;
  score?: number;
  breakdown?: ScoreBreakdown | null;
  loading?: boolean;
  emptyMessage?: string;
}

const DIMENSION_LABELS: Record<keyof ScoreBreakdown["dimensions"], string> = {
  clarity: "Clarity",
  specificity: "Specificity",
  context: "Context",
  constraints: "Constraints",
  structure: "Structure",
};

export function PromptPreview({
  text,
  score,
  breakdown,
  loading,
  emptyMessage = "Start filling in the questions to see your prompt take shape.",
}: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!text) return;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } else {
      toast.error("Could not copy");
    }
  }

  return (
    <Card className="sticky top-20">
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Live preview
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={!text}
            leftIcon={copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          >
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>

        {score !== undefined && <ScoreBar score={score} />}

        {breakdown && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {(Object.keys(DIMENSION_LABELS) as Array<keyof typeof DIMENSION_LABELS>).map(
              (k) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-slate-500">{DIMENSION_LABELS[k]}</span>
                  <span className="font-medium tabular-nums">
                    {Math.round(breakdown.dimensions[k])}
                  </span>
                </div>
              ),
            )}
          </div>
        )}

        <div className="max-h-[50vh] overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
          {text ? (
            <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200">
              {text}
            </pre>
          ) : (
            <p className="text-sm text-slate-400">
              {loading ? "Generating preview…" : emptyMessage}
            </p>
          )}
        </div>

        {breakdown && breakdown.suggestions.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs dark:border-amber-500/30 dark:bg-amber-500/10">
            <p className="font-semibold text-amber-800 dark:text-amber-300">
              Suggestions
            </p>
            <ul className="mt-1.5 space-y-1 text-amber-700 dark:text-amber-200/90">
              {breakdown.suggestions.slice(0, 4).map((s, i) => (
                <li key={i} className="flex gap-1.5">
                  <span>•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
