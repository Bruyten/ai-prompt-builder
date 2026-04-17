/**
 * Shared API DTO types — mirror the backend response shapes.
 * Kept hand-written (vs codegen) to keep the project simple and dependency-free.
 */

export type PromptType =
  | "GENERAL"
  | "CODING"
  | "WRITING"
  | "MARKETING"
  | "IMAGE"
  | "ANALYSIS";

export type PromptStatus = "DRAFT" | "FINAL" | "ARCHIVED";

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  promptType: PromptType;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { prompts: number };
}

export interface ScoreBreakdown {
  total: number;
  dimensions: {
    clarity: number;
    specificity: number;
    context: number;
    constraints: number;
    structure: number;
  };
  suggestions: string[];
}

export interface PromptVersion {
  id: string;
  promptId: string;
  version: number;
  text: string;
  score: number;
  scoreBreakdown: ScoreBreakdown | null;
  createdAt: string;
}

export interface Prompt {
  id: string;
  userId: string;
  projectId: string | null;
  promptType: PromptType;
  title: string;
  currentText: string;
  status: PromptStatus;
  score: number;
  scoreBreakdown: ScoreBreakdown | null;
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
  versions?: PromptVersion[];
  project?: Pick<Project, "id" | "name"> | null;
}

export interface Template {
  id: string;
  userId: string | null;
  promptType: PromptType;
  title: string;
  description: string | null;
  body: string;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromptSession {
  id: string;
  userId: string;
  projectId: string | null;
  promptType: PromptType;
  answers: Record<string, unknown>;
  currentStep: number;
  completed: boolean;
  resultPromptId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PreviewResponse {
  text: string;
  score: number;
  scoreBreakdown: ScoreBreakdown;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
