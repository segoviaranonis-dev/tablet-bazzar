import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env.local");
  const migPath = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.join(root, "..", "control_central", "migrations", "121_clients_bazaar.sql");

const env = fs.readFileSync(envPath, "utf8");
const match = env.match(/^DATABASE_URL=(.+)$/m);
if (!match) {
  console.error("NO_DATABASE_URL");
  process.exit(1);
}

const url = match[1].trim().replace(/^["']|["']$/g, "");
const sql = fs.readFileSync(migPath, "utf8");
const local = url.includes("localhost") || url.includes("127.0.0.1");

const client = new pg.Client({
  connectionString: url,
  ssl: local ? false : { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);
  const check = await client.query(`
    SELECT
      to_regclass('public.clients_bazaar') IS NOT NULL AS table_ok,
      (SELECT COUNT(*)::int FROM public.clients_bazaar) AS row_count,
      EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'clients_bazaar' AND column_name = 'registro_ente_codigo'
      ) AS origen_ok,
      (SELECT COUNT(*)::int FROM public.entes WHERE codigo BETWEEN 1 AND 5) AS entes_count
  `);
  console.log("MIG_OK", JSON.stringify(check.rows[0]));
} catch (e) {
  console.error("MIG_FAIL", e.message);
  process.exit(1);
} finally {
  await client.end();
}
