/* eslint-disable no-console */
import { PrismaClient, PromptType, TemplateVisibility } from '@prisma/client';

const prisma = new PrismaClient();

interface SeedTemplate {
  name: string;
  description: string;
  promptType: PromptType;
  tags: string[];
  answers: Record<string, unknown>;
  exampleText?: string;
}

const TEMPLATES: SeedTemplate[] = [
  {
    name: 'Senior Code Reviewer',
    description:
      'Have the model act as a senior engineer and review a snippet for bugs, security, and style.',
    promptType: PromptType.CODING,
    tags: ['review', 'quality', 'security'],
    answers: {
      language: 'TypeScript',
      framework: 'Node.js',
      task: 'Review the following code and produce a prioritized list of issues with suggested fixes.',
      inputs: 'A code snippet pasted by the user.',
      outputs: 'A markdown report grouped by Critical / Major / Minor.',
      constraints: [
        'Cite line numbers from the snippet',
        'Suggest concrete code, not just descriptions',
        'Flag security issues separately',
      ],
      style: 'Concise, neutral, no praise unless deserved.',
      tests: 'Mention missing test cases where relevant.',
    },
  },
  {
    name: 'Bug Reproduction Helper',
    description: 'Turn a vague bug report into a minimal reproducible example.',
    promptType: PromptType.CODING,
    tags: ['debugging', 'qa'],
    answers: {
      language: 'JavaScript',
      task: 'Given a bug description, produce a minimal reproducible example and a hypothesis for the root cause.',
      outputs: 'Two sections: 1) MRE code block, 2) Hypothesis & next debugging step.',
      constraints: ['No external dependencies in the MRE', 'Under 40 lines of code'],
    },
  },
  {
    name: 'Long-form Blog Post',
    description: 'Outline + draft a structured blog post for a specific audience.',
    promptType: PromptType.WRITING,
    tags: ['blog', 'long-form', 'content'],
    answers: {
      docType: 'blog post',
      tone: 'authoritative but friendly',
      length: '~1200 words',
      structure: [
        'Hook (1 paragraph)',
        'Why this matters (problem)',
        '3–5 main sections with H2 headings',
        'Practical takeaways',
        'Conclusion + CTA',
      ],
      keyPoints: [
        'Lead with a concrete example',
        'Back claims with sources or numbers',
        'End each section with a one-line summary',
      ],
      avoid: ['Generic intros', 'Listicle-style filler', 'Over-promising in headlines'],
    },
  },
  {
    name: 'Executive Summary',
    description: 'Compress a long document into a 1-page exec summary.',
    promptType: PromptType.WRITING,
    tags: ['summary', 'business'],
    answers: {
      docType: 'executive summary',
      tone: 'concise, professional',
      length: '350 words max',
      structure: ['TL;DR (3 bullets)', 'Background', 'Key findings', 'Recommendations'],
      avoid: ['Marketing language', 'Hedging without numbers'],
    },
  },
  {
    name: 'Landing Page Hero Copy',
    description: 'Punchy hero section copy for a SaaS landing page.',
    promptType: PromptType.MARKETING,
    tags: ['landing', 'saas', 'copy'],
    answers: {
      channel: 'landing page',
      tone: 'confident, plain-spoken',
      length: 'headline (≤10 words) + sub (≤25 words) + CTA',
      cta: 'Start free',
      mustInclude: ['Specific outcome', 'Time-to-value'],
      avoid: ['Buzzwords', 'Vague superlatives'],
    },
  },
  {
    name: 'Cold Outreach Email',
    description: 'Short, personalized cold email that earns a reply.',
    promptType: PromptType.MARKETING,
    tags: ['email', 'sales', 'outbound'],
    answers: {
      channel: 'cold email',
      tone: 'friendly, low-pressure',
      length: 'under 90 words',
      cta: 'Ask for a 15-minute call next week',
      mustInclude: ['One personalized line', 'One concrete value statement'],
      avoid: ['"Hope this finds you well"', 'Long paragraphs', 'Multiple asks'],
    },
  },
  {
    name: 'Cinematic Portrait',
    description: 'Image prompt for a moody, cinematic portrait.',
    promptType: PromptType.IMAGE,
    tags: ['portrait', 'cinematic'],
    answers: {
      subject: 'a weathered explorer in their 50s, looking off-camera',
      style: 'cinematic, photorealistic',
      medium: 'photography',
      mood: 'contemplative, slightly somber',
      lighting: 'low-key rim lighting, warm key light from the left',
      composition: 'tight medium shot, rule of thirds',
      palette: 'desaturated teal and amber',
      camera: 'shot on 85mm, shallow depth of field',
      aspectRatio: '3:2',
      negative: 'cartoon, blurry, extra fingers, text, watermark',
    },
  },
  {
    name: 'Product Hero Shot',
    description: 'Studio-quality product photography prompt.',
    promptType: PromptType.IMAGE,
    tags: ['product', 'studio'],
    answers: {
      subject: 'a minimalist ceramic coffee mug on a textured stone surface',
      style: 'commercial product photography',
      mood: 'clean, premium',
      lighting: 'soft top-down softbox, subtle gradient background',
      composition: 'centered, slight 3/4 angle',
      palette: 'warm neutrals',
      camera: '50mm macro, f/8',
      aspectRatio: '1:1',
      negative: 'people, text, cluttered background',
    },
  },
  {
    name: 'Data Insights Report',
    description: 'Turn raw numbers into a stakeholder-ready insights brief.',
    promptType: PromptType.ANALYSIS,
    tags: ['data', 'reporting'],
    answers: {
      goal: 'Identify the 3 most important takeaways from the dataset and recommend actions.',
      questions: [
        'What changed week-over-week?',
        'Which segment drove the change?',
        'What should we do next, and why?',
      ],
      format: 'Markdown report: TL;DR, Findings (with numbers), Recommendations.',
      audience: 'Non-technical product manager.',
      constraints: ['Quote the exact numbers used', 'Flag any low-confidence claims'],
    },
  },
  {
    name: 'Generic Power Prompt',
    description: 'A flexible role/task/context/constraints scaffold for any task.',
    promptType: PromptType.GENERAL,
    tags: ['starter', 'general'],
    answers: {
      role: 'a thoughtful expert in the relevant field',
      task: 'Help the user accomplish their stated goal with a clear, structured response.',
      context: 'The user is intelligent but time-constrained; prefer signal over volume.',
      audience: 'A working professional.',
      tone: 'direct, warm, no fluff',
      constraints: [
        'If you are unsure, say so explicitly',
        'Ask up to 2 clarifying questions only if essential',
        'Otherwise proceed with reasonable assumptions',
      ],
      format: 'Markdown with H2 sections and short bullet points.',
    },
  },
];

async function main(): Promise<void> {
  console.log('🌱 Seeding system templates…');

  // Idempotent: clear any existing system templates first (those with userId = null).
  const existing = await prisma.template.findMany({
    where: { userId: null },
    select: { id: true, name: true },
  });
  if (existing.length) {
    await prisma.template.deleteMany({ where: { userId: null } });
    console.log(`  ✔ Cleared ${existing.length} existing system templates`);
  }

  for (const t of TEMPLATES) {
    await prisma.template.create({
      data: {
        userId: null,
        name: t.name,
        description: t.description,
        promptType: t.promptType,
        tags: t.tags,
        answers: t.answers,
        exampleText: t.exampleText,
        visibility: TemplateVisibility.PUBLIC,
      },
    });
    console.log(`  ✔ ${t.promptType.padEnd(10)}  ${t.name}`);
  }

  console.log(`\n✅ Seeded ${TEMPLATES.length} system templates.`);
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
