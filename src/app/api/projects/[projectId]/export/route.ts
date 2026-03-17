import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const generationId = new URL(req.url).searchParams.get("generationId");
  if (!generationId) return NextResponse.json({ error: "generationId required" }, { status: 400 });

  const generation = await prisma.generation.findFirst({
    where: { id: generationId, projectId: params.projectId, userId: session.user.id },
    include: { artifacts: true, template: true, project: true }
  });

  if (!generation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(generation, {
    headers: {
      "Content-Disposition": `attachment; filename="${generation.project.title.replaceAll(" ", "-")}.json"`
    }
  });
}
