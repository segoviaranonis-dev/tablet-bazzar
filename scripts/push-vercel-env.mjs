/**
 * Sube variables de .env.local a Vercel (production + preview).
 * Uso: node scripts/push-vercel-env.mjs
 */
import { readFileSync, existsSync } from "fs";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env.local");

const KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "TABLET_SESSION_SECRET",
  "DATABASE_URL",
];

function parseEnv(text) {
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 1) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

function runVercel(args) {
  const r = spawnSync("npx", ["vercel", ...args], {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
  return r.status === 0;
}

if (!existsSync(envPath)) {
  console.error("Falta .env.local en tablet-bazzar");
  process.exit(1);
}

const env = parseEnv(readFileSync(envPath, "utf8"));

for (const key of KEYS) {
  const val = env[key];
  if (!val) {
    console.warn(`SKIP ${key} (no en .env.local)`);
    continue;
  }
  if (!runVercel(["env", "add", key, "production", "--value", val, "--yes", "--force"])) {
    console.error(`FAIL ${key} production`);
    process.exit(1);
  }
  console.log(`OK ${key} → production`);
  if (!runVercel(["env", "add", key, "preview", "--value", val, "--yes", "--force"])) {
    console.error(`FAIL ${key} preview`);
    process.exit(1);
  }
  console.log(`OK ${key} → preview`);
}

console.log("Variables subidas.");
