import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const reportEnv = fs.readFileSync(path.join(root, "..", "report", ".env.local"), "utf8");
const tabletEnvPath = path.join(root, ".env.local");

const dbLine = reportEnv.match(/^DATABASE_URL=.+$/m)?.[0];
if (!dbLine) {
  console.error("DATABASE_URL missing in report/.env.local");
  process.exit(1);
}

let tabletEnv = fs.existsSync(tabletEnvPath)
  ? fs.readFileSync(tabletEnvPath, "utf8")
  : "";

if (/^DATABASE_URL=/m.test(tabletEnv)) {
  tabletEnv = tabletEnv.replace(/^DATABASE_URL=.+$/m, dbLine);
} else {
  tabletEnv = tabletEnv.trimEnd() + "\n" + dbLine + "\n";
}

fs.writeFileSync(tabletEnvPath, tabletEnv);
console.log("DATABASE_URL synced to tablet-bazzar/.env.local");
