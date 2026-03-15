import { ProjectType } from "@prisma/client";
import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(3).max(120),
  prompt: z.string().min(20).max(5000),
  projectType: z.nativeEnum(ProjectType),
  templateId: z.string().cuid(),
  companyName: z.string().max(80).optional(),
  primaryColor: z.string().regex(/^#([0-9A-Fa-f]{3}){1,2}$/).optional(),
  stylePreference: z.string().max(60).optional(),
  tone: z.string().max(60).optional()
});
