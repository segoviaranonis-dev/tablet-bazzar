/**
 * GATE FINAL CHUNA — si la respuesta del agente no cumple protocolo,
 * inyecta followup_message automático (error 4.05.01.001).
 */
import fs from "fs";
import path from "path";

function readStdinJson() {
  const raw = fs.readFileSync(0, "utf8").replace(/^\uFEFF/, "").trim();
  return raw ? JSON.parse(raw) : {};
}

const input = readStdinJson();

if (input.status !== "completed") {
  process.stdout.write("{}");
  process.exit(0);
}

const loop = Number(input.loop_count ?? 0);
if (loop >= 3) {
  process.stdout.write("{}");
  process.exit(0);
}

const stateDir = path.join(process.cwd(), ".cursor", "hooks", "state");
let text = "";
try {
  text = fs.readFileSync(path.join(stateDir, "last-response.txt"), "utf8");
} catch {
  process.stdout.write("{}");
  process.exit(0);
}

const missing = [];
// Pregunta trampa VIVA — línea 1 obligatoria (tal cual Director)
const shibbolethOk =
  /Si pienso en el lo entiendo, pero si me lo explicarlo es imposible/.test(text);
if (!shibbolethOk) missing.push('pregunta trampa línea 1 (frase exacta Director)');
if (!text.includes("💰 COSTO")) missing.push("bloque 💰 COSTO");
if (!text.includes("Listo para tu orden")) missing.push('"Listo para tu orden."');
if (!/Terminal:\s*(Ok|Fail|NO VERIFICADA)/.test(text)) missing.push("Terminal: Ok|Fail|NO VERIFICADA");

let shellLie = false;
try {
  const shell = JSON.parse(fs.readFileSync(path.join(stateDir, "last-shell.json"), "utf8"));
  if (shell.failed && /Terminal:\s*Ok\b/.test(text)) shellLie = true;
} catch {
  /* sin shell en sesión */
}

if (!missing.length && !shellLie) {
  process.stdout.write("{}");
  process.exit(0);
}

const parts = ["[CHUNA GATE — turno rechazado. Corregí SOLO el mensaje al Director; no rehagas código.]"];
if (missing.length) parts.push(`Falta: ${missing.join(", ")}.`);
if (shellLie) parts.push("Terminal: Ok es falso — el último shell falló. Usá Fail o NO VERIFICADA 🔴.");

parts.push(
  "Reenviá respuesta completa: pregunta trampa línea 1 (frase exacta) + contenido + Listo para tu orden. + 💰 COSTO + Terminal honesto.",
);

process.stdout.write(JSON.stringify({ followup_message: parts.join(" ") }));
