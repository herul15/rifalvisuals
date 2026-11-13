import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    fileParallelism: process.env.RIFAL_TEST_MODE !== "integration",
    include: process.env.RIFAL_TEST_MODE === "integration" ? ["tests/integration/**/*.test.ts"] : ["tests/unit/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
