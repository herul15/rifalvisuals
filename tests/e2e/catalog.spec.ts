import { test, expect } from "@playwright/test";

test("filters unsupported participant variants and keeps manual variant choice usable", async ({ page }) => {
  await page.goto("/#pricing");
  const pricing = page.locator("#pricing");
  await pricing.getByRole("button", { name: "Keluarga (7 orang)", exact: true }).click();
  await expect(page.getByTestId("package-kabah-only")).toHaveCount(0);
  await expect(page.getByTestId("package-kabah-pelataran")).toContainText("Rp5.170.500");
  await pricing.getByRole("button", { name: "Semua Varian", exact: true }).click();
  const card = page.getByTestId("package-kabah-only");
  await card.getByRole("button", { name: "Berdua", exact: true }).click();
  await expect(card).toContainText("Rp1.800.000");
});

test("keeps add-ons within their package and location and sends readable WhatsApp details despite analytics failure", async ({ page }) => {
  await page.goto("/#pricing");
  await page.evaluate(() => {
    const target = window as typeof window & { capturedWhatsApp?: string };
    window.open = ((url: string | URL | undefined) => { target.capturedWhatsApp = String(url); return null; }) as typeof window.open;
  });
  await page.route("**/api/analytics/whatsapp-click", route => route.abort());
  const first = page.getByTestId("package-kabah-only");
  await first.getByRole("button", { name: /Lihat Opsi Layanan/ }).click();
  const modal = page.getByRole("dialog");
  await modal.getByRole("button", { name: "Pilih", exact: true }).first().click();
  await modal.getByRole("button", { name: /Selesai/ }).click();
  await first.getByRole("button", { name: "Konsultasi Paket Ini" }).click();
  const readMessage = () => page.evaluate(() => {
    const url = (window as typeof window & { capturedWhatsApp?: string }).capturedWhatsApp;
    return url ? new URL(url).searchParams.get("text") : null;
  });
  await expect.poll(readMessage).toContain("Spot Eskalator Jabal Omar");
  expect(await readMessage()).toContain("Estimasi Biaya Dasar Paket");
  await page.getByTestId("package-pelataran-only").getByRole("button", { name: "Konsultasi Paket Ini" }).click();
  await expect.poll(readMessage).not.toContain("Layanan Tambahan");
  await page.locator("#pricing").getByRole("button", { name: "Masjid Nabawi (Madinah)", exact: true }).click();
  await page.getByTestId("package-dokumentasi-masjid-nabawi").getByRole("button", { name: "Konsultasi Paket Ini" }).click();
  await expect.poll(readMessage).not.toContain("Jabal Omar");
  await expect.poll(readMessage).not.toContain("Layanan Tambahan");
});

test("shows only approved public content and loads fonts locally", async ({ page }) => {
  const externalFonts: string[] = [];
  page.on("request", request => { if (/fonts\.(googleapis|gstatic)\.com/.test(request.url())) externalFonts.push(request.url()); });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("#portfolio")).toContainText("Dokumentasi pengujian Makkah");
  await expect(page.locator("body")).not.toContainText("PRIVATE FIXTURE");
  expect(externalFonts).toEqual([]);
});
