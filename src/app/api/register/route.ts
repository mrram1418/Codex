import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit, sanitizeText } from "@/lib/security";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  const limited = enforceRateLimit(`register:${ip}`, 10, 10 * 60 * 1000);
  if (!limited.allowed) {
    return NextResponse.json({ error: "Too many registration attempts" }, { status: 429 });
  }

  const formData = await req.formData();
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const hash = await bcrypt.hash(parsed.data.password, 12);

  try {
    await prisma.user.create({
      data: {
        name: sanitizeText(parsed.data.name),
        email: parsed.data.email.toLowerCase(),
        passwordHash: hash,
        subscription: { create: { plan: "FREE" } }
      }
    });
    return NextResponse.json({ message: "Account created." });
  } catch {
    return NextResponse.json({ error: "Account already exists" }, { status: 409 });
  }
}
