import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { configureTestDatabase } from "../../scripts/test-environment.mjs";
import { seedCatalog } from "../../prisma/seed-catalog";
import { TEST_ADMIN_USERNAME, TEST_ADMIN_PASSWORD } from "./credentials";

configureTestDatabase();
const prisma = new PrismaClient();
try {
  await prisma.$transaction([
    prisma.auditLog.deleteMany(), prisma.trackingEvent.deleteMany(), prisma.packageAddOn.deleteMany(),
    prisma.addOn.deleteMany(), prisma.packageVariant.deleteMany(), prisma.package.deleteMany(),
    prisma.packageCategory.deleteMany(), prisma.portfolio.deleteMany(), prisma.testimonial.deleteMany(),
    prisma.instagramPost.deleteMany(), prisma.siteSetting.deleteMany(), prisma.adminUser.deleteMany(),
  ]);
  await seedCatalog(prisma);
  await prisma.adminUser.create({ data: { username: TEST_ADMIN_USERNAME, email: 'test-admin@example.invalid', name: 'Test administrator', passwordHash: await bcrypt.hash(TEST_ADMIN_PASSWORD, 10), role: 'SUPER_ADMIN' } });
  await prisma.portfolio.createMany({ data: [
    { id: 'fixture-public', title: 'Dokumentasi pengujian Makkah', location: 'MAKKAH', mediaUrl: '/images/hero/hero-makkah.jpeg', clientConsent: true },
    { id: 'fixture-private', title: 'PRIVATE FIXTURE DO NOT PUBLISH', location: 'MAKKAH', mediaUrl: '/images/hero/hero-jabal.jpeg', clientConsent: false },
  ] });
  await prisma.testimonial.createMany({ data: [
    { id: 'fixture-public-review', clientName: 'Jamaah Pengujian', packageTaken: "Ka'bah & Pelataran", comment: 'Ulasan khusus pengujian otomatis.', consentGiven: true },
    { id: 'fixture-private-review', clientName: 'PRIVATE FIXTURE REVIEW', packageTaken: 'Pengujian', comment: 'Tidak boleh dipublikasikan.', consentGiven: false },
  ] });
  console.log('Dedicated test database fixtures reset.');
} finally { await prisma.$disconnect(); }
