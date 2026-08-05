import { NextRequest, NextResponse } from "next/server";
import { readTabletSession } from "@/lib/auth/tablet-session";
import { origenDesdeTiendaClienteId } from "@/lib/bazzar-origen";
import {
  buscarClienteBazaarPorCedula,
  normalizarCedula,
  normalizarEmailContacto,
  normalizarTelefonoContacto,
  upsertClienteBazaar,
} from "@/lib/server/clients-bazaar";
import { checkRateLimit, pruneRateLimitStore } from "@/lib/security/rate-limit";

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown";
}

/** Actualiza teléfono/correo (y nombre opcional) en clients_bazaar durante venta POS. */
export async function POST(req: NextRequest) {
  const vendedor = await readTabletSession(req);
  if (!vendedor) {
    return NextResponse.json({ ok: false, error: "Sesión expirada — volvé a ingresar" }, { status: 401 });
  }

  pruneRateLimitStore();
  const ip = clientIp(req);
  const { ok, retryAfterSec } = checkRateLimit(`${ip}:contacto-cliente`, 30, 60_000);
  if (!ok) {
    return NextResponse.json(
      { ok: false, error: `Demasiados intentos. Esperá ${retryAfterSec ?? 60} segundos.` },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const cliente_id = Number(body.cliente_id);
  const origen = origenDesdeTiendaClienteId(cliente_id);
  if (!origen) {
    return NextResponse.json({ ok: false, error: "Tienda inválida" }, { status: 400 });
  }

  const cedula = normalizarCedula(String(body.cedula ?? ""));
  if (!cedula) {
    return NextResponse.json({ ok: false, error: "Cédula inválida" }, { status: 400 });
  }

  const telefonoRaw = typeof body.telefono === "string" ? body.telefono : "";
  const emailRaw = typeof body.email === "string" ? body.email : "";
  const telefono = normalizarTelefonoContacto(telefonoRaw);
  const email = normalizarEmailContacto(emailRaw);

  if (telefonoRaw.trim() && !telefono) {
    return NextResponse.json({ ok: false, error: "Celular inválido (6–20 caracteres)" }, { status: 400 });
  }
  if (emailRaw.trim() && !email) {
    return NextResponse.json({ ok: false, error: "Correo electrónico inválido" }, { status: 400 });
  }
  if (!telefono && !email) {
    return NextResponse.json({ ok: false, error: "Ingresá celular o correo para guardar" }, { status: 400 });
  }

  const existente = await buscarClienteBazaarPorCedula(cedula);
  const nombre =
    typeof body.nombre === "string" && body.nombre.trim()
      ? body.nombre.trim()
      : existente?.nombre?.trim() || "Cliente";
  const apellido =
    typeof body.apellido === "string" ? body.apellido.trim() || null : existente?.apellido?.trim() || null;

  const id = await upsertClienteBazaar({
    cedula,
    nombre,
    apellido,
    telefono,
    email,
    origen,
  });

  if (!id) {
    return NextResponse.json({ ok: false, error: "No se pudo actualizar contacto" }, { status: 400 });
  }

  const cliente = await buscarClienteBazaarPorCedula(cedula);
  return NextResponse.json({ ok: true, cliente });
}
