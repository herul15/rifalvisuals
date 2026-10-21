import { test, expect } from "@playwright/test";

test.describe("Admin CMS Flows", () => {
  test("redirects unauthenticated users from /admin/dashboard to /admin/login", async ({
    page,
  }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.locator("h1")).toContainText(/Admin CMS/i);
  });

  test("authenticates admin and accesses dashboard", async ({ page }) => {
    await page.goto("/admin/login");

    await page.fill("input#username", "admin");
    await page.fill("input#password", "AdminRifal2026!");
    await page.click("button[type='submit']");

    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });
    await expect(page.locator("h1")).toContainText(/Ringkasan Operasional/i);
  });

  test("manages package prices in /admin/packages", async ({ page }) => {
    // Login first
    await page.goto("/admin/login");
    await page.fill("input#username", "admin");
    await page.fill("input#password", "AdminRifal2026!");
    await page.click("button[type='submit']");
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });

    // Go to packages
    await page.goto("/admin/packages");
    await expect(page.locator("h1")).toContainText(/Manajemen Paket & Harga/i);

    // Verify packages list is displayed
    await expect(page.getByText("Ka'bah & Pelataran")).toBeVisible();
  });

  test("manages media consent in /admin/portfolio", async ({ page }) => {
    // Login
    await page.goto("/admin/login");
    await page.fill("input#username", "admin");
    await page.fill("input#password", "AdminRifal2026!");
    await page.click("button[type='submit']");
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 10000 });

    // Go to portfolio
    await page.goto("/admin/portfolio");
    await expect(page.locator("h1")).toContainText(/Kelola Portofolio Media/i);
    await expect(page.getByText(/Consent OK/i).first()).toBeVisible();
  });
});
