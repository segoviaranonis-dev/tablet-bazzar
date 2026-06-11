import { Pool } from "pg";

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

declare global {
  // eslint-disable-next-line no-var
  var __tabletPgPool: Pool | undefined;
}

export function getPool(): Pool {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL no configurada (solo servidor).");
  }
  if (!globalThis.__tabletPgPool) {
    globalThis.__tabletPgPool = new Pool({
      connectionString: url,
      max: 6,
      ssl:
        url.includes("localhost") || url.includes("127.0.0.1")
          ? false
          : { rejectUnauthorized: false },
    });
  }
  return globalThis.__tabletPgPool;
}
