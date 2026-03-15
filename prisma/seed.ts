import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("PromptForge123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@promptforge.dev" },
    update: {},
    create: {
      email: "admin@promptforge.dev",
      name: "Admin User",
      role: "ADMIN",
      passwordHash,
      subscription: { create: { plan: "TEAM" } }
    }
  });

  const user = await prisma.user.upsert({
    where: { email: "demo@promptforge.dev" },
    update: {},
    create: {
      email: "demo@promptforge.dev",
      name: "Demo User",
      role: "USER",
      passwordHash,
      subscription: { create: { plan: "PRO" } }
    }
  });

  const templates = await Promise.all([
    prisma.template.upsert({
      where: { slug: "lp-fast-launch" },
      update: {},
      create: { name: "Fast Launch Landing", slug: "lp-fast-launch", description: "Modern SaaS landing", projectType: "LANDING_PAGE", isPremium: false, configJson: { sections: ["hero", "pricing", "faq"] } }
    }),
    prisma.template.upsert({
      where: { slug: "saas-pro-kit" },
      update: {},
      create: { name: "SaaS Pro Kit", slug: "saas-pro-kit", description: "Full SaaS starter", projectType: "SAAS_STARTER", isPremium: true, configJson: { modules: ["auth", "billing", "dashboard"] } }
    }),
    prisma.template.upsert({
      where: { slug: "api-core" },
      update: {},
      create: { name: "API Core", slug: "api-core", description: "Typed backend API starter", projectType: "API_BACKEND", isPremium: false, configJson: { modules: ["router", "db", "docs"] } }
    }),
    prisma.template.upsert({
      where: { slug: "admin-ops" },
      update: {},
      create: { name: "Admin Ops", slug: "admin-ops", description: "Admin dashboard starter", projectType: "ADMIN_DASHBOARD", isPremium: true, configJson: { modules: ["tables", "analytics", "audit"] } }
    })
  ]);

  const project = await prisma.project.create({
    data: {
      userId: user.id,
      title: "AI Sales Launchpad",
      prompt: "Build me a SaaS landing page for an AI sales tool with pricing, testimonials, FAQ, and Stripe checkout.",
      projectType: "LANDING_PAGE"
    }
  });

  const generation = await prisma.generation.create({
    data: {
      projectId: project.id,
      userId: user.id,
      templateId: templates[0].id,
      status: "COMPLETED",
      summary: "Generated polished SaaS landing page starter",
      stack: ["Next.js", "Tailwind", "Stripe"],
      modules: ["hero", "pricing", "faq"],
      startedAt: new Date(),
      completedAt: new Date()
    }
  });

  await prisma.artifact.createMany({
    data: [
      { generationId: generation.id, path: "README.md", content: "# AI Sales Launchpad", type: "README" },
      { generationId: generation.id, path: "app/page.tsx", content: "export default function Page(){return <main>Launchpad</main>}", type: "CODE_FILE" }
    ]
  });

  await prisma.auditLog.create({ data: { userId: admin.id, action: "seed.bootstrap", targetType: "System" } });
  await prisma.usageEvent.create({ data: { userId: user.id, eventType: "generation.created" } });
}

main().finally(() => prisma.$disconnect());
