import { test, expect } from "@playwright/test";

function randomTestEmail() {
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `test+${unique}@playwright-tests.com`;
}

test("plan a trip end to end", async ({ page }) => {
  const email = randomTestEmail();
  const password = "Playwright-Test-1234!";

  await page.goto("/signup");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password").fill(password);
  await page.getByRole("button", { name: /sign up/i }).click();
  await expect(page.getByTestId("signup-success")).toBeVisible({ timeout: 10_000 });

  await page.goto("/plan");
  await page.getByLabel("Start date").fill("2026-09-01");
  await page.getByLabel("End date").fill("2026-09-05");
  await page.getByLabel("Number of travelers").fill("2");
  await page.getByLabel("Starting city").fill("Bengaluru");
  await page.getByLabel("Budget (INR)").fill("40000");
  await page.getByRole("button", { name: /generate trip ideas/i }).click();

  const firstCard = page.locator("h3").first();
  await expect(firstCard).toBeVisible({ timeout: 10_000 });
  const destination = await firstCard.innerText();

  await page.getByRole("button", { name: /save trip/i }).first().click();
  await expect(page.getByRole("button", { name: "Saved" }).first()).toBeVisible({
    timeout: 10_000,
  });

  await page.goto("/history");
  await expect(page.getByText(destination)).toBeVisible({ timeout: 10_000 });
});
