import { ProjectType } from "@prisma/client";
import { z } from "zod";
import { sanitizeText } from "@/lib/security";

const sanitizedString = (min: number, max: number) =>
  z.string().min(min).max(max).transform((v) => sanitizeText(v));

export const createProjectSchema = z.object({
  title: sanitizedString(3, 120),
  prompt: sanitizedString(20, 5000),
  projectType: z.nativeEnum(ProjectType),
  templateId: z.string().cuid(),
  companyName: z.string().max(80).transform((v) => sanitizeText(v)).optional(),
  primaryColor: z.string().regex(/^#([0-9A-Fa-f]{3}){1,2}$/).optional(),
  stylePreference: z.string().max(60).transform((v) => sanitizeText(v)).optional(),
  tone: z.string().max(60).transform((v) => sanitizeText(v)).optional()
});
