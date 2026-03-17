import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const templateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(5),
  projectType: z.enum(["LANDING_PAGE", "SAAS_STARTER", "API_BACKEND", "ADMIN_DASHBOARD", "BLOG_SITE"]),
  isPremium: z.boolean().default(false),
  isActive: z.boolean().default(true)
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") return null;
  return session.user.id;
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const templates = await prisma.template.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(templates);
}

export async function POST(req: Request) {
  const adminId = await requireAdmin();
  if (!adminId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = templateSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const template = await prisma.template.create({ data: { ...parsed.data, configJson: {} } });
  await prisma.auditLog.create({
    data: { userId: adminId, action: "template.create", targetType: "Template", targetId: template.id }
  });

  return NextResponse.json(template, { status: 201 });
}
