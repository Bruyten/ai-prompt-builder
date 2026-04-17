import type { QuestionnaireConfig } from "../../features/wizard/types";

export const generalQuestionnaire: QuestionnaireConfig = {
  promptType: "GENERAL",
  label: "General Purpose",
  tagline: "A flexible prompt for any task — chat, Q&A, brainstorming.",
  icon: "✨",
  steps: [
    {
      id: "role",
      title: "Set the role",
      description: "Tell the AI who it should act as.",
      fields: [
        {
          key: "role",
          type: "text",
          label: "Role / Persona",
          placeholder: "e.g. Senior career coach with 15 years of experience",
          help: "A clear persona helps the AI adopt the right tone and depth.",
          required: true,
          maxLength: 200,
        },
      ],
    },
    {
      id: "task",
      title: "Describe the task",
      description: "What do you want the AI to do?",
      fields: [
        {
          key: "task",
          type: "textarea",
          label: "Task description",
          placeholder: "e.g. Help me prepare for a behavioural interview",
          required: true,
          rows: 4,
          maxLength: 1000,
        },
        {
          key: "context",
          type: "textarea",
          label: "Background context",
          placeholder: "Anything the AI should know up-front…",
          help: "Optional but recommended — context dramatically improves output quality.",
          rows: 3,
          maxLength: 1500,
        },
      ],
    },
    {
      id: "output",
      title: "Output preferences",
      fields: [
        {
          key: "tone",
          type: "select",
          label: "Tone",
          required: true,
          options: [
            { value: "professional", label: "Professional" },
            { value: "friendly", label: "Friendly" },
            { value: "concise", label: "Concise" },
            { value: "playful", label: "Playful" },
            { value: "academic", label: "Academic" },
          ],
        },
        {
          key: "format",
          type: "select",
          label: "Format",
          required: true,
          options: [
            { value: "prose", label: "Prose (paragraphs)" },
            { value: "bullets", label: "Bulleted list" },
            { value: "steps", label: "Numbered steps" },
            { value: "table", label: "Markdown table" },
          ],
        },
        {
          key: "length",
          type: "radio",
          label: "Approximate length",
          required: true,
          options: [
            { value: "short", label: "Short (~150 words)" },
            { value: "medium", label: "Medium (~400 words)" },
            { value: "long", label: "Long (800+ words)" },
          ],
        },
      ],
    },
    {
      id: "constraints",
      title: "Constraints (optional)",
      description: "Any rules or limits the AI must follow.",
      fields: [
        {
          key: "constraints",
          type: "tags",
          label: "Constraints",
          placeholder: "Press Enter to add",
          suggestions: [
            "Cite sources",
            "Avoid jargon",
            "No disclaimers",
            "Stay under 300 words",
          ],
          max: 8,
        },
      ],
    },
  ],
};
