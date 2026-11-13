import { test, expect } from "@playwright/test";
import { login } from "./helpers";

test("rejects unsigned cookies, protects every admin read endpoint, and hides demo credentials", async ({ page, context, request }) => {
  await context.addCookies([{ name: "rifal_admin_session", value: "abcdefghijklmnop.invalid", url: "http://localhost:3000" }]);
  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByText("Kredensial bawaan")).toHaveCount(0);
  for (const [method, endpoint] of [
    ["GET", "portfolio"], ["GET", "testimonials"], ["GET", "settings"], ["GET", "media"],
    ["POST", "portfolio"], ["POST", "testimonials"], ["PATCH", "settings"],
    ["PATCH", "packages/fixture"], ["PATCH", "portfolio/fixture"], ["PATCH", "testimonials/fixture"],
    ["DELETE", "portfolio/fixture"], ["DELETE", "testimonials/fixture"],
  ]) expect((await request.fetch("/api/admin/" + endpoint, { method })).status()).toBe(401);
});

test.describe("Authenticated admin", () => {
  test.beforeEach(async ({ page }) => { await login(page); });
  test("logs out and loses access to protected pages", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Ringkasan Operasional");
    await page.getByRole("button", { name: "Keluar Akun" }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
    await page.goto("/admin/packages");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("edits a price through the CMS and publishes the exact amount", async ({ page }) => {
    const catalogue = (await (await page.request.get("/api/packages")).json()).data;
    const pkg = catalogue.categories.flatMap((c: { packages: Array<{ id: string; slug: string; variants: Array<{ id: string; price: number; participantType: string }> }> }) => c.packages).find((p: {slug:string}) => p.slug === "kabah-only");
    const variant = pkg.variants.find((v: { participantType: string }) => v.participantType === "SENDIRI");
    await page.goto("/admin/packages");
    try {
      await page.getByTestId("admin-package-kabah-only").getByRole("row").filter({ hasText: "Sendiri (1 orang)" }).getByRole("button", { name: "Ubah Harga" }).click();
      await page.getByLabel("Harga Baru").fill("1350500");
      await page.getByRole("button", { name: "Simpan Perubahan" }).click();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await page.goto("/");
      await expect(page.getByTestId("package-kabah-only")).toContainText("Rp1.350.500");
    } finally {
      const response = await page.request.patch("/api/admin/packages/" + pkg.id, { data: { variantUpdates: [{ variantId: variant.id, price: variant.price }] } });
      expect(response.ok()).toBe(true);
    }
  });

  test("revokes portfolio consent without falling back to static photos", async ({ page }) => {
    try {
      await page.goto("/admin/portfolio");
      await page.getByTestId("portfolio-fixture-public").getByRole("button", { name: "Consent OK" }).click();
      await expect(page.getByTestId("portfolio-fixture-public").getByRole("button", { name: "Privat" })).toBeVisible();
      await page.goto("/");
      await expect(page.locator("#portfolio")).toContainText("Belum ada portofolio");
      await expect(page.locator("#portfolio img")).toHaveCount(0);
      await expect(page.getByText("PRIVATE FIXTURE DO NOT PUBLISH")).toHaveCount(0);
    } finally {
      expect((await page.request.patch("/api/admin/portfolio/fixture-public", { data: { clientConsent: true } })).ok()).toBe(true);
    }
  });

  test("moderates testimonials without exposing private reviews", async ({ page }) => {
    try {
      await page.goto("/admin/testimonials");
      await page.getByTestId("testimonial-fixture-public-review").getByRole("button", { name: "Tayang" }).click();
      await page.goto("/");
      await expect(page.locator("#testimonials")).toContainText("Belum ada testimoni");
      await expect(page.locator("#testimonials")).not.toContainText("PRIVATE FIXTURE REVIEW");
    } finally {
      expect((await page.request.patch("/api/admin/testimonials/fixture-public-review", { data: { isApproved: true } })).ok()).toBe(true);
    }
  });

  test("publishes changed settings consistently across home, terms, metadata and WhatsApp", async ({ page }) => {
    const original = (await (await page.request.get("/api/admin/settings")).json()).data;
    try {
      await page.goto("/admin/settings");
      await page.getByLabel("Nama Resmi Perusahaan").fill("Rifalvisuals Pengujian");
      await page.getByLabel("Tagline Utama").fill("Tagline pengujian konsistensi CMS");
      await page.getByLabel("Nomor WhatsApp Resmi").fill("6281234567890");
      await page.locator("#setting-dpPercentage").fill("35");
      await page.getByLabel("Meeting Point Madinah").fill("Pintu Pengujian 999");
      await page.getByRole("button", { name: "Simpan Semua Pengaturan" }).click();
      await expect(page.getByText("Pengaturan situs berhasil diperbarui.", { exact: true })).toBeVisible();
      await page.goto("/");
      await expect(page).toHaveTitle(/Rifalvisuals Pengujian/);
      await expect(page.locator("h1")).toHaveText("Tagline pengujian konsistensi CMS");
      await expect(page.locator("#pricing")).toContainText("35%");
      await expect(page.locator("#booking")).toContainText("Pintu Pengujian 999");
      await expect(page.getByRole("link", { name: "Tanya Admin via WhatsApp" })).toHaveAttribute("href", /wa.me\/6281234567890/);
      await page.goto("/syarat-ketentuan");
      await expect(page).toHaveTitle(/Rifalvisuals Pengujian/);
      await expect(page.getByText(/DP.*sebesar 35%/)).toBeVisible();
      await expect(page.getByText(/Pintu Pengujian 999/)).toBeVisible();
      expect(await page.locator('meta[property="og:site_name"]').getAttribute("content")).toBe("Rifalvisuals Pengujian");
    } finally {
      expect((await page.request.patch("/api/admin/settings", { data: original })).ok()).toBe(true);
    }
  });
});
