import { Plan } from "@prisma/client";

export const PLAN_LIMITS: Record<Plan, number> = {
  FREE: 3,
  PRO: 50,
  TEAM: 250
};

export const PREMIUM_TEMPLATE_PLANS: Plan[] = ["PRO", "TEAM"];
