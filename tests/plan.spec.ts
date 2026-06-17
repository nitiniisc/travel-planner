import { test, expect } from "@playwright/test";

function randomTestEmail() {
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `test+${unique}@playwright-tests.com`;
}

test("plan, save, dashboard, delete end to end", async ({ page }) => {
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

  // Skeleton loaders appear while generating
  await expect(page.getByTestId("suggestions-loading")).toBeVisible();

  const firstCard = page.locator("h3").first();
  await expect(firstCard).toBeVisible({ timeout: 45_000 });
  const destination = await firstCard.innerText();

  await page.getByRole("button", { name: /view full details/i }).first().click();
  await expect(page.getByText("Cost breakdown").first()).toBeVisible();
  await expect(page.getByText("Day-by-day itinerary").first()).toBeVisible();

  await page.getByRole("button", { name: /save trip/i }).first().click();
  await expect(page.getByText(/saved to your trips/i)).toBeVisible({ timeout: 10_000 });
  await expect(page.getByRole("button", { name: "Saved" }).first()).toBeVisible();

  // Dashboard shows the saved trip in "Recent trips"
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Recent trips" })).toBeVisible();
  await expect(page.getByText(destination).first()).toBeVisible();

  // History: view details, then delete
  await page.goto("/history");
  await expect(page.getByText(destination)).toBeVisible({ timeout: 10_000 });

  await page.getByRole("button", { name: "Delete trip" }).first().click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByText(/removed from your trips/i)).toBeVisible({ timeout: 10_000 });

  await expect(page.getByText(/no saved trips yet/i)).toBeVisible({ timeout: 10_000 });
});
