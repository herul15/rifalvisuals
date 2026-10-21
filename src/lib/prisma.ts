import { PrismaClient } from "@prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use explicit local sqlite path unless explicitly overridden by RIFAL_DATABASE_URL
const sqlitePath = path.resolve(process.cwd(), "prisma/dev.db");
const databaseUrl =
  process.env.RIFAL_DATABASE_URL ||
  (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("file:")
    ? process.env.DATABASE_URL
    : `file:${sqlitePath}`);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
