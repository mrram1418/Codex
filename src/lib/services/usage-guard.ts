import { Plan } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS } from "@/lib/plans";

export async function ensureGenerationQuota(userId: string, plan: Plan) {
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const count = await prisma.usageEvent.count({
    where: {
      userId,
      eventType: "generation.created",
      createdAt: { gte: monthStart }
    }
  });

  const limit = PLAN_LIMITS[plan];
  return { allowed: count < limit, used: count, limit };
}
