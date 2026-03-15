import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createGenerationJob } from "@/lib/services/generation-service";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const input = Object.fromEntries(formData.entries());

  try {
    const generation = await createGenerationJob(input, session.user.id);
    return NextResponse.redirect(new URL(`/projects/${generation.projectId}`, req.url));
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
