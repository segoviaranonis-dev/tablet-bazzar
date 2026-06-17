import { NextRequest, NextResponse } from "next/server";
import { parseDepositoFiltersFromSearchParams, DEPOSITO_LIMIT_OPTIONS } from "@/lib/deposito-filters";
import { getDepositoByClienteId } from "@/lib/depositos-config";
import { moleculeKey, type MoleculeFk } from "@/lib/deposito-cohorte";
import { getPool, isDatabaseConfigured } from "@/lib/pool";
import { enrichDepositoFilaImagenes } from "@/lib/product-image";
import { sqlDepositoMolecules } from "@/lib/server/deposito-filtros-sql";
import { fetchStockRedBatch } from "@/lib/server/stock-red-batch";
import type { StockUbicacionBloque } from "@/lib/stock-otros-locales";
import { totalStockRed } from "@/lib/stock-otros-locales";
import { ubicacionIdFromClienteId } from "@/lib/ubicaciones";

export type DepositoProducto = {
  linea_id: number | null;
  referencia_id: number | null;
  material_id: number | null;
  color_id: number | null;
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
  cantidad_local: number;
  cantidad_red: number;
  imagen_nombre: string | null;
  imagen_url_thumb: string | null;
  imagen_url_hero: string | null;
  stock_red?: StockUbicacionBloque[];
};

type MoleculeRow = Omit<DepositoProducto, "cantidad_red" | "imagen_url_thumb" | "imagen_url_hero" | "stock_red">;

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
  const includeRed = sp.get("stock_red") !== "0";

  const pool = getPool();
  const q = sqlDepositoMolecules(config.tabla, filtros, limit);
  const { rows } = await pool.query<MoleculeRow>(q.text, q.params);

  const totalPares = rows.reduce((sum, r) => sum + Number(r.cantidad_local), 0);

  let stockRedMap = new Map<string, StockUbicacionBloque[]>();
  if (includeRed && rows.length > 0) {
    const molecules: MoleculeFk[] = rows.map((r) => ({
      linea_id: r.linea_id != null ? Number(r.linea_id) : null,
      referencia_id: r.referencia_id != null ? Number(r.referencia_id) : null,
      material_id: r.material_id != null ? Number(r.material_id) : null,
      color_id: r.color_id != null ? Number(r.color_id) : null,
      linea_codigo_proveedor: r.linea_codigo_proveedor,
      referencia_codigo_proveedor: r.referencia_codigo_proveedor,
      material_code: r.material_code,
      color_code: r.color_code,
    }));
    stockRedMap = await fetchStockRedBatch(
      pool,
      cliente_id,
      molecules,
      ubicacionIdFromClienteId(cliente_id),
    );
  }

  const productos: DepositoProducto[] = rows.map((r) => {
    const mk = moleculeKey({
      linea_id: r.linea_id != null ? Number(r.linea_id) : null,
      referencia_id: r.referencia_id != null ? Number(r.referencia_id) : null,
      material_id: r.material_id != null ? Number(r.material_id) : null,
      color_id: r.color_id != null ? Number(r.color_id) : null,
      linea_codigo_proveedor: r.linea_codigo_proveedor,
      referencia_codigo_proveedor: r.referencia_codigo_proveedor,
      material_code: r.material_code,
      color_code: r.color_code,
    });
    const stock_red = stockRedMap.get(mk);
    const enriched = enrichDepositoFilaImagenes({
      ...r,
      grada: "",
      cantidad: r.cantidad_local,
    });
    const cantidad_red = stock_red ? totalStockRed(stock_red) : r.cantidad_local;
    return {
      linea_id: r.linea_id,
      referencia_id: r.referencia_id,
      material_id: r.material_id,
      color_id: r.color_id,
      linea_codigo_proveedor: r.linea_codigo_proveedor,
      referencia_codigo_proveedor: r.referencia_codigo_proveedor,
      material_code: r.material_code,
      color_code: r.color_code,
      marca: r.marca,
      genero: r.genero,
      estilo: r.estilo,
      tipo_v2: r.tipo_v2,
      descp_material: r.descp_material,
      descp_color: r.descp_color,
      cantidad_local: r.cantidad_local,
      cantidad_red,
      imagen_nombre: r.imagen_nombre,
      imagen_url_thumb: enriched.imagen_url_thumb,
      imagen_url_hero: enriched.imagen_url_hero,
      ...(stock_red ? { stock_red } : {}),
    };
  });

  return NextResponse.json({
    configured: true,
    cliente_id,
    ente: config.ente,
    tipo: config.tipo,
    codigo: config.codigo,
    productos,
    total: rows.length,
    total_pares_muestra: totalPares,
    limit: limit ?? "all",
    unidad: "molecula_fk",
  });
}
