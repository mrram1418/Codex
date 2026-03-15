import { describe, expect, it } from "vitest";
import { PLAN_LIMITS } from "@/lib/plans";

describe("plan limits", () => {
  it("matches required monthly quotas", () => {
    expect(PLAN_LIMITS.FREE).toBe(3);
    expect(PLAN_LIMITS.PRO).toBe(50);
    expect(PLAN_LIMITS.TEAM).toBe(250);
  });
});
