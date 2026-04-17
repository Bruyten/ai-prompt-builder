import type { QuestionnaireConfig } from "../../features/wizard/types";

export const codingQuestionnaire: QuestionnaireConfig = {
  promptType: "CODING",
  label: "Coding",
  tagline: "Generate code, debug issues, or design APIs.",
  icon: "💻",
  steps: [
    {
      id: "task-type",
      title: "What kind of coding task?",
      fields: [
        {
          key: "taskType",
          type: "radio",
          label: "Task type",
          required: true,
          options: [
            { value: "implement", label: "Implement a feature" },
            { value: "debug", label: "Debug / fix an issue" },
            { value: "refactor", label: "Refactor existing code" },
            { value: "explain", label: "Explain code" },
            { value: "design", label: "Design / architecture" },
          ],
        },
      ],
    },
    {
      id: "stack",
      title: "Tech stack",
      fields: [
        {
          key: "language",
          type: "select",
          label: "Language",
          required: true,
          options: [
            { value: "typescript", label: "TypeScript" },
            { value: "javascript", label: "JavaScript" },
            { value: "python", label: "Python" },
            { value: "go", label: "Go" },
            { value: "rust", label: "Rust" },
            { value: "java", label: "Java" },
            { value: "csharp", label: "C#" },
            { value: "other", label: "Other" },
          ],
        },
        {
          key: "framework",
          type: "text",
          label: "Framework / runtime",
          placeholder: "e.g. React, Next.js, FastAPI, Spring Boot",
        },
      ],
    },
    {
      id: "details",
      title: "Describe the work",
      fields: [
        {
          key: "task",
          type: "textarea",
          label: "What should the code do?",
          required: true,
          rows: 5,
          placeholder:
            "e.g. Build a debounced search input that calls /api/search and renders results in a dropdown.",
        },
        {
          key: "existingCode",
          type: "textarea",
          label: "Existing code (optional)",
          help: "Paste relevant snippets the AI should consider.",
          rows: 5,
          when: (a) => a.taskType !== "design",
        },
        {
          key: "errorMessage",
          type: "textarea",
          label: "Error message",
          help: "Paste the full error / stack trace.",
          rows: 4,
          required: true,
          when: (a) => a.taskType === "debug",
        },
      ],
    },
    {
      id: "preferences",
      title: "Code style & output",
      fields: [
        {
          key: "style",
          type: "multiselect",
          label: "Style preferences",
          options: [
            { value: "comments", label: "Inline comments" },
            { value: "tests", label: "Include unit tests" },
            { value: "types", label: "Strict typing" },
            { value: "functional", label: "Functional style" },
            { value: "errorHandling", label: "Robust error handling" },
            { value: "performance", label: "Performance-optimised" },
          ],
        },
        {
          key: "constraints",
          type: "tags",
          label: "Constraints",
          suggestions: [
            "No external libraries",
            "ES2022+",
            "Async/await only",
            "Pure functions",
          ],
          max: 8,
        },
      ],
    },
  ],
};
