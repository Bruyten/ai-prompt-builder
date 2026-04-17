import type { QuestionnaireConfig } from "../../features/wizard/types";

export const analysisQuestionnaire: QuestionnaireConfig = {
  promptType: "ANALYSIS",
  label: "Analysis",
  tagline: "Summarise documents, extract data, compare options.",
  icon: "📊",
  steps: [
    {
      id: "task",
      title: "What do you need?",
      fields: [
        {
          key: "analysisType",
          type: "radio",
          label: "Analysis type",
          required: true,
          options: [
            { value: "summarize", label: "Summarise" },
            { value: "extract", label: "Extract structured data" },
            { value: "compare", label: "Compare options" },
            { value: "critique", label: "Critique / review" },
            { value: "classify", label: "Classify / categorise" },
          ],
        },
      ],
    },
    {
      id: "input",
      title: "Source material",
      fields: [
        {
          key: "sourceDescription",
          type: "textarea",
          label: "Describe the input",
          required: true,
          rows: 4,
          help: "What kind of content will be passed in? (Don't paste it here — describe it.)",
          placeholder:
            "e.g. A 3000-word product spec PDF with sections, diagrams, and a glossary.",
        },
      ],
    },
    {
      id: "output",
      title: "Output shape",
      fields: [
        {
          key: "outputFormat",
          type: "select",
          label: "Output format",
          required: true,
          options: [
            { value: "bullets", label: "Bulleted summary" },
            { value: "json", label: "Structured JSON" },
            { value: "table", label: "Markdown table" },
            { value: "report", label: "Report with sections" },
          ],
        },
        {
          key: "fields",
          type: "tags",
          label: "Fields to extract",
          help: "Add the keys you want in the JSON.",
          when: (a) => a.outputFormat === "json" || a.analysisType === "extract",
          max: 15,
        },
        {
          key: "criteria",
          type: "tags",
          label: "Comparison criteria",
          help: "Add the dimensions to compare against.",
          when: (a) => a.analysisType === "compare",
          max: 10,
          required: true,
        },
      ],
    },
  ],
};
