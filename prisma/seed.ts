import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;
import { PrismaClient } from "@prisma/client";
import { seedCatalog } from "./seed-catalog";
loadEnvConfig(process.cwd());
const prisma = new PrismaClient();
try { await seedCatalog(prisma); console.log("Missing catalogue records initialized; existing data preserved."); }
finally { await prisma.$disconnect(); }
