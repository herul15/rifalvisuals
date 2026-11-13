import { defineConfig, devices } from "@playwright/test";

if (process.env.RIFAL_TEST_MODE !== "e2e") throw new Error("Use npm run test:e2e so the dedicated test database is configured.");

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Mobile Chrome",
      use: {
        ...devices["Pixel 5"],
        viewport: { width: 375, height: 667 },
      },
    },
  ],
  webServer: {
    command: "npm run start",
    port: 3000,
    reuseExistingServer: false,
    timeout: 120000,
  },
});
