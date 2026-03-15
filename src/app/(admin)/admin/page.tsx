import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return <main className="p-10">Admin access required.</main>;
  }

  const [users, generations, templates, auditLogs] = await Promise.all([
    prisma.user.findMany({ take: 20, orderBy: { createdAt: "desc" }, include: { subscription: true } }),
    prisma.generation.findMany({ take: 20, orderBy: { createdAt: "desc" }, include: { user: true, project: true } }),
    prisma.template.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.auditLog.findMany({ take: 20, orderBy: { createdAt: "desc" } })
  ]);

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">Admin control center</h1>
      <section className="card">
        <h2 className="mb-3 text-xl font-semibold">Users</h2>
        <div className="overflow-auto"><table className="w-full text-left text-sm"><thead><tr><th>Email</th><th>Role</th><th>Plan</th></tr></thead><tbody>{users.map((u) => <tr key={u.id}><td>{u.email}</td><td>{u.role}</td><td>{u.subscription?.plan ?? "FREE"}</td></tr>)}</tbody></table></div>
      </section>
      <section className="card">
        <h2 className="mb-3 text-xl font-semibold">Generations</h2>
        <ul className="space-y-2 text-sm">{generations.map((g) => <li key={g.id}>{g.user.email} • {g.project.title} • {g.status}</li>)}</ul>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="card"><h2 className="mb-3 text-xl font-semibold">Templates</h2><ul className="space-y-2 text-sm">{templates.map((t) => <li key={t.id}>{t.name} • {t.isPremium ? "Premium" : "Basic"} • {t.isActive ? "Active" : "Disabled"}</li>)}</ul></div>
        <div className="card"><h2 className="mb-3 text-xl font-semibold">Recent system events</h2><ul className="space-y-2 text-sm">{auditLogs.map((log) => <li key={log.id}>{log.action} ({log.targetType})</li>)}</ul></div>
      </section>
    </main>
  );
}
