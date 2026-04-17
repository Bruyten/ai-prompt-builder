import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Wand2, BarChart3, Library } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardBody } from "../components/ui/Card";
import { Container } from "../components/layout/Container";
import { allQuestionnaires } from "../config/questionnaires";

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--color-brand-500)_0%,_transparent_50%)] opacity-10 dark:opacity-20" />
        <Container className="py-20 sm:py-28 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300">
            <Sparkles className="size-3" />
            Build better prompts in minutes
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Stop guessing.{" "}
            <span className="bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent">
              Engineer your prompts.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            PromptForge guides you through an adaptive questionnaire, generates a
            production-ready prompt, scores it on five dimensions, and tracks every
            version — all without sending a single token to a model.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/signup">
              <Button size="lg" rightIcon={<ArrowRight className="size-4" />}>
                Start building free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Sign in
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Features */}
      <Container className="py-16">
        <div className="grid gap-5 sm:grid-cols-3">
          <Feature
            icon={<Wand2 className="size-5" />}
            title="Adaptive questionnaire"
            description="Questions adapt to your answers. Skip what doesn't apply, dig deeper where it matters."
          />
          <Feature
            icon={<BarChart3 className="size-5" />}
            title="Quality scoring"
            description="Every prompt is graded on clarity, specificity, context, constraints, and structure — with concrete suggestions."
          />
          <Feature
            icon={<Library className="size-5" />}
            title="Templates & versions"
            description="Start from a curated template, save unlimited versions, and export to TXT, Markdown, or JSON."
          />
        </div>
      </Container>

      {/* Prompt types */}
      <section className="border-t border-slate-200 bg-white/50 dark:border-slate-800 dark:bg-slate-900/30">
        <Container className="py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Six prompt types, one workflow</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Each type ships its own questionnaire and generation engine.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allQuestionnaires.map((q) => (
              <Card key={q.promptType}>
                <CardBody>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{q.icon}</div>
                    <div>
                      <h3 className="font-semibold">{q.label}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {q.tagline}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <Container className="py-16 text-center">
        <Card className="bg-gradient-to-br from-brand-600 to-brand-800 text-white border-brand-700">
          <CardBody className="py-12">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to ship better prompts?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-brand-100">
              Free to start. No credit card. Your prompts stay yours.
            </p>
            <div className="mt-6">
              <Link to="/signup">
                <Button
                  size="lg"
                  variant="secondary"
                  rightIcon={<ArrowRight className="size-4" />}
                >
                  Create your account
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </Container>
    </>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardBody>
        <div className="flex size-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
          {icon}
        </div>
        <h3 className="mt-4 text-base font-semibold">{title}</h3>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </CardBody>
    </Card>
  );
}
