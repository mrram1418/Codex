import { describe, expect, it } from "vitest";
import { rendererByType } from "@/lib/generation/templates/renderers";

describe("template renderers", () => {
  it("builds landing payload with files", () => {
    const output = rendererByType.LANDING_PAGE.render({
      title: "Landing",
      prompt: "Build a landing page for AI sales tool with pricing and FAQ sections.",
      projectType: "LANDING_PAGE"
    });

    expect(output.summary.length).toBeGreaterThan(5);
    expect(output.files.some((f) => f.path === "README.md")).toBe(true);
  });
});
