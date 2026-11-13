import { beforeAll, describe, expect, it, vi } from "vitest";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { signSessionToken } from "@/lib/auth";
import { seedCatalog } from "../../prisma/seed-catalog";
import { TEST_ADMIN_USERNAME } from "../fixtures/credentials";
import { spawnSync } from "node:child_process";
import { verifyPassword } from "@/lib/auth";

const session = vi.hoisted(() => ({ token: undefined as string | undefined }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => session.token ? { value: session.token } : undefined }) }));
import { PATCH as updatePackage } from "@/app/api/admin/packages/[id]/route";
import { PATCH as updateSettings } from "@/app/api/admin/settings/route";
import { POST as createPortfolio } from "@/app/api/admin/portfolio/route";
import { POST as createTestimonial } from "@/app/api/admin/testimonials/route";

let adminId: string;
beforeAll(async () => {
  if (process.env.RIFAL_TEST_MODE !== "integration") throw new Error("Use npm run test:integration with a dedicated test database.");
  const admin = await prisma.adminUser.findUniqueOrThrow({ where: { username: TEST_ADMIN_USERNAME } });
  adminId = admin.id;
  session.token = signSessionToken({ userId: admin.id, username: admin.username, role: admin.role });
});
const request = (body: unknown) => new Request("http://localhost/api/admin", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

describe("Database-backed admin regressions", () => {
  it("bootstraps credentials explicitly and never silently replaces an existing password", async () => {
    const username = 'bootstrap-regression';
    const env = { ...process.env, ADMIN_USERNAME: username, ADMIN_EMAIL: 'bootstrap@example.invalid', ADMIN_NAME: 'Bootstrap test', ADMIN_PASSWORD: 'first-test-password-2026' };
    const run = (args: string[] = [], override = {}) => spawnSync(process.execPath, ['node_modules/tsx/dist/cli.mjs', 'scripts/admin.ts', ...args], { env: { ...env, ...override }, encoding: 'utf8' });
    try {
      const create = run();
      expect(create.status, create.stderr).toBe(0);
      const original = await prisma.adminUser.findUniqueOrThrow({ where: { username } });
      const duplicate = run([], { ADMIN_PASSWORD: 'second-test-password-2026' });
      expect(duplicate.status).toBe(1);
      expect((await prisma.adminUser.findUniqueOrThrow({ where: { username } })).passwordHash).toBe(original.passwordHash);
      const unicode = run(['--reset-password'], { ADMIN_PASSWORD: '字'.repeat(25) });
      expect(unicode.status).toBe(1);
      const reset = run(['--reset-password'], { ADMIN_PASSWORD: 'second-test-password-2026' });
      expect(reset.status, reset.stderr).toBe(0);
      const updated = await prisma.adminUser.findUniqueOrThrow({ where: { username } });
      expect(await verifyPassword('second-test-password-2026', updated.passwordHash)).toBe(true);
      expect(create.stdout + create.stderr + reset.stdout + reset.stderr).not.toContain('test-password-2026');
    } finally { await prisma.adminUser.deleteMany({ where: { username } }); }
  });
  it("rejects malformed JSON, invalid numbers, and foreign variants without a partial package update", async () => {
    const pkg = await prisma.package.findUniqueOrThrow({ where: { slug: "kabah-pelataran" }, include: { variants: true } });
    const context = { params: Promise.resolve({ id: pkg.id }) };
    expect((await updatePackage(new Request("http://localhost", { method: "PATCH", body: "{" }), context)).status).toBe(400);
    for (const price of [-1, 1.1, 2147483648]) expect((await updatePackage(request({ variantUpdates: [{ variantId: pkg.variants[0].id, price }] }), context)).status).toBe(400);
    expect((await updatePackage(request({ name: "MUST NOT SAVE", variantUpdates: [{ variantId: "foreign-id", price: 1 }] }), context)).status).toBe(400);
    expect((await prisma.package.findUniqueOrThrow({ where: { id: pkg.id } })).name).toBe(pkg.name);
    expect((await updateSettings(request({ dpPercentage: 101 }))).status).toBe(400);
    expect((await updatePackage(request({ isActive: true }), { params: Promise.resolve({ id: "missing-package" }) })).status).toBe(404);
  });

  it("rolls back a real database update when its audit insert fails", async () => {
    const pkg = await prisma.package.findUniqueOrThrow({ where: { slug: "kabah-pelataran" } });
    const transaction = prisma.$transaction.bind(prisma);
    const spy = vi.spyOn(prisma, "$transaction").mockImplementationOnce(((callback: (tx: Prisma.TransactionClient) => Promise<unknown>) => transaction(async tx => callback(new Proxy(tx, {
      get(target, key) { return key === "auditLog" ? { create: async () => { throw new Error("Injected audit failure"); } } : Reflect.get(target, key); },
    })))) as typeof prisma.$transaction);
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect((await updatePackage(request({ name: "MUST ROLL BACK" }), { params: Promise.resolve({ id: pkg.id }) })).status).toBe(500);
      expect((await prisma.package.findUniqueOrThrow({ where: { id: pkg.id } })).name).toBe(pkg.name);
    } finally { spy.mockRestore(); log.mockRestore(); }
  });

  it("does not infer consent when creating content", async () => {
    const photo = await createPortfolio(request({ title: "Regression image", location: "MAKKAH", mediaUrl: "/images/hero/hero-makkah.jpeg" }));
    const review = await createTestimonial(request({ clientName: "Regression client", packageTaken: "Test", comment: "Test only" }));
    expect(photo.status).toBe(200); expect(review.status).toBe(200);
    const photoBody = await photo.json(); const reviewBody = await review.json();
    expect(photoBody.data.clientConsent).toBe(false); expect(reviewBody.data.consentGiven).toBe(false);
    await prisma.portfolio.delete({ where: { id: photoBody.data.id } });
    await prisma.testimonial.delete({ where: { id: reviewBody.data.id } });
  });

  it("seeding twice preserves edited prices, settings, private content, admin credentials, and audit history", async () => {
    const variant = await prisma.packageVariant.findFirstOrThrow();
    const settings = await prisma.siteSetting.findUniqueOrThrow({ where: { id: "default" } });
    const admin = await prisma.adminUser.findUniqueOrThrow({ where: { id: adminId } });
    const auditCount = await prisma.auditLog.count();
    const photo = await prisma.portfolio.findUniqueOrThrow({ where: { id: "fixture-private" } });
    try {
      await prisma.packageVariant.update({ where: { id: variant.id }, data: { price: 777777 } });
      await prisma.siteSetting.update({ where: { id: "default" }, data: { dpPercentage: 35 } });
      await seedCatalog(prisma); await seedCatalog(prisma);
      expect((await prisma.packageVariant.findUniqueOrThrow({ where: { id: variant.id } })).price).toBe(777777);
      expect((await prisma.siteSetting.findUniqueOrThrow({ where: { id: "default" } })).dpPercentage).toBe(35);
      expect(await prisma.portfolio.findUniqueOrThrow({ where: { id: photo.id } })).toEqual(photo);
      expect((await prisma.adminUser.findUniqueOrThrow({ where: { id: admin.id } })).passwordHash).toBe(admin.passwordHash);
      expect(await prisma.auditLog.count()).toBe(auditCount);
    } finally {
      await prisma.packageVariant.update({ where: { id: variant.id }, data: { price: variant.price } });
      await prisma.siteSetting.update({ where: { id: "default" }, data: { dpPercentage: settings.dpPercentage } });
    }
  });
});
