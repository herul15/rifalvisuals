import { it, expect } from "vitest";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname, basename } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

it("protects application databases configured in local, development, and production env files", () => {
  const moduleUrl = pathToFileURL(resolve("scripts/test-environment.mjs")).href;
  for (const appFile of [".env.local", ".env.production", ".env.production.local", ".env.development.local"]) {
    const directory = mkdtempSync(join(tmpdir(), "rifal-env-"));
    try {
      writeFileSync(join(directory, appFile), 'DATABASE_URL="postgresql://u:p@localhost/important_test"\n');
      writeFileSync(join(directory, ".env.test.local"), 'TEST_DATABASE_URL="postgresql://u:p@127.0.0.1/important_test"\n');
      const env = { ...process.env };
      for (const key of ["DATABASE_URL", "TEST_DATABASE_URL", "RIFAL_APPLICATION_DATABASE_URL", "__NEXT_PROCESSED_ENV", "NODE_ENV"]) delete env[key];
      const result = spawnSync(process.execPath, ["--input-type=module", "-e", `import { configureTestDatabase } from ${JSON.stringify(moduleUrl)}; try { configureTestDatabase(); } catch (error) { console.error(error.message); process.exitCode = 1; }`], { cwd: directory, env, encoding: "utf8" });
      expect(result.status, appFile).toBe(1);
      expect(result.stderr, appFile).toContain("differ");
    } finally {
      if (dirname(directory) !== resolve(tmpdir()) || !basename(directory).startsWith("rifal-env-")) throw new Error("Unsafe temporary directory");
      rmSync(directory, { recursive: true });
    }
  }
});
