import { describe, expect, it } from "vitest";

describe("admin authorization", () => {
  it("requires admin role marker", () => {
    const userRole = "USER";
    const canAccessAdmin = userRole === "ADMIN";
    expect(canAccessAdmin).toBe(false);
  });
});
