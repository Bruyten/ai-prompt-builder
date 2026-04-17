import type { QuestionnaireConfig } from "../../features/wizard/types";

export const imageQuestionnaire: QuestionnaireConfig = {
  promptType: "IMAGE",
  label: "Image Generation",
  tagline: "Craft detailed prompts for Midjourney, DALL·E, Stable Diffusion.",
  icon: "🎨",
  steps: [
    {
      id: "subject",
      title: "Subject",
      fields: [
        {
          key: "subject",
          type: "text",
          label: "Main subject",
          required: true,
          placeholder: "e.g. A lone astronaut on a red dune",
        },
        {
          key: "details",
          type: "textarea",
          label: "Subject details",
          help: "Pose, expression, clothing, props, etc.",
          rows: 3,
        },
      ],
    },
    {
      id: "style",
      title: "Style & medium",
      fields: [
        {
          key: "style",
          type: "select",
          label: "Style",
          required: true,
          options: [
            { value: "photorealistic", label: "Photorealistic" },
            { value: "cinematic", label: "Cinematic film still" },
            { value: "illustration", label: "Digital illustration" },
            { value: "anime", label: "Anime" },
            { value: "watercolor", label: "Watercolour" },
            { value: "3d", label: "3D render" },
            { value: "lowpoly", label: "Low poly" },
          ],
        },
        {
          key: "mood",
          type: "tags",
          label: "Mood / atmosphere",
          suggestions: ["dreamy", "ominous", "warm", "epic", "minimalist", "nostalgic"],
          max: 5,
        },
      ],
    },
    {
      id: "composition",
      title: "Composition",
      fields: [
        {
          key: "lighting",
          type: "select",
          label: "Lighting",
          options: [
            { value: "golden hour", label: "Golden hour" },
            { value: "studio", label: "Studio softbox" },
            { value: "neon", label: "Neon / cyberpunk" },
            { value: "natural", label: "Natural daylight" },
            { value: "moody", label: "Moody / low-key" },
          ],
        },
        {
          key: "camera",
          type: "select",
          label: "Camera / shot",
          when: (a) => a.style === "photorealistic" || a.style === "cinematic",
          options: [
            { value: "wide", label: "Wide shot" },
            { value: "closeup", label: "Close-up" },
            { value: "portrait", label: "Portrait" },
            { value: "aerial", label: "Aerial" },
            { value: "macro", label: "Macro" },
          ],
        },
        {
          key: "aspect",
          type: "radio",
          label: "Aspect ratio",
          required: true,
          options: [
            { value: "1:1", label: "Square (1:1)" },
            { value: "16:9", label: "Widescreen (16:9)" },
            { value: "9:16", label: "Portrait (9:16)" },
            { value: "3:2", label: "Photo (3:2)" },
          ],
        },
      ],
    },
    {
      id: "negative",
      title: "Avoid",
      fields: [
        {
          key: "negative",
          type: "tags",
          label: "Negative prompts",
          help: "Things the image should NOT contain.",
          suggestions: ["blurry", "extra fingers", "watermark", "low quality", "distorted"],
          max: 10,
        },
      ],
    },
  ],
};
