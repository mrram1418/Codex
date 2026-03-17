import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS } from "@/lib/plans";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return <main className="p-10">Unauthorized</main>;

  const [projects, subscription, usage] = await Promise.all([
    prisma.project.findMany({ where: { userId: session.user.id }, take: 5, orderBy: { createdAt: "desc" } }),
    prisma.subscription.findUnique({ where: { userId: session.user.id } }),
    prisma.usageEvent.count({ where: { userId: session.user.id, eventType: "generation.created" } })
  ]);

  const plan = subscription?.plan ?? "FREE";
  const limit = PLAN_LIMITS[plan];

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/projects/new" className="rounded-md bg-brand-500 px-4 py-2 font-semibold">Create new project</Link>
      </div>
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="card"><h2 className="text-sm text-slate-300">Current plan</h2><p className="text-2xl font-bold">{plan}</p></div>
        <div className="card"><h2 className="text-sm text-slate-300">Usage</h2><p className="text-2xl font-bold">{usage}/{limit}</p></div>
        <div className="card"><h2 className="text-sm text-slate-300">Projects</h2><p className="text-2xl font-bold">{projects.length}</p></div>
      </section>
      <section className="card">
        <h2 className="mb-3 text-xl font-semibold">Recent projects</h2>
        <div className="space-y-2">
          {projects.length ? projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="block rounded-md border border-slate-700 p-3 hover:bg-slate-800">
              <p className="font-medium">{project.title}</p>
              <p className="text-sm text-slate-400">{project.projectType}</p>
            </Link>
          )) : <p className="text-slate-400">No projects yet. Start by creating your first generation.</p>}
        </div>
      </section>
    </main>
  );
}
