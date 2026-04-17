/**
 * Registry of every questionnaire config.
 *
 * Importing this map is the only place the app needs to know about prompt types
 * for UI purposes — adding a new type is a single-line registration here.
 */
import type { PromptType } from "../../types/api";
import type { QuestionnaireConfig } from "../../features/wizard/types";
import { generalQuestionnaire } from "./general";
import { codingQuestionnaire } from "./coding";
import { writingQuestionnaire } from "./writing";
import { marketingQuestionnaire } from "./marketing";
import { imageQuestionnaire } from "./image";
import { analysisQuestionnaire } from "./analysis";

export const questionnaires: Record<PromptType, QuestionnaireConfig> = {
  GENERAL: generalQuestionnaire,
  CODING: codingQuestionnaire,
  WRITING: writingQuestionnaire,
  MARKETING: marketingQuestionnaire,
  IMAGE: imageQuestionnaire,
  ANALYSIS: analysisQuestionnaire,
};

export const allQuestionnaires: QuestionnaireConfig[] = Object.values(questionnaires);

export function getQuestionnaire(type: PromptType): QuestionnaireConfig {
  return questionnaires[type];
}
