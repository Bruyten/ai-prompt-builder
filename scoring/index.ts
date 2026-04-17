/**
 * Rule-based prompt quality scoring.
 *
 * Five dimensions, each 0–20, summed to a 0–100 total:
 *   - clarity      : readable, low jargon, present-tense verbs
 *   - specificity  : concrete nouns, numbers, named entities
 *   - context      : audience / situation / background present
 *   - structure    : sections, bullet points, fenced blocks
 *   - constraints  : explicit do/don't, format, length
 *
 * The heuristics are deliberately simple and explainable. They give the
 * user actionable feedback without calling an LLM. We expose `score()` plus
 * suggestion strings the UI can display verbatim.
 */

export interface ScoreBreakdown {
  clarity: number;
  specificity: number;
  context: number;
  structure: number;
  constraints: number;
}

export interface ScoreResult {
  total: number;          // 0–100
  breakdown: ScoreBreakdown;
  suggestions: string[];
}

const MAX_PER_DIMENSION = 20;

export function scorePrompt(text: string): ScoreResult {
  const t = (text || '').trim();
  if (!t) {
    return {
      total: 0,
      breakdown: { clarity: 0, specificity: 0, context: 0, structure: 0, constraints: 0 },
      suggestions: ['The prompt is empty — describe what you want the AI to do.'],
    };
  }

  const breakdown: ScoreBreakdown = {
    clarity: scoreClarity(t),
    specificity: scoreSpecificity(t),
    context: scoreContext(t),
    structure: scoreStructure(t),
    constraints: scoreConstraints(t),
  };

  const total = Math.min(
    100,
    breakdown.clarity +
      breakdown.specificity +
      breakdown.context +
      breakdown.structure +
      breakdown.constraints,
  );

  return { total, breakdown, suggestions: buildSuggestions(t, breakdown) };
}

// ---------------------------------------------------------------------------
// Dimension scorers
// ---------------------------------------------------------------------------

function scoreClarity(text: string): number {
  const words = text.split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  if (words.length === 0 || sentences.length === 0) return 0;

  const avgSentenceLen = words.length / sentences.length;
  // Sweet spot: 12–22 words/sentence
  let lenScore: number;
  if (avgSentenceLen <= 6) lenScore = 6;
  else if (avgSentenceLen <= 22) lenScore = 12;
  else if (avgSentenceLen <= 35) lenScore = 8;
  else lenScore = 4;

  // Reading-difficulty proxy: % of long (>12 char) words
  const longWords = words.filter((w) => w.length > 12).length;
  const longRatio = longWords / words.length;
  const jargonPenalty = longRatio > 0.15 ? 2 : 0;

  // Bonus for action verbs at the start
  const startsWithVerb = /^(write|create|build|generate|explain|summari[sz]e|analyze|design|list|translate|review|refactor|describe)\b/i.test(
    text,
  );
  const verbBonus = startsWithVerb ? 4 : 0;

  // You / your phrasing => addressing the model directly
  const addressBonus = /\byou (are|will|should|must|act as)\b/i.test(text) ? 4 : 0;

  return clamp(lenScore + verbBonus + addressBonus - jargonPenalty);
}

function scoreSpecificity(text: string): number {
  let s = 0;
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // Base on length — too short can't be specific
  if (wordCount >= 30) s += 4;
  if (wordCount >= 80) s += 4;

  // Numbers / quantities / units
  if (/\b\d+\b/.test(text)) s += 4;
  if (/\b\d+\s*(words|sentences|tokens|items|bullets|paragraphs|chars|characters|seconds|ms|kb|mb)\b/i.test(text)) s += 3;

  // Quoted strings or named entities (Capitalized multi-word)
  if (/"[^"]{3,}"/.test(text) || /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}\b/.test(text)) s += 3;

  // Vague hedge penalty
  const vague = (text.match(/\b(some|things|stuff|various|nice|good|cool|maybe)\b/gi) || []).length;
  s -= Math.min(4, vague);

  return clamp(s);
}

function scoreContext(text: string): number {
  let s = 0;
  if (/\b(audience|reader|user|customer|users|readers)\b/i.test(text)) s += 5;
  if (/\b(context|background|situation|scenario|problem)\b/i.test(text)) s += 5;
  if (/\bact as|you are\b/i.test(text)) s += 5;
  if (/\b(tone|voice|style)\b/i.test(text)) s += 3;
  if (/\b(goal|objective|purpose|intent)\b/i.test(text)) s += 2;
  return clamp(s);
}

function scoreStructure(text: string): number {
  let s = 0;
  if (/^#{1,6}\s/m.test(text)) s += 6;             // markdown headings
  if (/^[-*]\s/m.test(text)) s += 5;               // bullet points
  if (/```[\s\S]*?```/.test(text)) s += 4;         // fenced code
  if (/^\d+\.\s/m.test(text)) s += 3;              // numbered list
  if (text.split(/\n{2,}/).length >= 3) s += 2;    // multiple paragraphs
  return clamp(s);
}

function scoreConstraints(text: string): number {
  let s = 0;
  if (/\b(must|should|do not|don't|never|avoid|only|exactly)\b/i.test(text)) s += 6;
  if (/\b(format|output|return|respond)\b/i.test(text)) s += 5;
  if (/\b(json|markdown|yaml|csv|html|table|list|bullet)\b/i.test(text)) s += 4;
  if (/\b(length|words|tokens|characters|sentences|bullets|paragraphs)\b/i.test(text)) s += 3;
  if (/\b(language|english|spanish|french|german|chinese|japanese)\b/i.test(text)) s += 2;
  return clamp(s);
}

// ---------------------------------------------------------------------------
// Suggestions
// ---------------------------------------------------------------------------

function buildSuggestions(text: string, b: ScoreBreakdown): string[] {
  const out: string[] = [];

  if (b.clarity < 12) {
    out.push('Start with a clear action verb (Write, Generate, Analyze…).');
    if (text.split(/\s+/).length > 30 && !/\byou\b/i.test(text)) {
      out.push('Address the model directly with "You are…" to set the role.');
    }
  }
  if (b.specificity < 12) {
    out.push('Add concrete numbers, named entities, or quoted examples.');
  }
  if (b.context < 12) {
    out.push('Describe the audience and the situation the output will be used in.');
  }
  if (b.structure < 10) {
    out.push('Break the prompt into sections (## headings or bullet lists).');
  }
  if (b.constraints < 10) {
    out.push('Specify the output format (e.g. JSON, markdown table, 5 bullets).');
  }

  if (out.length === 0) out.push('Solid prompt — try it and iterate based on the output.');
  return out;
}

function clamp(n: number): number {
  if (n < 0) return 0;
  if (n > MAX_PER_DIMENSION) return MAX_PER_DIMENSION;
  return Math.round(n);
}
