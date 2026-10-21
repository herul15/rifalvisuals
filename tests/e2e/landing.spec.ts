import { test, expect } from "@playwright/test";

test.describe("Landing Page & Core User Flows", () => {
  test("loads landing page with official brand title and logo", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Rifalvisuals Indonesia/i);

    // Official logo check in header
    const logo = page.locator("header img[alt*='Rifalvisuals']");
    await expect(logo).toBeVisible();
  });

  test("displays official pricing for Ka'bah & Pelataran (Best Seller)", async ({ page }) => {
    await page.goto("/#pricing");

    // Ka'bah & Pelataran card in pricing section
    const pricingSection = page.locator("#pricing");
    await expect(pricingSection).toBeVisible();

    // Verify official price is rendered
    await expect(page.getByText("Rp2.020.500")).toBeVisible();
  });

  test("contains contextual WhatsApp CTAs with official number 62881080522136", async ({ page }) => {
    await page.goto("/");

    // Floating WhatsApp button or section CTA
    const waLinks = page.locator("a[href*='wa.me/62881080522136']");
    const count = await waLinks.count();
    expect(count).toBeGreaterThan(0);

    const firstHref = await waLinks.first().getAttribute("href");
    expect(firstHref).toContain("62881080522136");
  });

  test("navigates to Syarat & Ketentuan page and displays DP 50% & Meeting Points", async ({ page }) => {
    await page.goto("/syarat-ketentuan");
    await expect(page.locator("h1")).toContainText(/Syarat & Ketentuan/i);
    await expect(page.getByText(/Uang Muka \(DP\) sebesar 50%/i)).toBeVisible();
    await expect(page.getByText(/Pintu 333 \/ 310/i)).toBeVisible();
    await expect(page.getByText(/WC 3/i)).toBeVisible();
    await expect(page.getByText(/Hotel Al Shohada/i)).toBeVisible();
  });

  test("mobile viewport has no horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
