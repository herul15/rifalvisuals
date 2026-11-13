import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { configureTestDatabase } from "./test-environment.mjs";

const mode = process.argv[2];
if (!['unit', 'integration', 'e2e', 'setup'].includes(mode)) throw new Error('Unknown test mode.');
process.env.JWT_SECRET = process.env.TEST_JWT_SECRET || randomBytes(48).toString('hex');
process.env.RIFAL_TEST_MODE = mode;
if (mode !== 'unit') configureTestDatabase();
function run(script, args) {
  const result = spawnSync(process.execPath, [script, ...args], { stdio: 'inherit', env: process.env });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
if (mode === 'setup') {
  run('node_modules/prisma/build/index.js', ['migrate', 'deploy']);
  run('node_modules/tsx/dist/cli.mjs', ['tests/fixtures/seed.ts']);
} else if (mode === 'e2e') {
  run('node_modules/playwright/cli.js', ['test', ...process.argv.slice(3)]);
} else {
  run('node_modules/vitest/vitest.mjs', ['run', 'tests/' + mode, ...process.argv.slice(3)]);
}
