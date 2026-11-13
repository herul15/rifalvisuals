import nextEnv from "@next/env";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
const { loadEnvConfig } = nextEnv;
const require = createRequire(import.meta.url);

function applicationDatabaseUrls() {
  // Resolve app modes in isolated processes: @next/env caches/mutates process.env.
  // Test mode deliberately ignores .env.local, which must still protect app data.
  const env = { ...process.env, RIFAL_NEXT_ENV_MODULE: require.resolve("@next/env") };
  delete env.__NEXT_PROCESSED_ENV;
  if (env.RIFAL_APPLICATION_DATABASE_URL !== undefined) {
    if (env.RIFAL_APPLICATION_DATABASE_URL) env.DATABASE_URL = env.RIFAL_APPLICATION_DATABASE_URL;
    else delete env.DATABASE_URL;
  }
  const urls = new Set();
  for (const mode of ['development', 'production']) {
    const result = spawnSync(process.execPath, ['-e', `const env = require(process.env.RIFAL_NEXT_ENV_MODULE); env.loadEnvConfig(process.cwd(), process.env.NODE_ENV === 'development'); process.stdout.write(JSON.stringify(process.env.DATABASE_URL || null));`], {
      cwd: process.cwd(), env: { ...env, NODE_ENV: mode }, encoding: 'utf8',
    });
    if (result.error || result.status !== 0) throw new Error('Cannot resolve application database configuration safely.');
    const url = JSON.parse(result.stdout);
    if (url) urls.add(url);
  }
  if (!urls.size) throw new Error('Application DATABASE_URL configuration is required to protect it from fixture reset.');
  return urls;
}

/** @param {Record<string, string | undefined>} env */
export function testDatabaseUrl(env = process.env) {
  const value = env.TEST_DATABASE_URL;
  if (!value) throw new Error("TEST_DATABASE_URL is required. Tests never fall back to DATABASE_URL.");
  const target = new URL(value);
  const database = decodeURIComponent(target.pathname.slice(1));
  if (!['postgresql:', 'postgres:'].includes(target.protocol) || !/^[a-zA-Z0-9_]+_test$/.test(database)) throw new Error("Test database name must end in _test.");
  const applicationUrl = env.RIFAL_APPLICATION_DATABASE_URL ?? env.DATABASE_URL;
  if (applicationUrl) {
    const app = new URL(applicationUrl);
    // Reject identical names even through localhost aliases or different credentials.
    if (decodeURIComponent(app.pathname) === decodeURIComponent(target.pathname)) throw new Error("Test database must differ from the application database.");
  }
  return value;
}

export function configureTestDatabase() {
  const applicationUrls = applicationDatabaseUrls();
  process.env.RIFAL_APPLICATION_DATABASE_URL ??= process.env.DATABASE_URL || '';
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = 'test';
  try { loadEnvConfig(process.cwd(), false, console, true); }
  finally {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
  }
  const url = testDatabaseUrl();
  for (const applicationUrl of applicationUrls) testDatabaseUrl({ ...process.env, RIFAL_APPLICATION_DATABASE_URL: applicationUrl });
  process.env.DATABASE_URL = url;
  return url;
}
