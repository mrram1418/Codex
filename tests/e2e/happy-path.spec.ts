import { test, expect } from "@playwright/test";

test("marketing homepage renders", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000");
  await expect(page.getByText("Describe your app. Ship a working starter in minutes.")).toBeVisible();
});
