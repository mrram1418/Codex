import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  const session = await auth();
  if (!session?.user?.id) return <main className="p-10">Unauthorized</main>;

  const project = await prisma.project.findFirst({
    where: { id: params.projectId, userId: session.user.id },
    include: {
      generations: {
        include: { artifacts: true, template: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!project) notFound();

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold">{project.title}</h1>
      <p className="my-2 text-slate-300">{project.prompt}</p>
      <section className="mt-6 space-y-4">
        {project.generations.map((generation) => (
          <article className="card" key={generation.id}>
            <div className="mb-3 flex justify-between">
              <div>
                <p className="font-semibold">{generation.template.name}</p>
                <p className="text-sm text-slate-400">{generation.status}</p>
              </div>
              <a href={`/api/projects/${project.id}/export?generationId=${generation.id}`} className="rounded bg-slate-800 px-3 py-2 text-sm">Export JSON</a>
            </div>
            <p className="mb-3 text-slate-300">{generation.summary}</p>
            <div className="max-h-72 space-y-2 overflow-auto rounded border border-slate-700 p-3">
              {generation.artifacts.map((artifact) => (
                <details key={artifact.id}>
                  <summary className="cursor-pointer text-sm font-medium">{artifact.path}</summary>
                  <pre className="overflow-x-auto text-xs text-slate-300">{artifact.content}</pre>
                </details>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
