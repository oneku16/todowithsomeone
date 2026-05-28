import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function getTursoConfig(): { url: string; authToken: string } | null {
  const url = process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url?.startsWith("libsql:") || !authToken) {
    return null;
  }

  return { url, authToken };
}

function createPrismaClient() {
  const turso = getTursoConfig();

  if (turso) {
    const adapter = new PrismaLibSql({
      url: turso.url,
      authToken: turso.authToken,
    });
    return new PrismaClient({ adapter });
  }

  const connectionString = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  const adapter = new PrismaBetterSqlite3({ url: connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
