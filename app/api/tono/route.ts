import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getPool, isDatabaseConfigured } from "@/lib/pool";
import { loadTonoEstandar } from "@/lib/server/tono-sql";
import { PROVEEDOR_CALZADO_ID } from "@/lib/tono/color-canon";

function getSecret() {
  if (!process.env.TABLET_SESSION_SECRET) {
    throw new Error("TABLET_SESSION_SECRET no configurada");
  }
  return new TextEncoder().encode(process.env.TABLET_SESSION_SECRET);
}

/** Catálogo color_tono_estandar — Editor TONO (Vía A). */
export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ configured: false, estandar: [] }, { status: 503 });
  }

  try {
    const pool = getPool();
    const estandar = await loadTonoEstandar(pool, PROVEEDOR_CALZADO_ID);
    return NextResponse.json({ configured: true, estandar });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error catálogo TONO";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

async function requireRimecGerente() {
  const token = (await cookies()).get("tablet-session")?.value;
  if (!token) return { ok: false as const, status: 401, error: "Sesión requerida" };
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (Number(payload.rol_id) !== 1) {
      return { ok: false as const, status: 403, error: "Asignar TONO requiere rol holding (rol_id=1)" };
    }
    return { ok: true as const };
  } catch {
    return { ok: false as const, status: 401, error: "Sesión inválida" };
  }
}

/** PATCH tono_canon — tablet editor = quirúrgico (1 color_id). Sync lote solo si sync_predominante=true. */
export async function PATCH(req: Request) {
  const gate = await requireRimecGerente();
  if (!gate.ok) {
    return NextResponse.json({ ok: false, error: gate.error }, { status: gate.status });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL no configurada" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const colorId = Number(body.color_id);
    if (!Number.isFinite(colorId)) {
      return NextResponse.json({ ok: false, error: "color_id requerido" }, { status: 400 });
    }

    const { estandarToTono, findColorEstandarInCatalog } = await import("@/lib/tono/colores-estandar");
    const { parseTonoCanon, colorPredominante } = await import("@/lib/tono/color-canon");
    const { patchTonoByPredominante, patchTonoColor, loadTonoEstandar } = await import("@/lib/server/tono-sql");

    const pool = getPool();
    const catalog = await loadTonoEstandar(pool);

    let tono: Record<string, unknown> | null = null;
    if (body.clear_tono) {
      tono = null;
    } else if (body.tono_canon) {
      const parsed = parseTonoCanon(body.tono_canon);
      if (!parsed) return NextResponse.json({ ok: false, error: "tono_canon inválido" }, { status: 400 });
      tono = parsed;
    } else {
      const etiqueta = String(body.etiqueta ?? "").trim();
      const std = findColorEstandarInCatalog(etiqueta, catalog);
      if (!std) return NextResponse.json({ ok: false, error: "Etiqueta TONO desconocida" }, { status: 400 });
      tono = estandarToTono(std);
    }

    const syncPred = body.sync_predominante === true;
    const predominante = String(body.predominante ?? "").trim();

    if (syncPred && predominante) {
      const n = await patchTonoByPredominante(pool, PROVEEDOR_CALZADO_ID, predominante, tono);
      return NextResponse.json({ ok: true, updated: n, sync_predominante: true });
    }

    const ok = await patchTonoColor(pool, PROVEEDOR_CALZADO_ID, colorId, tono);
    if (!ok) return NextResponse.json({ ok: false, error: "color_id no encontrado" }, { status: 404 });

    if (syncPred && !predominante) {
      const { rows } = await pool.query<{ nombre: string | null }>(
        `SELECT nombre FROM color WHERE id = $1 AND proveedor_id = $2`,
        [colorId, PROVEEDOR_CALZADO_ID],
      );
      const pred = colorPredominante(rows[0]?.nombre);
      if (pred) {
        const n = await patchTonoByPredominante(pool, PROVEEDOR_CALZADO_ID, pred, tono);
        return NextResponse.json({ ok: true, updated: n, sync_predominante: true, predominante: pred });
      }
    }

    return NextResponse.json({ ok: true, updated: 1, sync_predominante: false });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error PATCH TONO";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
