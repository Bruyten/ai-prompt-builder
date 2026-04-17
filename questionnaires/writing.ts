import type { QuestionnaireConfig } from "../../features/wizard/types";

export const writingQuestionnaire: QuestionnaireConfig = {
  promptType: "WRITING",
  label: "Writing",
  tagline: "Articles, essays, emails, stories — anything in long-form prose.",
  icon: "✍️",
  steps: [
    {
      id: "type",
      title: "What are you writing?",
      fields: [
        {
          key: "writingType",
          type: "select",
          label: "Type of writing",
          required: true,
          options: [
            { value: "article", label: "Article / blog post" },
            { value: "essay", label: "Essay" },
            { value: "email", label: "Email" },
            { value: "story", label: "Short story" },
            { value: "summary", label: "Summary" },
            { value: "other", label: "Other" },
          ],
        },
        {
          key: "topic",
          type: "text",
          label: "Topic",
          required: true,
          placeholder: "e.g. The future of remote work",
        },
      ],
    },
    {
      id: "audience",
      title: "Audience & tone",
      fields: [
        {
          key: "audience",
          type: "text",
          label: "Target audience",
          required: true,
          placeholder: "e.g. Tech-savvy product managers",
        },
        {
          key: "tone",
          type: "select",
          label: "Tone",
          required: true,
          options: [
            { value: "professional", label: "Professional" },
            { value: "conversational", label: "Conversational" },
            { value: "persuasive", label: "Persuasive" },
            { value: "humorous", label: "Humorous" },
            { value: "authoritative", label: "Authoritative" },
            { value: "empathetic", label: "Empathetic" },
          ],
        },
      ],
    },
    {
      id: "structure",
      title: "Structure & length",
      fields: [
        {
          key: "keyPoints",
          type: "tags",
          label: "Key points to cover",
          help: "Add the main ideas you want included.",
          placeholder: "Press Enter to add a point",
          max: 10,
        },
        {
          key: "length",
          type: "radio",
          label: "Length",
          required: true,
          options: [
            { value: "short", label: "Short (~300 words)" },
            { value: "medium", label: "Medium (~700 words)" },
            { value: "long", label: "Long (1500+ words)" },
          ],
        },
        {
          key: "callToAction",
          type: "text",
          label: "Call to action",
          help: "Optional — what should the reader do at the end?",
          when: (a) => a.writingType === "article" || a.writingType === "email",
        },
      ],
    },
  ],
};
