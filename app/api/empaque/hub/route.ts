import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { resolverAccesoCatalogo } from "@/lib/acceso-catalogo";
import { DEPOSITOS } from "@/lib/depositos-config";
import { listarEmpaqueHubResumen } from "@/lib/server/tickets-bobeda";

function getSecret() {
  const s = process.env.TABLET_SESSION_SECRET?.trim();
  if (!s) throw new Error("TABLET_SESSION_SECRET no configurada");
  return new TextEncoder().encode(s);
}

/** GET /api/empaque/hub — tarjetas tienda · Bobeda PENDIENTE_ENTREGA */
export async function GET(req: NextRequest) {
  const token = req.cookies.get("tablet-session")?.value;
  if (!token) {
    return NextResponse.json({ ok: false, error: "Sesión expirada" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    const verified = await jwtVerify(token, getSecret());
    payload = verified.payload as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Sesión inválida" }, { status: 401 });
  }

  const acceso = resolverAccesoCatalogo({
    id: Number(payload.user_id),
    nombre: String(payload.nombre ?? ""),
    email: payload.email ? String(payload.email) : null,
    rol_id: Number(payload.rol_id ?? 0),
    categoria: payload.categoria ? String(payload.categoria) : null,
    ente_codigo: payload.ente_codigo != null ? Number(payload.ente_codigo) : null,
  });

  if (!acceso.ok) {
    return NextResponse.json({ ok: false, error: acceso.reason }, { status: 403 });
  }

  const clienteIds =
    acceso.scope === "dios" ? DEPOSITOS.map((d) => d.cliente_id) : [acceso.clienteId];

  const stats = await listarEmpaqueHubResumen(clienteIds);
  const tiendas = DEPOSITOS.filter((d) => clienteIds.includes(d.cliente_id)).map((d) => {
    const row = stats.find((s) => s.cliente_id === d.cliente_id);
    return {
      cliente_id: d.cliente_id,
      ente: d.ente,
      tipo: d.tipo,
      codigo: d.codigo,
      label: `${d.ente} · ${d.tipo}`,
      pares_pendientes: row?.pares_pendientes ?? 0,
      facturas_pendientes: row?.facturas_pendientes ?? 0,
    };
  });

  return NextResponse.json({
    ok: true,
    multi_tienda: acceso.scope === "dios",
    tiendas,
  });
}
