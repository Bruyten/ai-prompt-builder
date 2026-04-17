import type { QuestionnaireConfig } from "../../features/wizard/types";

export const marketingQuestionnaire: QuestionnaireConfig = {
  promptType: "MARKETING",
  label: "Marketing",
  tagline: "Ads, landing pages, social posts, and email campaigns.",
  icon: "📣",
  steps: [
    {
      id: "channel",
      title: "Channel & goal",
      fields: [
        {
          key: "channel",
          type: "select",
          label: "Channel",
          required: true,
          options: [
            { value: "landing", label: "Landing page" },
            { value: "email", label: "Email campaign" },
            { value: "social", label: "Social post" },
            { value: "ad", label: "Paid ad" },
            { value: "blog", label: "Blog SEO" },
          ],
        },
        {
          key: "goal",
          type: "select",
          label: "Primary goal",
          required: true,
          options: [
            { value: "signup", label: "Drive sign-ups" },
            { value: "purchase", label: "Drive purchases" },
            { value: "awareness", label: "Brand awareness" },
            { value: "engagement", label: "Engagement" },
            { value: "retention", label: "Retention" },
          ],
        },
      ],
    },
    {
      id: "product",
      title: "Product & audience",
      fields: [
        {
          key: "product",
          type: "text",
          label: "Product / offer",
          required: true,
          placeholder: "e.g. Lumen — a daily focus tracker",
        },
        {
          key: "audience",
          type: "text",
          label: "Target audience",
          required: true,
          placeholder: "e.g. Remote knowledge workers, 25–40",
        },
        {
          key: "valueProps",
          type: "tags",
          label: "Key value propositions",
          help: "What makes this offering compelling? Add 3–5.",
          max: 6,
          required: true,
        },
      ],
    },
    {
      id: "voice",
      title: "Voice & format",
      fields: [
        {
          key: "tone",
          type: "select",
          label: "Brand voice",
          required: true,
          options: [
            { value: "bold", label: "Bold & confident" },
            { value: "friendly", label: "Warm & friendly" },
            { value: "minimal", label: "Minimal & elegant" },
            { value: "playful", label: "Playful" },
            { value: "technical", label: "Technical" },
          ],
        },
        {
          key: "platform",
          type: "select",
          label: "Platform",
          when: (a) => a.channel === "social" || a.channel === "ad",
          options: [
            { value: "twitter", label: "X / Twitter" },
            { value: "linkedin", label: "LinkedIn" },
            { value: "instagram", label: "Instagram" },
            { value: "tiktok", label: "TikTok" },
            { value: "google", label: "Google Ads" },
            { value: "meta", label: "Meta Ads" },
          ],
        },
      ],
    },
  ],
};
