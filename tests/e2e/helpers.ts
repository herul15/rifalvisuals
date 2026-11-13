import { expect, type Page } from "@playwright/test";
import { TEST_ADMIN_USERNAME, TEST_ADMIN_PASSWORD } from "../fixtures/credentials";

export async function login(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Username atau Email").fill(TEST_ADMIN_USERNAME);
  await page.getByLabel("Kata Sandi").fill(TEST_ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Masuk ke Dashboard" }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard/);
}
