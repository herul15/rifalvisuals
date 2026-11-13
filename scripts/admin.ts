import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";
import { z } from "zod";

loadEnvConfig(process.cwd());
const input = z.object({
  ADMIN_USERNAME: z.string().trim().min(1).max(100),
  ADMIN_EMAIL: z.email(), ADMIN_NAME: z.string().trim().min(1).max(200),
  ADMIN_PASSWORD: z.string().min(12).refine(password => Buffer.byteLength(password) <= 72, "Password must be at most 72 UTF-8 bytes."),
}).parse(process.env);
const prisma = new PrismaClient();
try {
  const existing = await prisma.adminUser.findUnique({ where: { username: input.ADMIN_USERNAME } });
  const reset = process.argv.includes('--reset-password');
  if (reset && !existing) throw new Error('Admin not found. Create the account without --reset-password.');
  if (existing && !reset) throw new Error('Admin already exists. Explicit --reset-password is required to change a password.');
  const passwordHash = await hashPassword(input.ADMIN_PASSWORD);
  if (existing) await prisma.adminUser.update({ where: { id: existing.id }, data: { passwordHash } });
  else await prisma.adminUser.create({ data: { username: input.ADMIN_USERNAME, email: input.ADMIN_EMAIL, name: input.ADMIN_NAME, passwordHash, role: 'SUPER_ADMIN' } });
  console.log(reset ? 'Admin password updated. Rotate JWT_SECRET to invalidate existing sessions.' : 'Admin created.');
} finally { await prisma.$disconnect(); }
