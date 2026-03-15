import { ProjectType } from "@prisma/client";
import { GenerationInput, GeneratedPayload } from "@/lib/generation/types";
import { TemplateRenderer } from "@/lib/generation/templates/base";

function commonFiles(input: GenerationInput): GeneratedPayload {
  const fileTree = [
    { path: "README.md", content: `# ${input.title}\n\nPrompt: ${input.prompt}` },
    { path: "DEPLOYMENT.md", content: "Deploy on Vercel. Configure env vars. Run migrations." }
  ];

  return {
    summary: `${input.projectType} scaffold for ${input.companyName ?? "your brand"}`,
    stack: ["Next.js", "TypeScript", "Tailwind", "Prisma"],
    modules: ["auth", "dashboard", "billing"],
    files: fileTree,
    deploymentNotes: "Use Vercel + managed Postgres. Add Stripe webhook secret."
  };
}

class LandingRenderer implements TemplateRenderer {
  render(input: GenerationInput): GeneratedPayload {
    const base = commonFiles(input);
    base.modules.push("hero", "pricing", "faq", "testimonials");
    base.files.push({ path: "app/page.tsx", content: "export default function Page(){return <main>Landing</main>;}" });
    return base;
  }
}

class SaasRenderer implements TemplateRenderer {
  render(input: GenerationInput): GeneratedPayload {
    const base = commonFiles(input);
    base.modules.push("projects", "usage-guard", "admin");
    base.files.push({ path: "app/dashboard/page.tsx", content: "export default function Dashboard(){return <main>Dashboard</main>;}" });
    return base;
  }
}

class ApiRenderer implements TemplateRenderer {
  render(input: GenerationInput): GeneratedPayload {
    const base = commonFiles(input);
    base.modules.push("REST routes", "schema validation", "api docs");
    base.files.push({ path: "app/api/health/route.ts", content: "export async function GET(){return Response.json({ok:true})}" });
    return base;
  }
}

class AdminRenderer implements TemplateRenderer {
  render(input: GenerationInput): GeneratedPayload {
    const base = commonFiles(input);
    base.modules.push("admin auth", "user table", "audit logs");
    base.files.push({ path: "app/admin/page.tsx", content: "export default function Admin(){return <main>Admin</main>;}" });
    return base;
  }
}

export const rendererByType: Record<ProjectType, TemplateRenderer> = {
  LANDING_PAGE: new LandingRenderer(),
  SAAS_STARTER: new SaasRenderer(),
  API_BACKEND: new ApiRenderer(),
  ADMIN_DASHBOARD: new AdminRenderer(),
  BLOG_SITE: new LandingRenderer()
};
