/** CHUNA — inyecta gate al abrir sesión Agent en Nexus_Core */
import fs from "fs";

function readStdinJson() {
  const raw = fs.readFileSync(0, "utf8").replace(/^\uFEFF/, "").trim();
  return raw ? JSON.parse(raw) : {};
}

const input = readStdinJson();
const mode = input.composer_mode ?? "agent";

if (mode === "ask") {
  process.stdout.write("{}");
  process.exit(0);
}

const ctx = [
  "⛔ CHUNA GATE (hook sessionStart · Nexus_Core).",
  "Todo mensaje al Director DEBE:",
  "1) Línea 1 literal: Andrés, el que viene. Protocolo Moises Activado · Moria + ACTUAL acatados.",
  "2) Si sesión nueva o post-resumen: leer .claude/4_etapas/ACTUAL.md.",
  "3) Si hubo shell: leer salida COMPLETA (sin pipe); Terminal honesto.",
  "4) Cierre: Listo para tu orden. + bloque 💰 COSTO con Terminal: Ok|Fail|NO VERIFICADA.",
  "Sin cierre = turno inválido (4.05.01.001). El hook stop rechazará el turno.",
].join(" ");

process.stdout.write(JSON.stringify({ additional_context: ctx }));
