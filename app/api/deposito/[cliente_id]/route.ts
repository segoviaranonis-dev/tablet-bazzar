import { NextRequest, NextResponse } from "next/server";
import {
  DEPOSITO_LIMIT_OPTIONS,
  parseDepositoFiltersFromSearchParams,
} from "@/lib/deposito-filters";
import { getDepositoByClienteId } from "@/lib/depositos-config";
import { getPool, isDatabaseConfigured } from "@/lib/pool";
import { enrichDepositoFilaImagenes } from "@/lib/product-image";
import { sqlDepositoFilasGrada } from "@/lib/server/deposito-filtros-sql";

export type DepositoProducto = {
  linea_codigo_proveedor: string;
  referencia_codigo_proveedor: string;
  material_code: string;
  color_code: string;
  marca: string;
  genero: string;
  estilo: string;
  tipo_v2: string;
  descp_material: string | null;
  descp_color: string | null;
  tono_etiqueta: string | null;
  grada: string;
  cantidad: number;
  /** LPN CSV → deposito.precio_unitario (Gs/par) */
  precio_unitario: number | null;
  imagen_nombre: string | null;
  imagen_url_thumb: string | null;
  imagen_url_hero: string | null;
  imagen_url_flat?: string | null;
};

function parseLimit(raw: string | null): number | null {
  if (raw === "all") return null;
  const n = Number(raw ?? "80");
  if (!Number.isFinite(n) || n <= 0) return 80;
  if ((DEPOSITO_LIMIT_OPTIONS as readonly number[]).includes(n)) return n;
  return 80;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ cliente_id: string }> },
) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { configured: false, productos: [], error: "DATABASE_URL no configurada" },
      { status: 500 },
    );
  }

  const { cliente_id: idStr } = await params;
  const cliente_id = Number(idStr);
  const config = getDepositoByClienteId(cliente_id);
  if (!config) {
    return NextResponse.json(
      { configured: true, productos: [], error: `cliente_id ${cliente_id} inválido` },
      { status: 400 },
    );
  }

  const sp = new URL(req.url).searchParams;
  const filtros = parseDepositoFiltersFromSearchParams(sp);
  const limit = parseLimit(sp.get("limit"));

  const pool = getPool();

  try {
    const q = sqlDepositoFilasGrada(config.tabla, filtros, limit);
    const { rows } = await pool.query<DepositoProducto>(q.text, q.params);

    const totalPares = rows.reduce((sum, r) => sum + Number(r.cantidad), 0);

    return NextResponse.json({
      configured: true,
      cliente_id,
      ente: config.ente,
      tipo: config.tipo,
      codigo: config.codigo,
      productos: rows.map(enrichDepositoFilaImagenes),
      total: rows.length,
      total_pares_muestra: totalPares,
      limit: limit ?? "all",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error SQL depósito";
    return NextResponse.json(
      { configured: true, productos: [], error: msg },
      { status: 500 },
    );
  }
}
