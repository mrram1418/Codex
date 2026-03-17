import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function NewProjectPage() {
  const session = await auth();
  if (!session?.user?.id) return <main className="p-10">Unauthorized</main>;

  const templates = await prisma.template.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Generate project</h1>
      <form action="/api/generate" method="post" className="space-y-4 card">
        <input name="title" placeholder="Project title" className="w-full rounded bg-slate-800 p-2" required />
        <textarea name="prompt" placeholder="Describe your app in plain English" className="h-40 w-full rounded bg-slate-800 p-2" required />
        <select name="projectType" className="w-full rounded bg-slate-800 p-2">
          <option value="LANDING_PAGE">Landing page</option>
          <option value="SAAS_STARTER">SaaS starter</option>
          <option value="API_BACKEND">API backend</option>
          <option value="ADMIN_DASHBOARD">Admin dashboard</option>
          <option value="BLOG_SITE">Blog/site</option>
        </select>
        <select name="templateId" className="w-full rounded bg-slate-800 p-2">
          {templates.map((template) => (
            <option key={template.id} value={template.id}>{template.name} {template.isPremium ? "(Premium)" : ""}</option>
          ))}
        </select>
        <input name="companyName" placeholder="Company name (optional)" className="w-full rounded bg-slate-800 p-2" />
        <input name="primaryColor" placeholder="#3266ff" className="w-full rounded bg-slate-800 p-2" />
        <input name="stylePreference" placeholder="Style preference" className="w-full rounded bg-slate-800 p-2" />
        <input name="tone" placeholder="Tone" className="w-full rounded bg-slate-800 p-2" />
        <button className="w-full rounded bg-brand-500 p-2 font-semibold" type="submit">Generate project</button>
      </form>
    </main>
  );
}
