import { ProjectType } from "@prisma/client";

export type GenerationInput = {
  title: string;
  prompt: string;
  projectType: ProjectType;
  companyName?: string;
  primaryColor?: string;
  stylePreference?: string;
  tone?: string;
};

export type GeneratedFile = { path: string; content: string };

export type GeneratedPayload = {
  summary: string;
  stack: string[];
  modules: string[];
  files: GeneratedFile[];
  deploymentNotes: string;
};
