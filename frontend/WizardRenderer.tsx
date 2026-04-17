import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import type { Answers, QuestionnaireConfig } from "./types";
import {
  isStepValid,
  validateStep,
  visibleFields,
  visibleSteps,
} from "./engine";
import { FieldRenderer } from "./FieldRenderer";
import { StepProgress } from "./StepProgress";
import { Button } from "../../components/ui/Button";
import { Card, CardBody } from "../../components/ui/Card";

interface Props {
  config: QuestionnaireConfig;
  answers: Answers;
  onChange: (answers: Answers) => void;
  /** Called when the user reaches the final step and clicks "Generate". */
  onComplete: () => void;
  submitting?: boolean;
}

/**
 * Renders the full multi-step wizard for a given `QuestionnaireConfig`.
 *
 * Owns the local current-step index and per-field validation errors.
 * The actual answers are *lifted* into the parent so the live preview can
 * react to every keystroke.
 */
export function WizardRenderer({
  config,
  answers,
  onChange,
  onComplete,
  submitting,
}: Props) {
  const steps = useMemo(() => visibleSteps(config, answers), [config, answers]);
  const [stepIdx, setStepIdx] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Recompute the current step relative to the visible list.
  const safeIdx = Math.max(0, Math.min(stepIdx, steps.length - 1));
  const step = steps[safeIdx];
  const isLast = safeIdx === steps.length - 1;
  const fields = step ? visibleFields(step, answers) : [];

  function setAnswer(key: string, value: unknown) {
    onChange({ ...answers, [key]: value });
    // Clear the error for this field as soon as the user edits it.
    if (errors[key]) {
      const rest = { ...errors };
      delete rest[key];
      setErrors(rest);
    }
  }

  function next() {
    if (!step) return;
    const stepErrors = validateStep(step, answers);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;

    if (isLast) {
      onComplete();
    } else {
      // Recompute visible steps with the latest answers in case `when`
      // predicates added/removed steps.
      const refreshed = visibleSteps(config, answers);
      const newIdx = Math.min(safeIdx + 1, refreshed.length - 1);
      setStepIdx(newIdx);
      setErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function back() {
    if (safeIdx === 0) return;
    setStepIdx(safeIdx - 1);
    setErrors({});
  }

  if (!step) return null;

  return (
    <div className="space-y-5">
      <StepProgress
        current={safeIdx}
        total={steps.length}
        labels={steps.map((s) => s.title)}
      />

      <Card>
        <CardBody className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">{step.title}</h2>
            {step.description && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {step.description}
              </p>
            )}
          </div>

          <div className="space-y-5">
            {fields.map((f) => (
              <FieldRenderer
                key={f.key}
                field={f}
                value={answers[f.key]}
                onChange={(v) => setAnswer(f.key, v)}
                error={errors[f.key]}
              />
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={back}
          disabled={safeIdx === 0}
          leftIcon={<ChevronLeft className="size-4" />}
        >
          Back
        </Button>
        <Button
          onClick={next}
          loading={submitting && isLast}
          disabled={!isStepValid(step, answers)}
          rightIcon={
            isLast ? <Sparkles className="size-4" /> : <ChevronRight className="size-4" />
          }
        >
          {isLast ? "Generate prompt" : "Next"}
        </Button>
      </div>
    </div>
  );
}
