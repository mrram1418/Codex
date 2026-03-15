import { ArtifactType, GenerationStatus, Plan, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { rendererByType } from "@/lib/generation/templates/renderers";
import { createProjectSchema } from "@/lib/validators";
import { ensureGenerationQuota } from "@/lib/services/usage-guard";

export async function createGenerationJob(input: unknown, userId: string) {
  const data = createProjectSchema.parse(input);
  const subscription = await prisma.subscription.findUnique({ where: { userId } });
  const plan = subscription?.plan ?? Plan.FREE;

  const quota = await ensureGenerationQuota(userId, plan);
  if (!quota.allowed) {
    throw new Error(`Quota exceeded: ${quota.used}/${quota.limit}. Upgrade to continue.`);
  }

  const template = await prisma.template.findUnique({ where: { id: data.templateId } });
  if (!template || !template.isActive) throw new Error("Template unavailable.");
  if (template.isPremium && plan === Plan.FREE) throw new Error("Premium template requires Pro or Team.");

  const rendered = rendererByType[data.projectType].render(data);

  return prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        userId,
        title: data.title,
        prompt: data.prompt,
        projectType: data.projectType
      }
    });

    const generation = await tx.generation.create({
      data: {
        projectId: project.id,
        userId,
        templateId: template.id,
        status: GenerationStatus.COMPLETED,
        summary: rendered.summary,
        stack: rendered.stack,
        modules: rendered.modules,
        startedAt: new Date(),
        completedAt: new Date(),
        artifacts: {
          create: [
            ...rendered.files.map((file) => ({
              path: file.path,
              content: file.content,
              type: ArtifactType.CODE_FILE
            })),
            {
              path: "README.md",
              content: rendered.files.find((f) => f.path === "README.md")?.content ?? rendered.summary,
              type: ArtifactType.README
            },
            {
              path: "DEPLOYMENT.md",
              content: rendered.deploymentNotes,
              type: ArtifactType.DEPLOYMENT_NOTES
            },
            {
              path: "manifest.json",
              content: JSON.stringify({ stack: rendered.stack, modules: rendered.modules }, null, 2),
              type: ArtifactType.MANIFEST
            }
          ]
        }
      },
      include: { artifacts: true, template: true, project: true }
    });

    await tx.usageEvent.create({
      data: {
        userId,
        eventType: "generation.created",
        metadata: { generationId: generation.id }
      }
    });

    await tx.auditLog.create({
      data: {
        userId,
        action: "generation.create",
        targetType: "Generation",
        targetId: generation.id,
        metadata: { projectId: project.id, templateId: template.id }
      }
    });

    return generation;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
}
