import { NextRequest, NextResponse } from "next/server";
import { readTabletSession } from "@/lib/auth/tablet-session";
import { origenDesdeTiendaClienteId } from "@/lib/bazzar-origen";
import { buscarClienteBazaarPorCedula, upsertClienteBazaar } from "@/lib/server/clients-bazaar";
import { checkRateLimit, pruneRateLimitStore } from "@/lib/security/rate-limit";

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  const vendedor = await readTabletSession(req);
  if (!vendedor) {
    return NextResponse.json({ ok: false, error: "Sesión expirada — volvé a ingresar" }, { status: 401 });
  }

  pruneRateLimitStore();
  const ip = clientIp(req);
  const { ok, retryAfterSec } = checkRateLimit(`${ip}:registrar-cliente`, 15, 60_000);
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

  const cedula = String(body.cedula ?? "");
  const id = await upsertClienteBazaar({
    cedula,
    nombre: typeof body.nombre === "string" ? body.nombre : null,
    apellido: typeof body.apellido === "string" ? body.apellido : null,
    telefono: typeof body.telefono === "string" ? body.telefono : null,
    ruc: typeof body.ruc === "string" ? body.ruc : null,
    razon_social: typeof body.razon_social === "string" ? body.razon_social : null,
    origen,
  });

  if (!id) {
    return NextResponse.json(
      { ok: false, error: "No se pudo registrar — revisá cédula, celular y campos obligatorios" },
      { status: 400 },
    );
  }

  const cliente = await buscarClienteBazaarPorCedula(cedula);
  return NextResponse.json({ ok: true, id, cliente });
}
