import { test, expect } from "@playwright/test";

const TEST_PASSWORD = "Playwright-Test-1234!";

function randomTestEmail() {
  return `test+${Date.now()}@playwright-tests.com`;
}

test.describe("authentication", () => {
  test("sign up, log in, and route protection", async ({ page }) => {
    const email = randomTestEmail();

    await page.goto("/signup");
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Password", { exact: true }).fill(TEST_PASSWORD);
    await page.getByLabel("Confirm password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /sign up/i }).click();

    const formError = page.getByTestId("form-error");
    const signupSuccess = page.getByTestId("signup-success");

    // Either the inline success message appears, or signup redirected
    // somewhere away from /signup; either counts as success.
    await expect(formError.or(signupSuccess)).toBeVisible({ timeout: 10_000 });
    await expect(formError).not.toBeVisible();
    const succeeded =
      (await signupSuccess.isVisible()) || !page.url().includes("/signup");
    expect(succeeded).toBe(true);

    await page.goto("/login");
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Password", { exact: true }).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /log in/i }).click();

    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 10_000 });

    await page.context().clearCookies();
    await page.goto("/history");
    await expect(page).toHaveURL(/\/login$/);
  });
});
